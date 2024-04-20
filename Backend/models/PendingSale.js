const mongoose = require("mongoose");

// Bridges the gap between "customer started paying" and "order actually
// recorded". The order payload is captured here the moment a payment intent
// is created, before Stripe has confirmed anything - so if the browser never
// calls back after payment succeeds (closed tab, dropped connection), the
// Stripe webhook can still finish creating the real Sale from what's stored
// here instead of the order silently vanishing.
const PendingSaleSchema = new mongoose.Schema(
	{
		User: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
		},
		orderPayload: {
			type: mongoose.Schema.Types.Mixed,
			required: true
		},
		stripePaymentIntentId: {
			type: String,
			unique: true,
			sparse: true
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending"
		}
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	}
);

const PendingSale = mongoose.model("PendingSale", PendingSaleSchema);

module.exports = { PendingSale };
