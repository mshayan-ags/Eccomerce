const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true
		},
		points: {
			type: Number,
			default: 0,
			required: true,
		},
		stripeID: {
			type: String,
			unique: true,
			sparse: true
		},
		password: {
			type: String,
			required: true,
			trim: true,
			select: false
		},
		isVerified: {
			type: Boolean,
			default: true
		},
		// A lightweight account created transparently for guest checkout,
		// rather than something the shopper deliberately signed up for -
		// never has a password the shopper actually knows.
		isGuest: {
			type: Boolean,
			default: false
		},
		otp: {
			type: String,
			select: false
		},
		otpExpiresAt: {
			type: Date,
			select: false
		},
		subscriber: {
			type: Boolean,
			required: true,
			default: true
		},
		profilePicture: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Image"
		},
		Bank: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Bank"
		},
		Address: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Address"
		},
		Whishlist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wishlist"
		},
		Review: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Review"
		},
		Sale: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Sale"
		},
		CouponRedeem: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "CouponRedeem"
		},
	},
	{
		timestamps: {
			createdAt: "created_at", // Use `created_at` to store the created date
			updatedAt: "updated_at" // and `updated_at` to store the last updated date
		}
	}
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };
