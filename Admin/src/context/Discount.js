import { createEntityContext } from "./createEntityContext";

const { Context: DiscountContext, withContext: withDiscountContext, Provider } = createEntityContext({
  endpoint: "GetAllDiscounts",
  listKey: "AllDiscount",
  getterKey: "GetAllDiscount",
  errorKey: "DiscountError",
});

export { DiscountContext, withDiscountContext };
export default Provider;
