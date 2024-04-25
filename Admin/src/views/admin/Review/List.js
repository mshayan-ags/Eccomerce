import MUI from "../../../components/Tables/MUI/index";
import { withAuthContext } from "context/Auth";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const Tables = ({ Token, CheckToken }) => {
	const [AllReview, setAllReview] = useState([]);
	const [ReviewError, setReviewError] = useState(null);

	const GetAllReview = () => {
		if (!Token && !localStorage.getItem("token")) {
			CheckToken();
			return;
		}
		axios
			.get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllReviews`, {
				headers: { Authorization: Token || localStorage.getItem("token") },
			})
			.then((res) => {
				if (res?.data?.status == 200) {
					setAllReview(res?.data?.data);
				} else {
					setReviewError(res?.data?.message);
				}
			})
			.catch((err) => setReviewError(err?.message));
	};

	useEffect(() => {
		GetAllReview();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Token]);

	const setApproval = (id, isApproved) => {
		axios
			.post(
				`${process.env.REACT_APP_PUBLIC_PATH}/Set-Review-Approval/${id}`,
				{ isApproved },
				{ headers: { Authorization: Token || localStorage.getItem("token") } }
			)
			.then((res) => {
				swal({ text: res?.data?.message, button: { text: "Ok", closeModal: true }, icon: res?.data?.status == 200 ? "success" : "error" });
				GetAllReview();
			})
			.catch(() => {
				swal({ text: "There was some Error", button: { text: "Ok", closeModal: true }, icon: "error" });
			});
	};

	const deleteReview = (id) => {
		axios
			.post(`${process.env.REACT_APP_PUBLIC_PATH}/Delete-Review/${id}`, {}, {
				headers: { Authorization: Token || localStorage.getItem("token") },
			})
			.then((res) => {
				swal({ text: res?.data?.message, button: { text: "Ok", closeModal: true }, icon: res?.data?.status == 200 ? "success" : "error" });
				GetAllReview();
			})
			.catch(() => {
				swal({ text: "There was some Error", button: { text: "Ok", closeModal: true }, icon: "error" });
			});
	};

	const Columns = [
		{
			headerName: "Action",
			renderCell: ({ row }) => (
				<div className="flex gap-2">
					<button
						onClick={() => setApproval(row?._id, !row?.isApproved)}
						className="linear rounded-xl bg-brand-500 py-[4px] px-[8px] text-[12px] font-medium text-white transition duration-200 hover:bg-brand-600"
					>
						{row?.isApproved ? "Hide" : "Show"}
					</button>
					<button
						onClick={() => deleteReview(row?._id)}
						className="linear rounded-xl bg-red-500 py-[4px] px-[8px] text-[12px] font-medium text-white transition duration-200 hover:bg-red-600"
					>
						Delete
					</button>
				</div>
			),
		},
		{ headerName: "isApproved", field: "isApproved", renderCell: ({ row }) => (row?.isApproved ? "Visible" : "Hidden") },
		{ headerName: "reviewer", field: "user", renderCell: ({ row }) => row?.user?.name || "Unknown" },
		{ headerName: "rating", field: "rating" },
		{ headerName: "comment", field: "comment" },
		{ headerName: "targetType", field: "targetType" },
	];

	return (
		<div>
			<div class="my-10 mt-5 h-full rounded-[50px] bg-white px-8 pb-20 pt-8">
				<div class="mb-10 grid grid-cols-3 gap-8">
					<h4 className="col-span-2 text-2xl font-bold text-navy-700 dark:text-white">All Reviews</h4>
				</div>
				{ReviewError ? (
					<p>
						<h4 className="col-span-4 mb-2.5 text-2xl font-bold text-navy-700 dark:text-white">{ReviewError}</h4>
					</p>
				) : (
					<MUI columns={Columns} rows={AllReview} />
				)}
			</div>
		</div>
	);
};

export default withAuthContext(Tables);
