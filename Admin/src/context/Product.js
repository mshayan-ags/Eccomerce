import { createEntityContext } from "./createEntityContext";

const { Context: ProductContext, withContext: withProductContext, Provider } = createEntityContext({
  endpoint: "GetAllProducts",
  listKey: "AllProduct",
  getterKey: "GetAllProduct",
  errorKey: "ProductError",
});

export { ProductContext, withProductContext };
export default Provider;
