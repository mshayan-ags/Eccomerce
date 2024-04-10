const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { APP_SECRET, getUserId, getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const Verifier = require("email-validator");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { SaveImageDB } = require("./Image");
const { sendOtpEmail } = require("../utils/mailer");
const { default: mongoose } = require("mongoose");

const router = Router();

const OTP_TTL_MS = 10 * 60 * 1000;

function generateOtp() {
	return crypto.randomInt(100000, 999999).toString();
}

router.post("/SignUp", async (req, res) => {
	try {
		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["name", "email", "password"], res);
		if (Check) {
			return;
		}

		if (!Verifier.validate(Credentials?.email)) {
			return res.status(400).json({ status: 400, message: "Please Change your email as it's not valid" });
		}

		const password = await bcrypt.hash(Credentials?.password, 12);

		const newUser = new User({
			name: Credentials?.name,
			email: Credentials?.email,
			password: password
		});

		if (Credentials?.profilePicture?.data) {
			const image = await SaveImageDB(
				Credentials?.profilePicture,
				{ User: new mongoose.Types.ObjectId(newUser?._id) },
				res
			);

			if (image?.file?._id) {
				newUser.profilePicture = new mongoose.Types.ObjectId(image?.file?._id);
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}

		await newUser.save();

		const token = jwt.sign({ id: newUser?._id }, APP_SECRET, { expiresIn: "7d" });

		res.status(200).json({
			token,
			id: newUser?._id,
			status: 200,
			message: "User Created in Succesfully"
		});
	} catch (error) {
		if (error?.code == 11000) {
			res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`
			});
		} else {
			res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
		}
	}
});

// Lets a shopper check out without creating a real account. A minimal User
// still has to exist (Sale, Address, etc. all reference one), but it's
// created transparently here with an unusable random password instead of
// asking the shopper to pick one - this endpoint's token is only ever good
// for finishing this one order, not for a real login.
router.post("/Guest-Checkout", async (req, res) => {
	try {
		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["name", "email"], res);
		if (Check) {
			return;
		}

		if (!Verifier.validate(Credentials?.email)) {
			return res.status(400).json({ status: 400, message: "Please Change your email as it's not valid" });
		}

		const existingUser = await User.findOne({ email: Credentials?.email });
		if (existingUser?._id && !existingUser?.isGuest) {
			return res.status(409).json({
				status: 409,
				message: "An account already exists with this email. Please login instead."
			});
		}

		let guestUser = existingUser;
		if (!guestUser?._id) {
			const password = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);
			guestUser = new User({
				name: Credentials?.name,
				email: Credentials?.email,
				password,
				isGuest: true,
				subscriber: false
			});
			await guestUser.save();
		}

		const token = jwt.sign({ id: guestUser?._id }, APP_SECRET, { expiresIn: "7d" });

		res.status(200).json({
			token,
			id: guestUser?._id,
			status: 200,
			message: "Guest Checkout Ready"
		});
	} catch (error) {
		if (error?.code == 11000) {
			res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`
			});
		} else {
			res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
		}
	}
});

