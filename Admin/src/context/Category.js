import { createEntityContext } from "./createEntityContext";

const { Context: CategoryContext, withContext: withCategoryContext, Provider } = createEntityContext({
  endpoint: "GetAllCategorys",
  listKey: "AllCategory",
  getterKey: "GetAllCategory",
  errorKey: "CategoryError",
});

export { CategoryContext, withCategoryContext };
export default Provider;
