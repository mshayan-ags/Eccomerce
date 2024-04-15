const { Bank } = require("../models/Bank");
const { getAdminId, getUserId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { User } = require("../models/User");
const { default: mongoose } = require("mongoose");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { stripe } = require("../Middlewares/Db");
const { PendingSale } = require("../models/PendingSale");
const { Sale } = require("../models/Sale");

const router = Router();

async function CreateBank(Credentials) {
	const newBank = new Bank({
		bank_name: Credentials?.bank_name,
		account_number: Credentials?.account_number,
		stripeID: Credentials?.stripeID,
		country: Credentials?.country,
		is_verified: false,
		is_default: Credentials?.is_default,
		account_detail: Credentials?.account_detail,
		isArchive: false,
		User: new mongoose.Types.ObjectId(Credentials?.User)
	});

	const saveBank = await newBank.save();

	const searchUserBankes = await Bank.find({ User: Credentials?.User, isArchive: false }).select("_id");
	await User.updateOne({ _id: Credentials?.User }, { Bank: searchUserBankes });

	return { id: saveBank?._id };
}

async function getOrCreateStripeCustomer(user) {
	if (user?.stripeID) {
		const existing = await stripe.customers.retrieve(user.stripeID).catch(() => null);
		if (existing?.id && !existing?.deleted) {
			return existing.id;
		}
	}

	const customer = await stripe.customers.create({ email: user?.email, name: user?.name });
	await User.updateOne({ _id: user?._id }, { stripeID: customer?.id });
	return customer.id;
}

router.post("/create-payment-intent", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const { amount, currency, order } = req.body;
		const Check = await CheckAllRequiredFieldsAvailaible(req.body, ["amount", "currency", "order"], res);
		if (Check) {
			return;
		}

		const user = await User.findOne({ _id: id });
		const stripeCustomerId = await getOrCreateStripeCustomer(user);

		// The order contents (cart, address, coupon...) are captured now,
		// before Stripe is even involved, so the order can still be finished
		// later - either by the confirm call below, or by the webhook backstop
		// if the browser never gets to make that call.
		const pendingSale = await new PendingSale({ User: id, orderPayload: order }).save();

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			customer: stripeCustomerId,
			metadata: { pendingSaleId: pendingSale._id.toString() }
		});

		pendingSale.stripePaymentIntentId = paymentIntent.id;
		await pendingSale.save();

		res.status(200).json(paymentIntent);
	} catch (error) {
		console.error("Error creating payment intent:", error.message);
		res.status(500).json({ error: "An error occurred while creating the payment intent." });
	}
});

router.post("/confirm-payment-intent", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Check = await CheckAllRequiredFieldsAvailaible(req.body, ["intent", "paymentMethod"], res);
		if (Check) {
			return;
		}
		const { intent, paymentMethod } = req.body;

		const user = await User.findOne({ _id: id });
		let bank = await Bank.findOne({
			account_detail: `${paymentMethod?.card?.brand}_${paymentMethod?.card?.last4}`,
			User: id
		});

		let paymentMethodId = paymentMethod?.id;

		if (user?.stripeID && !bank?._id) {
			const paymentMethodSave = await stripe.paymentMethods.attach(paymentMethod?.id, {
				customer: user?.stripeID
			});

			const newBankId = await CreateBank({
				bank_name: paymentMethodSave?.card?.brand,
				account_number: paymentMethodSave?.card?.last4,
				country: paymentMethodSave?.card?.country,
				stripeID: paymentMethodSave?.id,
				account_detail: `${paymentMethodSave?.card?.brand}_${paymentMethodSave?.card?.last4}`,
				User: id
			});
			bank = await Bank.findOne({ _id: newBankId.id });
			paymentMethodId = paymentMethodSave?.id;
		} else if (bank?.stripeID) {
			paymentMethodId = bank.stripeID;
		}

		const paymentIntent = await stripe.paymentIntents.confirm(intent, {
			payment_method: paymentMethodId,
			return_url: "https://www.example.com"
		});

		let saleId = null;
		if (paymentIntent?.status === "succeeded") {
			const pendingSale = await PendingSale.findOne({ stripePaymentIntentId: paymentIntent.id });
			if (pendingSale && pendingSale.status === "pending") {
				try {
					const { createSaleFromOrder } = require("./Sale");
					// The order payload was captured before the card was even chosen,
					// so the resolved bank/payment-method (just worked out above) is
					// merged in now, at the last moment before the order is created.
					const result = await createSaleFromOrder({
						userId: id,
						Credentials: {
							...pendingSale.orderPayload,
							Bank: bank?._id ?? pendingSale.orderPayload?.Bank,
							paymentMethod: paymentMethodId ?? pendingSale.orderPayload?.paymentMethod,
						},
						stripePaymentIntentId: paymentIntent.id,
					});
					saleId = result.saleId;
					pendingSale.status = "completed";
					await pendingSale.save();
				} catch (orderError) {
					// Payment succeeded but the order couldn't be finalized (e.g. an
					// item sold out in the meantime) - leave it "pending" so the
					// webhook can retry, and surface the real reason to the client.
					console.error("Order finalization failed after payment:", orderError.message);
					return res.status(200).json({
						clientSecret: paymentIntent.client_secret,
						warning: orderError.message || "Payment succeeded but the order could not be finalized yet.",
					});
				}
			} else if (pendingSale?.status === "completed") {
				// Already finalized by a previous confirm call or by the webhook.
				const existingSale = await Sale.findOne({ stripePaymentIntentId: paymentIntent.id });
				saleId = existingSale?._id ?? null;
			}
		}

		res.status(200).json({ clientSecret: paymentIntent.client_secret, bankId: bank?._id, saleId });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "An error occurred while confirming the payment intent." });
	}
});

