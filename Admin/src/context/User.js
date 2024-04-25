import { createEntityContext } from "./createEntityContext";

const { Context: UserContext, withContext: withUserContext, Provider } = createEntityContext({
  endpoint: "GetAllUsers",
  listKey: "AllUser",
  getterKey: "GetAllUser",
  errorKey: "UserError",
});

export { UserContext, withUserContext };
export default Provider;
