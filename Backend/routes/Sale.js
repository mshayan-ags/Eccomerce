const { Sale } = require("../models/Sale");
const { getAdminId, getUserId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { User } = require("../models/User");
const { default: mongoose } = require("mongoose");
const { Discount } = require("../models/Discount");
const { Address } = require("../models/Address");
const { Product } = require("../models/Product");
const { SaleOfProduct } = require("../models/SaleOfProduct");
const { Bank } = require("../models/Bank");
const { CouponRedeem } = require("../models/ReedemCoupon");
const { saleRoom, ADMIN_ROOM } = require("../Middlewares/socket");

const router = Router();

class OrderError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

function isDiscountCurrentlyValid(discount, productId) {
	if (!discount?.isActive) return false;
	const now = new Date();
	if (discount.startDate && now < new Date(discount.startDate)) return false;
	if (discount.endDate && now > new Date(discount.endDate)) return false;
	// A discount created for Brand/Category/Product always carries the exact
	// list of eligible product ids - trust that list, not whatever id the
	// client attaches client-side.
	return (discount.Product || []).some((p) => p.toString() === productId.toString());
}

// Reserves stock for every line item with a single atomic conditional update
// per product (quantity only decrements if enough stock is still available).
// If any item can't be reserved, everything already reserved is rolled back
// so a sale never partially commits.
async function reserveStock(items) {
	const reserved = [];
	for (const { productId, quantity } of items) {
		const result = await Product.updateOne(
			{ _id: productId, quantity: { $gte: quantity } },
			{ $inc: { quantity: -quantity } }
		);
		if (result.modifiedCount !== 1) {
			for (const done of reserved) {
				await Product.updateOne({ _id: done.productId }, { $inc: { quantity: done.quantity } });
			}
			return { ok: false, productId };
		}
		reserved.push({ productId, quantity });
	}
	return { ok: true };
}

async function releaseStock(items) {
	for (const { productId, quantity } of items) {
		await Product.updateOne({ _id: productId }, { $inc: { quantity } });
	}
}

// The one place a Sale actually gets created - used by the direct
// /Create-Sale route (customer's browser calls it right after Stripe
// confirms) and by the Stripe webhook handler (the backstop that finalizes
// the order even if the browser never calls back). Passing the same
// `stripePaymentIntentId` to both call sites makes this idempotent: whichever
// path runs first wins, and the other becomes a no-op instead of a duplicate
// order.
async function createSaleFromOrder({ userId, Credentials, stripePaymentIntentId }) {
	const stockToRelease = [];
	try {
		if (stripePaymentIntentId) {
			const existingSale = await Sale.findOne({ stripePaymentIntentId });
			if (existingSale) {
				return { saleId: existingSale._id, alreadyExisted: true };
			}
		}

		if (!Credentials?.Address || !Credentials?.paymentMethod) {
			throw new OrderError(400, "Please Fill the Required Fields");
		}
		if (!Array.isArray(Credentials.Product) || Credentials.Product.length === 0) {
			throw new OrderError(400, "No products in this order");
		}

		const ProductsArr = Credentials.Product;

		const searchAddress = await Address.findOne({ _id: Credentials?.Address, User: userId });
		if (!searchAddress?._id) {
			throw new OrderError(404, "Address Not Found");
		}

		const searchBank = Credentials?.Bank ? await Bank.findOne({ _id: Credentials?.Bank, User: userId }) : null;

		// Coupon ownership and usage are re-checked here from the authenticated
		// user's id - the client only supplies the redemption id, never a User.
		const searchCouponRedeem = Credentials?.Coupon
			? await CouponRedeem.findOne({ _id: Credentials?.Coupon, User: userId, isUsed: false }).populate(["Coupon"])
			: null;

		for (const element of ProductsArr) {
			if (!element?.ProductID || !element?.quantity) {
				throw new OrderError(400, "Each product needs a ProductID and quantity");
			}
		}

		const products = await Promise.all(
			ProductsArr.map((element) => Product.findOne({ _id: element.ProductID }))
		);
		const missingIndex = products.findIndex((p) => !p);
		if (missingIndex !== -1) {
			throw new OrderError(404, "One or more products could not be found");
		}

		const reservation = await reserveStock(
			ProductsArr.map((element) => ({ productId: element.ProductID, quantity: Number(element.quantity) }))
		);
		if (!reservation.ok) {
			throw new OrderError(409, "One or more items are out of stock");
		}
		stockToRelease.push(
			...ProductsArr.map((element) => ({ productId: element.ProductID, quantity: Number(element.quantity) }))
		);

		const discounts = await Promise.all(
			ProductsArr.map((element) =>
				element.DiscountID ? Discount.findOne({ _id: element.DiscountID }) : Promise.resolve(null)
			)
		);

		let total = 0;
		let totalAfterDiscount = 0;
		const saleOfProductDocs = [];

		for (let i = 0; i < ProductsArr.length; i++) {
			const element = ProductsArr[i];
			const product = products[i];
			const quantity = Number(element.quantity);
			const discount = discounts[i];
			const discountApplies = discount && isDiscountCurrentlyValid(discount, product._id);

			const discountAmount = !discountApplies
				? 0
				: discount.DiscountType === "FixedAmount"
					? Number(discount.value)
					: (Number(product.price) / 100) * Number(discount.value);

			const lineTotal = Number(product.price) * quantity;
			const lineTotalAfterDiscount = Math.max(0, Number(product.price) - discountAmount) * quantity;

			total += lineTotal;
			totalAfterDiscount += lineTotalAfterDiscount;

			saleOfProductDocs.push(
				new SaleOfProduct({
					product: element.ProductID,
					quantity,
					totalPrice: product.price,
					totalPriceAfterDiscount: lineTotalAfterDiscount / quantity,
					Discount: discountApplies ? discount._id : undefined
				})
			);
		}

		const couponValue = searchCouponRedeem?._id
			? searchCouponRedeem.Coupon?.discountType === "Percentage"
				? (totalAfterDiscount / 100) * searchCouponRedeem.Coupon?.discountValue
				: Number(searchCouponRedeem.Coupon?.discountValue || 0)
			: 0;

		const finalTotalAfterDiscount = Math.max(0, totalAfterDiscount - couponValue);

		const newSale = new Sale({
			User: new mongoose.Types.ObjectId(userId),
			Address: new mongoose.Types.ObjectId(Credentials.Address),
			Bank: searchBank?._id ? new mongoose.Types.ObjectId(searchBank._id) : undefined,
			CouponRedeem: searchCouponRedeem?._id ? new mongoose.Types.ObjectId(searchCouponRedeem._id) : null,
			paymentMethod: Credentials.paymentMethod,
			Notes: Credentials.Notes,
			totalAmount: total,
			totalAmountAfterDiscount: finalTotalAfterDiscount,
			couponvalue: couponValue,
			scheduleDate: Credentials.scheduleDate || new Date(),
			status: "Pending",
			stripePaymentIntentId: stripePaymentIntentId || undefined,
		});
		await newSale.save();

		await Promise.all(saleOfProductDocs.map((doc) => {
			doc.Sale = newSale._id;
			return doc.save();
		}));
		newSale.Product = saleOfProductDocs.map((doc) => doc._id);
		await newSale.save();

		if (searchCouponRedeem?._id) {
			await CouponRedeem.updateOne(
				{ _id: searchCouponRedeem._id },
				{ Sale: newSale._id, coupon_sale: `${searchCouponRedeem.Coupon?._id}_${newSale._id}`, isUsed: true }
			);
		}

		const searchUser = await User.findOne({ _id: userId });
		const searchUserSales = await Sale.find({ User: userId }).select("_id");
		await User.updateOne(
			{ _id: userId },
			{ Sale: searchUserSales, points: Number(searchUser?.points || 0) + newSale.totalAmount }
		);

		const searchAddressSales = await Sale.find({ Address: Credentials.Address }).select("_id");
		await Address.updateOne({ _id: Credentials.Address }, { Sale: searchAddressSales });

		if (searchBank?._id) {
			const searchBankSales = await Sale.find({ Bank: searchBank._id }).select("_id");
			await Bank.updateOne({ _id: searchBank._id }, { Sale: searchBankSales });
		}

		try {
			const { io } = require("../Middlewares/Server");
			io.to(ADMIN_ROOM).emit("new-order", {
				id: newSale._id,
				customer: searchUser?.name,
				total: newSale.totalAmountAfterDiscount,
			});
		} catch (error) {
			// Socket layer being unavailable should never fail an order.
		}

		return { saleId: newSale._id, alreadyExisted: false };
	} catch (error) {
		if (stockToRelease.length > 0) {
			await releaseStock(stockToRelease);
		}
		throw error;
	}
}

router.post("/Create-Sale", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const { saleId } = await createSaleFromOrder({ userId: id, Credentials: req.body });
		res.status(200).json({ status: 200, message: "Sale Created Successfully", id: saleId });
	} catch (error) {
		if (error instanceof OrderError) {
			return res.status(error.status).json({ status: error.status, message: error.message });
		}
		if (error?.code == 11000) {
			return res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`
			});
		}
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Update-Sale/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const searchSale = await Sale.findOne({ _id: req?.params?.id });
		if (!searchSale?._id) {
			return res.status(404).json({ status: 404, message: "Please Check Your Data" });
		}

		const updateSale = {
			status: Credentials?.status ?? searchSale?.status,
			trackingDetails: {
				carrier: Credentials?.trackingDetails?.carrier ?? searchSale?.trackingDetails?.carrier,
				trackingNumber: Credentials?.trackingDetails?.trackingNumber ?? searchSale?.trackingDetails?.trackingNumber,
				estimatedDeliveryDate: Credentials?.trackingDetails?.estimatedDeliveryDate ?? searchSale?.trackingDetails?.estimatedDeliveryDate,
				currentLocation: Credentials?.trackingDetails?.currentLocation ?? searchSale?.trackingDetails?.currentLocation,
				lastUpdated: Credentials?.trackingDetails?.lastUpdated ?? searchSale?.trackingDetails?.lastUpdated,
				deliveryAttempts: Credentials?.trackingDetails?.deliveryAttempts ?? searchSale?.trackingDetails?.deliveryAttempts,
				comments: Credentials?.trackingDetails?.comments ?? searchSale?.trackingDetails?.comments
			}
		};

		await Sale.updateOne({ _id: req?.params?.id }, updateSale);

		const { io } = require("../Middlewares/Server");
		io.to(saleRoom(req?.params?.id)).emit("order-updated", {
			id: req?.params?.id,
			status: updateSale.status,
			trackingDetails: updateSale.trackingDetails,
		});

		res.status(200).json({ status: 200, message: "Sale Updated in Succesfully" });
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

router.get("/SaleInfo/:id", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Sale.findOne({ _id: req.params.id, User: id })
			.populate(["User", "Address", { path: "Product", populate: [{ path: "product", populate: ["images"] }] }]);
		if (!data) {
			return res.status(404).json({ status: 404, message: "Sale Not Found" });
		}

		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/SaleInfoAdmin/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Sale.findOne({ _id: req.params.id })
			.populate(["User", "Address", { path: "Product", populate: [{ path: "product", populate: ["images"] }] }]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllSale", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Sale.find().populate(["User", { path: "CouponRedeem", populate: ["Coupon"] }]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllSaleUser", async (req, res) => {
	try {
		const { id, message } = await getUserId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Sale.find({ User: id }).populate(["User"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
module.exports.createSaleFromOrder = createSaleFromOrder;
module.exports.OrderError = OrderError;
