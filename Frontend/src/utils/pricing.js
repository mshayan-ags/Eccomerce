// Shared discount-price math - previously duplicated (with copy-pasted bugs)
// across Card/index.js, Card2.js, CartCard.js, and Details/index.js.
export function getDiscountedUnitPrice(price, discount) {
	const base = Number(price) || 0;
	if (!discount?._id) return base;

	const amount =
		discount.DiscountType === "Percentage"
			? (base / 100) * Number(discount.value)
			: Number(discount.value);

	return Math.max(0, base - amount);
}
