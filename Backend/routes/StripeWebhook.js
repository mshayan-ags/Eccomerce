const { Router } = require("express");
const Express = require("express");
const { stripe } = require("../Middlewares/Db");
const { PendingSale } = require("../models/PendingSale");
const { createSaleFromOrder, OrderError } = require("./Sale");

const router = Router();

// Stripe requires the raw, untouched request body to verify the signature -
// this route is exempted from the app-wide express.json() in Server.js, so
// it needs its own raw-body parser here instead.
router.post("/Stripe-Webhook", Express.raw({ type: "application/json" }), async (req, res) => {
	if (!process.env.STRIPE_WEBHOOK_SECRET) {
		console.error("STRIPE_WEBHOOK_SECRET is not set - refusing unverifiable webhook call.");
		return res.status(500).send("Webhook not configured");
	}

	let event;
	try {
		event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
	} catch (error) {
		console.error("Stripe webhook signature verification failed:", error.message);
		return res.status(400).send(`Webhook Error: ${error.message}`);
	}

	try {
		if (event.type === "payment_intent.succeeded") {
			const paymentIntent = event.data.object;
			const pendingSale = await PendingSale.findOne({ stripePaymentIntentId: paymentIntent.id });

			// This is the backstop for orders whose browser never called
			// /confirm-payment-intent's follow-through (closed tab, dropped
			// connection, crash) - createSaleFromOrder is idempotent on
			// stripePaymentIntentId, so if the browser already finished the
			// order this just no-ops instead of double-creating it.
			if (pendingSale && pendingSale.status === "pending") {
				try {
					await createSaleFromOrder({
						userId: pendingSale.User,
						Credentials: pendingSale.orderPayload,
						stripePaymentIntentId: paymentIntent.id,
					});
					pendingSale.status = "completed";
					await pendingSale.save();
				} catch (orderError) {
					if (orderError instanceof OrderError) {
						console.error(`Webhook could not finalize pending sale ${pendingSale._id}:`, orderError.message);
						pendingSale.status = "failed";
						await pendingSale.save();
					} else {
						throw orderError;
					}
				}
			}
		} else if (event.type === "payment_intent.payment_failed") {
			const paymentIntent = event.data.object;
			await PendingSale.updateOne({ stripePaymentIntentId: paymentIntent.id, status: "pending" }, { status: "failed" });
		}

		res.status(200).json({ received: true });
	} catch (error) {
		console.error("Error handling Stripe webhook:", error.message);
		// Ask Stripe to retry - this was an unexpected failure, not a rejected order.
		res.status(500).send("Webhook handler error");
	}
});

module.exports = router;
