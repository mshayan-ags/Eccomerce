import React from "react";
import Dog from "../../assests/Dog.png";
import { useNavigate } from "react-router-dom";
import { ImageCloud } from "../../link";
import moment from "moment";

function stripHtml(text) {
	return (text || "").replace(/<[^>]*>/g, "");
}

function BlogCard({ data }) {
	const navigate = useNavigate();
	if (!data) return null;

	const excerpt = stripHtml(data?.content).slice(0, 140);

	return (
		<div onClick={() => navigate(`/Blog/${data?._id}`)} className="cursor-pointer inline-flex flex-col p-[8px] flex-shrink-0 bg-neutral rounded-[12px] shadow-xl w-[90%] h-[100%] m-[10px]">
			<img
				src={data?.Image?.[0]?.filename ? `${ImageCloud}/${data.Image[0].filename}` : Dog}
				alt={data?.title}
				className="w-[264px] h-[244px] flex-shrink-0 object-cover"
			/>

			<div className="flex flex-col items-start p-[8px] pb-[20px] gap-0 overflow-hidden">
				<div className="flex p-[2px] px-[10px] items-start gap-10 rounded-3xl bg-primary text-white text-neutral-00 font-actor text-xs font-normal leading-6">
					{data?.categories?.[0] || "Pet knowledge"}
				</div>

				<p className="text-neutral font-actor text-base font-normal leading-6 m-[12px] mr-[0px] ml-[0px]">
					{data?.title}
				</p>
				<p className="overflow-hidden text-neutral w-[90%] text-ellipsis whitespace-normal font-actor text-sm font-normal leading-5">
					{excerpt}{excerpt.length >= 140 ? "..." : ""}
				</p>
				<p className="text-[#999999] font-actor text-xs mt-2">{moment(data?.publicationDate).format("DD MMMM YYYY")}</p>
			</div>
		</div>
	);
}

export default BlogCard;
