const { Coupon } = require("../models/Coupon");
const { getAdminId, getUserId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { Admin } = require("../models/Admin");
const { User } = require("../models/User");
const { CouponRedeem } = require("../models/ReedemCoupon");

const router = Router();

const evaluateRestrictions = (restriction, user) => {
	if (restriction === "new_user") {
		return user?.Sale?.length <= 0;
	}
	if (restriction?.startsWith("min_orders_")) {
		const minOrders = parseInt(restriction.split("_")[2], 10);
		return user?.Sale?.length >= minOrders;
	}
	if (restriction?.startsWith("max_orders_")) {
		const maxOrders = parseInt(restriction.split("_")[2], 10);
		return user?.Sale?.length <= maxOrders;
	}
	return restriction === "true" || !restriction;
};

router.post("/Create-Coupon", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(
			Credentials,
			["code", "discountType", "discountValue", "minimumPurchase", "expirationDate", "restrictions"],
			res
		);
		if (Check) {
			return;
		}
		const newCoupon = new Coupon({
			code: Credentials?.code,
			discountType: Credentials?.discountType,
			discountValue: Credentials?.discountValue,
			minimumPurchase: Credentials?.minimumPurchase,
			expirationDate: Credentials?.expirationDate,
			restrictions: Credentials?.restrictions,
			isActive: true,
			Admin: new mongoose.Types.ObjectId(id)
		});

		const saveCoupon = await newCoupon.save();
		const searchAdminCoupons = await Coupon.find({ Admin: id }).select("_id");
		await Admin.updateOne({ _id: id }, { Coupon: searchAdminCoupons });

		res.status(200).json({ status: 200, message: "Coupon Created in Succesfully", id: saveCoupon?._id });
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

router.post("/Reedem-Coupon", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["Coupon", "total"], res);
		if (Check) {
			return;
		}

		const searchCoupon = await Coupon.findOne({ code: Credentials?.Coupon });
		// user_coupon is a unique compound key derived from the authenticated id,
		// so this lookup can't be spoofed to check someone else's redemption state.
		const isCouponAlreadyRedeemed = await CouponRedeem.findOne({ user_coupon: `${id}_${searchCoupon?._id}` });
		const user = await User.findOne({ _id: id });

		const isEligible =
			searchCoupon?._id &&
			!isCouponAlreadyRedeemed?._id &&
			searchCoupon?.isActive &&
			searchCoupon?.minimumPurchase <= Number(Credentials?.total) &&
			new Date(searchCoupon?.expirationDate) > new Date() &&
			evaluateRestrictions(searchCoupon?.restrictions, user);

		if (!isEligible) {
			return res.status(400).json({ status: 400, message: "Coupon Not Availaible For This User" });
		}

		const newCouponRedeem = new CouponRedeem({
			User: new mongoose.Types.ObjectId(id),
			Coupon: new mongoose.Types.ObjectId(searchCoupon?._id),
			user_coupon: `${id}_${searchCoupon?._id}`
		});
		await newCouponRedeem.save();

		const searchUserCoupons = await CouponRedeem.find({ User: id }).select("_id");
		await User.updateOne({ _id: id }, { CouponRedeem: searchUserCoupons });

		const searchCouponRedemptions = await CouponRedeem.find({ Coupon: searchCoupon?._id }).select("_id");
		await Coupon.updateOne({ _id: searchCoupon?._id }, { CouponRedeem: searchCouponRedemptions });

		res.status(200).json({ status: 200, message: "Coupon Reedemed in Succesfully", data: searchCoupon });
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

router.post("/Update-Coupon/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const searchCoupon = await Coupon.findOne({ _id: req?.params?.id });
		if (!searchCoupon?._id) {
			return res.status(404).json({ status: 404, message: "Coupon Not Found" });
		}

		const updateCoupon = {
			code: Credentials?.code ?? searchCoupon?.code,
			discountType: Credentials?.discountType ?? searchCoupon?.discountType,
			discountValue: Credentials?.discountValue ?? searchCoupon?.discountValue,
			minimumPurchase: Credentials?.minimumPurchase ?? searchCoupon?.minimumPurchase,
			expirationDate: Credentials?.expirationDate ?? searchCoupon?.expirationDate,
			restrictions: Credentials?.restrictions ?? searchCoupon?.restrictions,
			isActive: Credentials?.isActive ?? searchCoupon?.isActive
		};

		await Coupon.updateOne({ _id: req?.params?.id }, updateCoupon);
		res.status(200).json({ status: 200, message: "Coupon Updated in Succesfully" });
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

router.get("/CouponInfo/:id", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Coupon.findOne({ _id: req.params.id });
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllCoupons", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Coupon.find();
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllCouponsUser", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const user = await User.findOne({ _id: id });
		const redemptions = await CouponRedeem.find({ User: id }).populate(["Coupon"]);

		const eligible = redemptions.filter((redemption) => {
			const coupon = redemption?.Coupon;
			return (
				coupon?._id &&
				!redemption?.isUsed &&
				coupon?.isActive &&
				new Date(coupon?.expirationDate) > new Date() &&
				evaluateRestrictions(coupon?.restrictions, user)
			);
		});

		res.status(200).json({ status: 200, data: eligible });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
