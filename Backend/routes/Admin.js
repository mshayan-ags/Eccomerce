const { Admin } = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { SaveImageDB } = require("./Image");
const { default: mongoose } = require("mongoose");

const router = Router();

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
		const token = jwt.sign({ id: newAdmin?._id, Role: newAdmin?.Role }, APP_SECRET, { expiresIn: "7d" });

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

		const token = jwt.sign({ id: searchAdmin?._id, Role: searchAdmin?.Role }, APP_SECRET, { expiresIn: "7d" });
		res.status(200).json({ token, status: 200, message: "Admin Logged in Succesfully" });
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
