const { Admin } = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticator } = require("otplib");
const QRCode = require("qrcode");
const { APP_SECRET, getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { SaveImageDB } = require("./Image");
const { default: mongoose } = require("mongoose");

const router = Router();

function issueAdminToken(admin) {
	return jwt.sign({ id: admin?._id, Role: admin?.Role }, APP_SECRET, { expiresIn: "7d" });
}

router.post("/Create-Admin", async (req, res) => {
	try {
		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(
			Credentials,
			["name", "email", "phoneNumber", "Role", "password"],
			res
		);
		if (Check) {
			return;
		}

		const password = await bcrypt.hash(Credentials?.password, 12);

		const newAdmin = new Admin({
			name: Credentials?.name,
			email: Credentials?.email,
			phoneNumber: Credentials?.phoneNumber,
			password: password,
			Role: Credentials?.Role
		});

		if (Credentials?.profilePicture?.name) {
			const image = await SaveImageDB(
				Credentials?.profilePicture,
				{ Admin: new mongoose.Types.ObjectId(newAdmin?._id) },
				res
			);

			if (image?.file?._id) {
				newAdmin.profilePicture = new mongoose.Types.ObjectId(image?.file?._id);
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}
		await newAdmin.save();
		const token = issueAdminToken(newAdmin);

		res.status(200).json({
			token,
			status: 200,
			message: "Admin Created in Succesfully"
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

router.post("/Update-Admin", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;
		delete Credentials.password;
		delete Credentials.email;
		delete Credentials.Role;

		const searchAdmin = await Admin.findOne({ _id: id });
		if (!searchAdmin?._id) {
			return res.status(404).json({ status: 404, message: "Admin Not Found" });
		}

		if (Credentials?.profilePicture?.name) {
			const image = await SaveImageDB(
				Credentials?.profilePicture,
				{ Admin: new mongoose.Types.ObjectId(searchAdmin?._id) },
				res
			);
			if (image?.file?._id) {
				Credentials.profilePicture = new mongoose.Types.ObjectId(image?.file?._id);
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}
		await Admin.updateOne({ _id: id }, Credentials);
		res.status(200).json({ status: 200, message: "Your Admin has been Updated" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Login-Admin", async (req, res) => {
	try {
		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["email", "password"], res);
		if (Check) {
			return;
		}

		const searchAdmin = await Admin.findOne({ email: Credentials?.email }).select("+password");
		if (!searchAdmin?.password || !searchAdmin?._id) {
			return res.status(404).json({ status: 404, message: "Admin Not Found" });
		}

		const valid = await bcrypt.compare(Credentials?.password, searchAdmin.password);
		if (!valid) {
			return res.status(401).json({ status: 401, message: "Your Password is incorrect" });
		}

		if (searchAdmin?.twoFactorEnabled) {
			// The password alone isn't enough to log in - a short-lived pending
			// token (no Role claim, so getAdminId rejects it everywhere else)
			// is handed back instead, good only for completing the TOTP step
			// at /Login-Admin-2FA within the next 5 minutes.
			const pendingToken = jwt.sign({ id: searchAdmin?._id, pending2FA: true }, APP_SECRET, { expiresIn: "5m" });
			return res.status(200).json({ status: 200, twoFactorRequired: true, pendingToken, message: "Enter your 2FA code" });
		}

		const token = issueAdminToken(searchAdmin);
		res.status(200).json({ token, status: 200, message: "Admin Logged in Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Login-Admin-2FA", async (req, res) => {
	try {
		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["pendingToken", "token"], res);
		if (Check) {
			return;
		}

		let payload;
		try {
			payload = jwt.verify(Credentials?.pendingToken, APP_SECRET);
		} catch (error) {
			return res.status(401).json({ status: 401, message: "Your session expired, please login again" });
		}
		if (!payload?.pending2FA) {
			return res.status(401).json({ status: 401, message: "Invalid login session" });
		}

		const searchAdmin = await Admin.findOne({ _id: payload.id }).select("+twoFactorSecret");
		if (!searchAdmin?.twoFactorEnabled || !searchAdmin?.twoFactorSecret) {
			return res.status(401).json({ status: 401, message: "Invalid login session" });
		}

		const valid = authenticator.check(String(Credentials?.token), searchAdmin.twoFactorSecret);
		if (!valid) {
			return res.status(401).json({ status: 401, message: "Invalid 2FA code" });
		}

		const token = issueAdminToken(searchAdmin);
		res.status(200).json({ token, status: 200, message: "Admin Logged in Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

// Step 1 of enabling 2FA - generates a secret and hands back a scannable QR
// code, but doesn't turn 2FA on yet. It only takes effect once the admin
// proves they actually saved it, by verifying a code at /Admin-2FA/Enable.
router.post("/Admin-2FA/Setup", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const searchAdmin = await Admin.findOne({ _id: id });
		if (!searchAdmin?._id) {
			return res.status(404).json({ status: 404, message: "Admin Not Found" });
		}

		const secret = authenticator.generateSecret();
		await Admin.updateOne({ _id: id }, { twoFactorSecret: secret, twoFactorEnabled: false });

		const otpauth = authenticator.keyuri(searchAdmin.email, "Eccomerce Admin", secret);
		const qrCode = await QRCode.toDataURL(otpauth);

		res.status(200).json({ status: 200, secret, qrCode });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Admin-2FA/Enable", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Check = await CheckAllRequiredFieldsAvailaible(req.body, ["token"], res);
		if (Check) {
			return;
		}

		const searchAdmin = await Admin.findOne({ _id: id }).select("+twoFactorSecret");
		if (!searchAdmin?.twoFactorSecret) {
			return res.status(400).json({ status: 400, message: "Start 2FA setup first" });
		}

		const valid = authenticator.check(String(req.body?.token), searchAdmin.twoFactorSecret);
		if (!valid) {
			return res.status(400).json({ status: 400, message: "Invalid 2FA code" });
		}

		await Admin.updateOne({ _id: id }, { twoFactorEnabled: true });
		res.status(200).json({ status: 200, message: "2FA Enabled Successfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Admin-2FA/Disable", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Check = await CheckAllRequiredFieldsAvailaible(req.body, ["token"], res);
		if (Check) {
			return;
		}

		const searchAdmin = await Admin.findOne({ _id: id }).select("+twoFactorSecret");
		if (!searchAdmin?.twoFactorEnabled) {
			return res.status(400).json({ status: 400, message: "2FA is not enabled" });
		}

		// Disabling still requires a valid code - otherwise a stolen/left-open
		// session could turn off the very protection 2FA exists to provide.
		const valid = authenticator.check(String(req.body?.token), searchAdmin.twoFactorSecret);
		if (!valid) {
			return res.status(400).json({ status: 400, message: "Invalid 2FA code" });
		}

		await Admin.updateOne({ _id: id }, { twoFactorEnabled: false, $unset: { twoFactorSecret: "" } });
		res.status(200).json({ status: 200, message: "2FA Disabled Successfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/AdminInfo", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Admin.findOne({ _id: id });
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAdminInfo/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Admin.findOne({ _id: req?.params?.id }).populate(["profilePicture"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllAdmins", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Admin.find().populate(["profilePicture"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
