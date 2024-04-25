import { createEntityContext } from "./createEntityContext";

const { Context: CouponContext, withContext: withCouponContext, Provider } = createEntityContext({
  endpoint: "GetAllCoupons",
  listKey: "AllCoupon",
  getterKey: "GetAllCoupon",
  errorKey: "CouponError",
});

export { CouponContext, withCouponContext };
export default Provider;