router.post("/Create-Bank", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;
		Credentials.User = id;
		// is_verified is deliberately not accepted from the client - a user
		// cannot self-declare their own bank account verified.
		delete Credentials.is_verified;

		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["bank_name", "account_number", "User"], res);
		if (Check) {
			return;
		}

		const created = await CreateBank(Credentials);
		res.status(200).json({ status: 200, message: "Bank Created in Succesfully", id: created.id });
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

router.post("/Update-Bank/:id", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		// Ownership comes from the authenticated token, never from a client-
		// supplied "User" field in the body.
		const searchBank = await Bank.findOne({ _id: req?.params?.id, User: id });
		if (!searchBank?._id) {
			return res.status(404).json({ status: 404, message: "Bank Not Found" });
		}

		const updateBank = {
			bank_name: Credentials?.bank_name ?? searchBank?.bank_name,
			account_number: Credentials?.account_number ?? searchBank?.account_number,
			is_default: Credentials?.is_default ?? searchBank?.is_default
			// is_verified is intentionally not user-settable.
		};

		await Bank.updateOne({ _id: searchBank?._id }, updateBank);

		const searchUserBankes = await Bank.find({ User: id, isArchive: false }).select("_id");
		await User.updateOne({ _id: id }, { Bank: searchUserBankes });

		res.status(200).json({ status: 200, message: "Bank Updated in Succesfully" });
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

router.post("/Delete-Bank/:id", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const searchBank = await Bank.findOne({ _id: req?.params?.id, User: id });
		if (!searchBank?._id) {
			return res.status(404).json({ status: 404, message: "Bank Not Found" });
		}

		await Bank.updateOne({ _id: searchBank?._id }, { isArchive: true });

		const searchUserBankes = await Bank.find({ User: id, isArchive: false }).select("_id");
		await User.updateOne({ _id: id }, { Bank: searchUserBankes });

		res.status(200).json({ status: 200, message: "Bank Deleted in Succesfully" });
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

router.get("/BankInfo/:id", async (req, res) => {
	try {
		const { id: adminId } = await getAdminId(req);
		const { id: userId, message: userMessage } = await getUserId(req);

		if (!adminId && !userId) {
			return res.status(401).json({ status: 401, message: userMessage });
		}

		const filter = adminId ? { _id: req.params.id } : { _id: req.params.id, User: userId };
		const data = await Bank.findOne(filter).populate(["User"]);
		if (!data) {
			return res.status(404).json({ status: 404, message: "Bank Not Found" });
		}

		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllBanks", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Bank.find().populate(["User"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllBankUser", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Bank.find({ User: id, isArchive: false }).populate(["User"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
