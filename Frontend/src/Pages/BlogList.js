import React, { useEffect, useState } from "react";
import axios from "axios";
import Headers from "../Components/Header/index";
import Footer from "../Components/Footer";
import BlogCard from "../Components/Blog Card";
import { BackendLink } from "../link";

function BlogList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        axios
            .get(`${BackendLink}/GetAllBlogs`)
            .then((res) => {
                if (res?.data?.status == 200) setPosts(res?.data?.data || []);
            })
            .catch(() => { });
    }, []);

    return (
        <React.Fragment>
            <Headers />
            <div className="w-full flex items-center justify-center my-[7%]">
                <div className="w-[90%]">
                    <h2 className="text-center font-[400] text-[35px] leading-[36px] text-[#003459] font-abril mt-10 mb-10">From the Blog</h2>
                    {posts.length > 0 ? (
                        <div className="w-full p-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-0">
                            {posts.map((post) => (
                                <BlogCard key={post?._id} data={post} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[#999999]">No posts yet - check back soon.</p>
                    )}
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
export default BlogList;
