import { useEffect, useState } from "react";
import Banner from "../../../components/banner";
import InputField from "components/fields/InputField";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { withAuthContext } from "context/Auth";
import Upload from "./Upload";
import ImageCloud from "../../../link";
import { getMissingFields } from "utils/validate";

const REQUIRED_FIELDS = ["title", "content"];

const initialState = {
	title: "",
	content: "",
	categories: "",
	tags: "",
	image: {},
	preview: "",
};

const Blog = ({ Token, CheckToken }) => {
	const { id } = useParams();
	const [state, setState] = useState(initialState);
	const navigate = useNavigate();

	function handleChange(name, value) {
		setState({ ...state, [name]: value });
	}

	const GetBlogInfo = () => {
		if (Token) {
			axios
				.get(`${process.env.REACT_APP_PUBLIC_PATH}/BlogInfo/${id}`, {
					headers: { Authorization: Token || localStorage.getItem("token") },
				})
				.then((res) => {
					if (res?.data?.status == 200) {
						setState({
							...res.data.data,
							categories: (res.data.data?.categories || []).join(", "),
							tags: (res.data.data?.tags || []).join(", "),
							preview: res.data.data?.Image?.[0]?.filename ? `${ImageCloud}/${res.data.data.Image[0].filename}` : "",
						});
					}
				})
				.catch((err) => {
					swal({
						text: err?.response?.data?.message || "There was some Error",
						button: { text: "Ok", closeModal: true },
						icon: "error",
					});
					navigate("/admin/Blog");
				});
		} else {
			CheckToken();
			setTimeout(GetBlogInfo, 500);
		}
	};

	useEffect(() => {
		if (id !== "New") GetBlogInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleSubmit = () => {
		const missingFields = getMissingFields(state, REQUIRED_FIELDS);

		if (!Token) {
			swal({ text: "Your session has expired, please sign in again", button: { text: "Ok", closeModal: true }, icon: "error" });
			CheckToken();
			return;
		}

		if (missingFields.length === 0) {
			const payload = {
				title: state.title,
				content: state.content,
				categories: state.categories ? state.categories.split(",").map((c) => c.trim()).filter(Boolean) : [],
				tags: state.tags ? state.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
				image: state.image,
			};

			axios
				.post(`${process.env.REACT_APP_PUBLIC_PATH}/${id !== "New" ? `Update-Blog/${id}` : "Create-Blog"}`, payload, {
					headers: { Authorization: Token || localStorage.getItem("token") },
				})
				.then((res) => {
					if (res?.data?.status == 200) {
						setState(initialState);
						navigate("/admin/Blog");
					}
					swal({
						text: res?.data?.message,
						button: { text: "Ok", closeModal: true },
						icon: res?.data?.status == 200 ? "success" : "error",
					});
				})
				.catch(() => {
					swal({ text: "There was some Error", button: { text: "Ok", closeModal: true }, icon: "error" });
				});
		} else {
			swal({ text: `Please fill in: ${missingFields.join(", ")}`, button: { text: "Ok", closeModal: true }, icon: "error" });
		}
	};

	const handleImageSelected = (imageData) => handleChange("image", imageData);

	return (
		<div className="mt-3 grid h-full grid-cols-1">
			<div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
				<Banner Heading={" Add/Update Blog Post"} SubHeading={"Share pet care tips, product spotlights, and news with your customers."} />
				<div class="grid grid-cols-4 gap-4 my-10 bg-white rounded-[50px] py-20 px-10">
					<h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">Basic Details</h4>
					<div className="col-span-4">
						<InputField
							variant="auth"
							extra="mb-3"
							label="title*"
							id="title"
							type="text"
							name="title"
							value={state?.title}
							onChange={(e) => handleChange("title", e.target.value)}
						/>
					</div>
					<div className="col-span-4">
						<label htmlFor="content" className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium">content*</label>
						<textarea
							id="content"
							rows={8}
							value={state?.content}
							onChange={(e) => handleChange("content", e.target.value)}
							className="mt-2 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
						/>
					</div>
					<InputField
						variant="auth"
						extra="mb-3"
						label="categories (comma separated)"
						id="categories"
						type="text"
						name="categories"
						value={state?.categories}
						onChange={(e) => handleChange("categories", e.target.value)}
					/>
					<InputField
						variant="auth"
						extra="mb-3"
						label="tags (comma separated)"
						id="tags"
						type="text"
						name="tags"
						value={state?.tags}
						onChange={(e) => handleChange("tags", e.target.value)}
					/>
					<div className="col-span-4">
						<Upload onImageSelected={handleImageSelected} preview={state?.preview} />
					</div>
					<button
						onClick={() => handleSubmit()}
						className="col-span-4 linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
					>
						{id !== "New" ? "Update" : "Add"} Blog Post
					</button>
				</div>
			</div>
		</div>
	);
};

export default withAuthContext(Blog);
