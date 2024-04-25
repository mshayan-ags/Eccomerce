import { createEntityContext } from "./createEntityContext";

const { Context: BlogContext, withContext: withBlogContext, Provider } = createEntityContext({
	endpoint: "GetAllBlogs",
	listKey: "AllBlog",
	getterKey: "GetAllBlog",
	errorKey: "BlogError",
});

export { BlogContext, withBlogContext };
export default Provider;
