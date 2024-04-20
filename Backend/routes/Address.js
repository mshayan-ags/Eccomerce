const { Address } = require("../models/Address");
const { getAdminId, getUserId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { User } = require("../models/User");
const { default: mongoose } = require("mongoose");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");

const router = Router();

router.post("/Create-Address", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(
			Credentials,
			["full_name", "phone_number", "address_line1", "city", "state", "postal_code", "country"],
			res
		);
		if (Check) {
			return;
		}

		const newAddress = new Address({
			full_name: Credentials?.full_name,
			phone_number: Credentials?.phone_number,
			address_line1: Credentials?.address_line1,
			city: Credentials?.city,
			state: Credentials?.state,
			postal_code: Credentials?.postal_code,
			country: Credentials?.country,
			address_line2: Credentials?.address_line2,
			is_default: Boolean(Credentials?.is_default),
			isArchive: false,
			User: new mongoose.Types.ObjectId(id)
		});

		const saveAddress = await newAddress.save();

		const searchUserAddresses = await Address.find({ User: id, isArchive: false }).select("_id");
		await User.updateOne({ _id: id }, { Address: searchUserAddresses });

		res.status(200).json({
			status: 200,
			message: "Address Created in Succesfully",
			id: saveAddress?._id
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

router.post("/Update-Address/:id", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		// Ownership is enforced by filtering on the authenticated user's id, not
		// just the address id from the URL - otherwise any logged-in user could
		// edit any other user's address.
		const searchAddress = await Address.findOne({ _id: req?.params?.id, User: id });
		if (!searchAddress?._id) {
			return res.status(404).json({ status: 404, message: "Address Not Found" });
		}

		const updateAddress = {
			full_name: Credentials?.full_name ?? searchAddress?.full_name,
			phone_number: Credentials?.phone_number ?? searchAddress?.phone_number,
			address_line1: Credentials?.address_line1 ?? searchAddress?.address_line1,
			city: Credentials?.city ?? searchAddress?.city,
			state: Credentials?.state ?? searchAddress?.state,
			postal_code: Credentials?.postal_code ?? searchAddress?.postal_code,
			country: Credentials?.country ?? searchAddress?.country,
			address_line2: Credentials?.address_line2 ?? searchAddress?.address_line2,
			is_default: Credentials?.is_default ?? searchAddress?.is_default
		};

		await Address.updateOne({ _id: searchAddress?._id }, updateAddress);

		const searchUserAddresses = await Address.find({ User: id, isArchive: false }).select("_id");
		await User.updateOne({ _id: id }, { Address: searchUserAddresses });

		res.status(200).json({ status: 200, message: "Address Updated in Succesfully" });
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

router.post("/Delete-Address/:id", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const searchAddress = await Address.findOne({ _id: req?.params?.id, User: id });
		if (!searchAddress?._id) {
			return res.status(404).json({ status: 404, message: "Address Not Found" });
		}

		await Address.updateOne({ _id: searchAddress?._id }, { isArchive: true });

		const searchUserAddresses = await Address.find({ User: id, isArchive: false }).select("_id");
		await User.updateOne({ _id: id }, { Address: searchUserAddresses });

		res.status(200).json({ status: 200, message: "Address Deleted in Succesfully" });
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

router.get("/AddressInfo/:id", async (req, res) => {
	try {
		const { id: adminId } = await getAdminId(req);
		const { id: userId, message: userMessage } = await getUserId(req);

		if (!adminId && !userId) {
			return res.status(401).json({ status: 401, message: userMessage });
		}

		// A regular user may only look up their own address; an admin may look up any.
		const filter = adminId ? { _id: req.params.id } : { _id: req.params.id, User: userId };
		const data = await Address.findOne(filter).populate(["User"]);
		if (!data) {
			return res.status(404).json({ status: 404, message: "Address Not Found" });
		}

		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllAddresss", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Address.find().populate(["User"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllAddressUser", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Address.find({ User: id, isArchive: false }).populate(["User"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
