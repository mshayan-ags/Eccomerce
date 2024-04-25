import { createEntityContext } from "./createEntityContext";

const { Context: BrandContext, withContext: withBrandContext, Provider } = createEntityContext({
  endpoint: "GetAllBrands",
  listKey: "AllBrand",
  getterKey: "GetAllBrand",
  errorKey: "BrandError",
});

export { BrandContext, withBrandContext };
export default Provider;
