const { Category } = require("../models/Category");
const { getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");

const router = Router();

router.post("/Create-Category", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["name", "description"], res);
		if (Check) {
			return;
		}
		const newCategory = new Category({
			name: Credentials?.name,
			description: Credentials?.description
		});

		await newCategory.save();
		res.status(200).json({ status: 200, message: "Category Created in Succesfully", id: newCategory?._id });
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

router.post("/Update-Category/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const searchCategory = await Category.findOne({ _id: req?.params?.id });
		if (!searchCategory?._id) {
			return res.status(404).json({ status: 404, message: "Category Not Found" });
		}

		const updateCategory = {
			name: Credentials?.name ?? searchCategory?.name,
			description: Credentials?.description ?? searchCategory?.description
		};

		await Category.updateOne({ _id: req?.params?.id }, updateCategory);
		res.status(200).json({ status: 200, message: "Category Updated in Succesfully" });
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

router.get("/CategoryInfo/:id", async (req, res) => {
	try {
		const Check = await CheckAllRequiredFieldsAvailaible(req.params, ["id"], res);
		if (Check) {
			return;
		}

		const data = await Category.findOne({ _id: req.params.id });
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllCategorys", async (req, res) => {
	try {
		const data = await Category.find();
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