router.post("/Verify-OTP", async (req, res) => {
	try {
		const Check = await CheckAllRequiredFieldsAvailaible(req.body, ["email", "otp"], res);
		if (Check) {
			return;
		}

		const searchUser = await User.findOne({ email: req.body?.email }).select("+otp +otpExpiresAt");

		const isValidOtp =
			searchUser?.otp &&
			searchUser.otp === req.body?.otp &&
			searchUser.otpExpiresAt &&
			searchUser.otpExpiresAt.getTime() > Date.now();

		if (isValidOtp) {
			await User.updateOne({ _id: searchUser?._id }, { isVerified: true, otp: null, otpExpiresAt: null });
			res.status(200).json({ id: searchUser?._id, status: 200, message: "Your Account is Verified" });
		} else {
			res.status(401).json({ status: 401, message: "You Have Entered Wrong Otp or it has expired" });
		}
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Forget-Password", async (req, res) => {
	try {
		const Check = await CheckAllRequiredFieldsAvailaible(req?.body, ["email"], res);
		if (Check) {
			return;
		}

		const searchUser = await User.findOne({ email: req.body?.email });
		if (!searchUser?._id) {
			// Don't reveal whether the email exists - avoids leaking which emails are registered.
			return res.status(200).json({ status: 200, message: "If that account exists, a code has been sent" });
		}

		const otp = generateOtp();
		await User.updateOne(
			{ _id: searchUser?._id },
			{ otp, otpExpiresAt: new Date(Date.now() + OTP_TTL_MS) }
		);
		await sendOtpEmail(searchUser.email, otp);

		res.status(200).json({ status: 200, message: "If that account exists, a code has been sent" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Resend-OTP", async (req, res) => {
	try {
		const Check = await CheckAllRequiredFieldsAvailaible(req?.body, ["email"], res);
		if (Check) {
			return;
		}

		const searchUser = await User.findOne({ email: req.body?.email });
		if (!searchUser?._id) {
			return res.status(200).json({ status: 200, message: "If that account exists, a code has been sent" });
		}

		const otp = generateOtp();
		await User.updateOne(
			{ _id: searchUser?._id },
			{ otp, otpExpiresAt: new Date(Date.now() + OTP_TTL_MS) }
		);
		await sendOtpEmail(searchUser.email, otp);

		res.status(200).json({ status: 200, message: "If that account exists, a code has been sent" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Reset-Password", async (req, res) => {
	try {
		const Check = await CheckAllRequiredFieldsAvailaible(req?.body, ["email", "otp", "newPassword"], res);
		if (Check) {
			return;
		}

		const searchUser = await User.findOne({ email: req.body?.email }).select("+otp +otpExpiresAt");

		const isValidOtp =
			searchUser?.otp &&
			searchUser.otp === req.body?.otp &&
			searchUser.otpExpiresAt &&
			searchUser.otpExpiresAt.getTime() > Date.now();

		if (!isValidOtp) {
			return res.status(401).json({ status: 401, message: "You Have Entered Wrong Otp or it has expired" });
		}

		const password = await bcrypt.hash(req.body.newPassword, 12);
		await User.updateOne({ _id: searchUser?._id }, { password, otp: null, otpExpiresAt: null, isVerified: true });

		res.status(200).json({ status: 200, message: "Your Password has been Reset" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Change-Password", async (req, res) => {
	try {
		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["password", "email", "newPassword"], res);
		if (Check) {
			return;
		}

		const searchUser = await User.findOne({ email: Credentials?.email }).select("+password");
		if (!searchUser?.password || !searchUser?._id) {
			return res.status(404).json({ status: 404, message: "User Not Found or wrong email" });
		}

		const valid = await bcrypt.compare(Credentials?.password, searchUser.password);
		if (!valid) {
			return res.status(401).json({ status: 401, message: "Password Not Valid" });
		}

		const password = await bcrypt.hash(Credentials?.newPassword, 12);
		await User.updateOne({ _id: searchUser?._id }, { password });

		res.status(200).json({ status: 200, message: "Your Password has been Changed" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Update-User", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;
		delete Credentials.password;
		delete Credentials.email;
		delete Credentials.stripeID;
		delete Credentials.points;

		const searchUser = await User.findOne({ _id: id });
		if (!searchUser?._id) {
			return res.status(404).json({ status: 404, message: "User Not Found" });
		}

		if (Credentials?.profilePicture?.name) {
			const image = await SaveImageDB(
				Credentials?.profilePicture,
				{ User: new mongoose.Types.ObjectId(searchUser?._id) },
				res
			);
			if (image?.file?._id) {
				Credentials.profilePicture = new mongoose.Types.ObjectId(image?.file?._id);
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}

		await User.updateOne({ _id: searchUser?._id }, Credentials);
		res.status(200).json({ status: 200, message: "Your User has been Updated" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Login", async (req, res) => {
	try {
		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["email", "password"], res);
		if (Check) {
			return;
		}

		const searchUser = await User.findOne({ email: Credentials?.email }).select("+password");
		if (!searchUser?.password || !searchUser?._id) {
			return res.status(404).json({ status: 404, message: "User Not Found" });
		}

		const valid = await bcrypt.compare(Credentials?.password, searchUser.password);
		if (!valid) {
			return res.status(401).json({ status: 401, message: "Your Password is incorrect" });
		}

		const token = jwt.sign({ id: searchUser?._id }, APP_SECRET, { expiresIn: "7d" });
		res.status(200).json({ token, status: 200, message: "User Logged in Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/userInfo/:id", async (req, res) => {
	try {
		const { id: adminId, message: adminMessage } = await getAdminId(req);
		if (!adminId) {
			return res.status(401).json({ status: 401, message: adminMessage });
		}

		const data = await User.findOne({ _id: req?.params?.id }).populate(["profilePicture"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllUsers", async (req, res) => {
	try {
		const { id: adminId, message: adminMessage } = await getAdminId(req);
		if (!adminId) {
			return res.status(401).json({ status: 401, message: adminMessage });
		}

		const data = await User.find().populate(["profilePicture"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/userInfo", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await User.findOne({ _id: id }).populate([{ path: "profilePicture" }]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
