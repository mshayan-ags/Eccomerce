import { createEntityContext } from "./createEntityContext";

const { Context: AddressContext, withContext: withAddressContext, Provider } = createEntityContext({
  endpoint: "GetAllAddresss",
  listKey: "AllAddress",
  getterKey: "GetAllAddress",
  errorKey: "AddressError",
});

export { AddressContext, withAddressContext };
export default Provider;
