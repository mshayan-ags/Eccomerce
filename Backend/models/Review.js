const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
	{
		targetType: {
			type: String,
			enum: ["Product", "Sale"],
			required: true
		},
		targetId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5
		},
		comment: {
			type: String,
			trim: true
		},
		isApproved: {
			type: Boolean,
			default: true
		},
		Product: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Product"
		},
		Sale: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Sale"
		}
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	}
);

ReviewSchema.index({ targetType: 1, targetId: 1 });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = { Review };
