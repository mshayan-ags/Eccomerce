import { createEntityContext } from "./createEntityContext";

const { Context: SaleContext, withContext: withSaleContext, Provider } = createEntityContext({
  endpoint: "GetAllSale",
  listKey: "AllSale",
  getterKey: "GetAllSale",
  errorKey: "SaleError",
  transform: (data) => data?.reverse(),
});

export { SaleContext, withSaleContext };
export default Provider;
