const { Review } = require("../models/Review");
const { Product } = require("../models/Product");
const { getUserId, getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");

const router = Router();

router.post("/Create-Review", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;
		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["targetType", "targetId", "rating"], res);
		if (Check) {
			return;
		}

		if (Credentials.rating < 1 || Credentials.rating > 5) {
			return res.status(400).json({ status: 400, message: "Rating must be between 1 and 5" });
		}

		// One review per user per target - resubmitting edits the existing one
		// rather than piling up duplicates.
		const existing = await Review.findOne({
			user: id,
			targetType: Credentials.targetType,
			targetId: Credentials.targetId,
		});

		if (existing) {
			existing.rating = Credentials.rating;
			existing.comment = Credentials.comment;
			// Editing an already-hidden review keeps it hidden; a fresh edit of a
			// previously-visible one re-enters moderation the same way it started.
			await existing.save();
			return res.status(200).json({ status: 200, message: "Review Updated Succesfully", id: existing._id });
		}

		const newReview = new Review({
			targetType: Credentials.targetType,
			targetId: Credentials.targetId,
			user: id,
			rating: Credentials.rating,
			comment: Credentials.comment,
		});
		await newReview.save();

		if (Credentials.targetType === "Product") {
			await Product.updateOne({ _id: Credentials.targetId }, { $addToSet: { review: newReview._id } });
		}

		res.status(200).json({ status: 200, message: "Review Created Succesfully", id: newReview._id });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Delete-Review/:id", async (req, res) => {
	try {
		const { id: userId, message: userMessage } = await getUserId(req);
		const { id: adminId } = await getAdminId(req);
		if (!userId && !adminId) {
			return res.status(401).json({ status: 401, message: userMessage });
		}

		// A user may only delete their own review; an admin may remove any
		// (e.g. spam or abuse) without needing to hide-then-explain it first.
		const filter = adminId ? { _id: req.params.id } : { _id: req.params.id, user: userId };
		const review = await Review.findOne(filter);
		if (!review) {
			return res.status(404).json({ status: 404, message: "Review Not Found" });
		}

		await Review.deleteOne({ _id: review._id });
		if (review.targetType === "Product") {
			await Product.updateOne({ _id: review.targetId }, { $pull: { review: review._id } });
		}

		res.status(200).json({ status: 200, message: "Review Deleted Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Set-Review-Approval/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const review = await Review.findOne({ _id: req.params.id });
		if (!review) {
			return res.status(404).json({ status: 404, message: "Review Not Found" });
		}

		review.isApproved = Boolean(req.body?.isApproved);
		await review.save();

		res.status(200).json({ status: 200, message: review.isApproved ? "Review Shown" : "Review Hidden" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllReviews", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Review.find()
			.populate([{ path: "user", select: "name email" }])
			.sort({ created_at: -1 });

		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetProductReviews/:id", async (req, res) => {
	try {
		// Public-facing: only ever surfaces reviews an admin hasn't hidden.
		const reviews = await Review.find({ targetType: "Product", targetId: req.params.id, isApproved: true })
			.populate([{ path: "user", select: "name" }])
			.sort({ created_at: -1 });

		const average = reviews.length
			? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
			: 0;

		res.status(200).json({
			status: 200,
			data: { reviews, average: Number(average.toFixed(1)), count: reviews.length },
		});
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
