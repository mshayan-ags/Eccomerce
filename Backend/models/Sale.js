const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
	{
		User: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
		},
		Discount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Discount"
		},
		Product: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "SaleOfProduct"
		},
		Address: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Address",
			required: true
		},
		Bank: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bank",
			required: true
		},
		Review: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		},
		CouponRedeem: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CouponRedeem"
		},
		totalAmount: {
			type: Number,
			required: true,
			min: 0
		},
		totalAmountAfterDiscount: {
			type: Number,
			required: true,
			min: 0
		},
		couponvalue: {
			type: Number,
			required: true,
			min: 0
		},
		paymentMethod: {
			type: String,
			required: true
		},
		status: {
			type: String,
			enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Scheduled"],
			default: "Pending",
			index: true
		},
		stripePaymentIntentId: {
			type: String,
			unique: true,
			sparse: true
		},
		trackingDetails: {
			carrier: {
				type: String
			},
			trackingNumber: {
				type: String
			},
			estimatedDeliveryDate: {
				type: Date
			},
			currentLocation: {
				type: String
			},
			lastUpdated: {
				type: Date,
				default: Date.now
			},
			deliveryAttempts: {
				type: Number,
				default: 0
			},
			comments: {
				type: String
			}
		},
		deliveryDate: {
			type: Date
		},
		scheduleDate: {
			type: Date
		},
		Notes: {
			type: String
		}

	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	}
);

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = { Sale };
