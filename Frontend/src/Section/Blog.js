import React, { useEffect, useState } from "react";
import axios from "axios";
import Border from "../Components/Button/Border";
import { ReactComponent as Arrow } from "../assests/Chevron_Right_MD.svg";
import BlogCard from "../Components/Blog Card";
import { BackendLink } from "../link";
import { useNavigate } from "react-router-dom";

function Blog({ heading, subHeading }) {
	const navigate = useNavigate();
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		axios
			.get(`${BackendLink}/GetAllBlogs`)
			.then((res) => {
				if (res?.data?.status == 200) setPosts(res?.data?.data || []);
			})
			.catch(() => { });
	}, []);

	if (posts.length === 0) return null;

	return (
		<div className="overflow-hidden w-full flex flex-col items-center justify-center pt-[30px] pb-[30px]">
			<div className="flex flex-row justify-between mt-[28px] mb-[28px] w-full">
				<div>
					<p className="text-black font-actor text-base font-normal leading-24">{subHeading}</p>
					<h2 className="text-primary font-bold font-abril-fatface text-2xl font-normal leading-36 capitalize">
						{heading}
					</h2>
				</div>
				<Border
					text={"View more"}
					onClick={() => navigate("/Blog")}
					Component={() => (
						<div className="w-5 h-5 flex items-center justify-center">
							<Arrow />
						</div>
					)}
				/>
			</div>
			<div className="w-full p-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-0">
				{posts.slice(0, 3).map((post) => (
					<BlogCard key={post?._id} data={post} />
				))}
			</div>
		</div>
	);
}

export default Blog;
