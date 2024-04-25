import { createEntityContext } from "./createEntityContext";

const { Context: BankContext, withContext: withBankContext, Provider } = createEntityContext({
  endpoint: "GetAllBanks",
  listKey: "AllBank",
  getterKey: "GetAllBank",
  errorKey: "BankError",
});

export { BankContext, withBankContext };
export default Provider;
