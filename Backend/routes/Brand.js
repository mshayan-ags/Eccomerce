const { Brand } = require("../models/Brand");
const { getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { SaveImageDB } = require("./Image");

const router = Router();

router.post("/Create-Brand", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["name", "description", "country", "website"], res);
		if (Check) {
			return;
		}
		const newBrand = new Brand({
			name: Credentials?.name,
			description: Credentials?.description,
			country: Credentials?.country,
			website: Credentials?.website
		});

		if (Credentials?.logo?.name) {
			const image = await SaveImageDB(Credentials?.logo, { Brand: new mongoose.Types.ObjectId(newBrand?._id) }, res);
			if (image?.file?._id) {
				newBrand.logo = new mongoose.Types.ObjectId(image?.file?._id);
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}

		await newBrand.save();
		res.status(200).json({ status: 200, message: "Brand Created in Succesfully", id: newBrand?._id });
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

router.post("/Update-Brand/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const searchBrand = await Brand.findOne({ _id: req?.params?.id });
		if (!searchBrand?._id) {
			return res.status(404).json({ status: 404, message: "Brand Not Found" });
		}

		const updateBrand = {
			name: Credentials?.name ?? searchBrand?.name,
			description: Credentials?.description ?? searchBrand?.description,
			country: Credentials?.country ?? searchBrand?.country,
			website: Credentials?.website ?? searchBrand?.website
		};

		if (Credentials?.logo?.name) {
			const image = await SaveImageDB(Credentials?.logo, { Brand: new mongoose.Types.ObjectId(searchBrand?._id) }, res);
			if (image?.file?._id) {
				updateBrand.logo = new mongoose.Types.ObjectId(image?.file?._id);
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}

		await Brand.updateOne({ _id: req?.params?.id }, updateBrand);
		res.status(200).json({ status: 200, message: "Brand Updated in Succesfully" });
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

router.get("/BrandInfo/:id", async (req, res) => {
	try {
		const Check = await CheckAllRequiredFieldsAvailaible(req.params, ["id"], res);
		if (Check) {
			return;
		}

		const data = await Brand.findOne({ _id: req.params.id }).populate(["logo"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllBrands", async (req, res) => {
	try {
		const data = await Brand.find().populate(["logo"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
