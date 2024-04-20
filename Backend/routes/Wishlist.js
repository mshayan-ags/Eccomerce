const { Wishlist } = require("../models/Whishlist");
const { getUserId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");

const router = Router();

router.post("/Add-Wishlist-Product", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Check = await CheckAllRequiredFieldsAvailaible(req.body, ["productId"], res);
		if (Check) {
			return;
		}

		await Wishlist.updateOne(
			{ user: id },
			{ $addToSet: { product: req.body.productId } },
			{ upsert: true }
		);

		res.status(200).json({ status: 200, message: "Added to Wishlist" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Remove-Wishlist-Product", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Check = await CheckAllRequiredFieldsAvailaible(req.body, ["productId"], res);
		if (Check) {
			return;
		}

		await Wishlist.updateOne({ user: id }, { $pull: { product: req.body.productId } });

		res.status(200).json({ status: 200, message: "Removed from Wishlist" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetWishlist", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const wishlist = await Wishlist.findOne({ user: id }).populate([
			{ path: "product", populate: ["images", "Discount"] },
		]);

		res.status(200).json({ status: 200, data: wishlist?.product || [] });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
