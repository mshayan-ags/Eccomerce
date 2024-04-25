import MUI from "../../../components/Tables/MUI/index";
import { withBlogContext } from "context/Blog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Tables = ({ AllBlog, GetAllBlog, BlogError }) => {
	useEffect(() => {
		GetAllBlog();
	}, []);

	const navigate = useNavigate();

	const Columns = [
		{
			headerName: "Action",
			renderCell: ({ row }) => (
				<button
					onClick={() => navigate(`/admin/AddBlog/${row?._id}`)}
					className="linear w-full rounded-xl bg-brand-500 py-[4px] text-[12px] font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
				>
					Edit
				</button>
			),
		},
		{ headerName: "title", field: "title" },
		{ headerName: "categories", field: "categories", renderCell: ({ row }) => row?.categories?.join(", ") },
		{ headerName: "tags", field: "tags", renderCell: ({ row }) => row?.tags?.join(", ") },
		{ headerName: "publicationDate", field: "publicationDate" },
	];

	return (
		<div>
			<div class="my-10 mt-5 h-full rounded-[50px] bg-white px-8 pb-20 pt-8">
				<div class="mb-10 grid grid-cols-3 gap-8">
					<h4 className="col-span-2 text-2xl font-bold text-navy-700 dark:text-white">All Blog Posts</h4>
					<div class="flex w-full justify-end">
						<button
							onClick={() => navigate(`/admin/AddBlog/New`)}
							className="linear rounded-xl bg-brand-500 px-10 py-[8px] text-[18px] font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
						>
							Add Blog Post
						</button>
					</div>
				</div>
				{BlogError ? (
					<p>
						<h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">{BlogError}</h4>
					</p>
				) : (
					<MUI columns={Columns} rows={AllBlog} />
				)}
			</div>
		</div>
	);
};

export default withBlogContext(Tables);
