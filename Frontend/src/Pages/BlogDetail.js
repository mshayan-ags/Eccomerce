import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import Headers from "../Components/Header/index";
import Footer from "../Components/Footer";
import Dog from "../assests/Dog.png";
import { BackendLink, ImageCloud } from "../link";

function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        axios
            .get(`${BackendLink}/BlogInfo/${id}`)
            .then((res) => {
                if (res?.data?.status == 200) setPost(res?.data?.data);
            })
            .catch(() => { });
    }, [id]);

    return (
        <React.Fragment>
            <Headers />
            <div className="w-full flex items-center justify-center my-[7%]">
                <div className="w-full md:w-[70%] px-6">
                    {post ? (
                        <>
                            <img
                                src={post?.Image?.[0]?.filename ? `${ImageCloud}/${post.Image[0].filename}` : Dog}
                                alt={post?.title}
                                className="w-full h-[350px] object-cover rounded-[20px] mb-6"
                            />
                            <div className="flex gap-2 mb-3">
                                {post?.categories?.map((c) => (
                                    <span key={c} className="bg-primary text-white text-xs px-3 py-1 rounded-full">{c}</span>
                                ))}
                            </div>
                            <h1 className="text-[28px] md:text-[36px] font-bold text-[#003459] mb-2">{post?.title}</h1>
                            <p className="text-[#999999] text-sm mb-6">{moment(post?.publicationDate).format("DD MMMM YYYY")}</p>
                            <p className="text-[16px] leading-[28px] text-[#333738] whitespace-pre-line">{post?.content}</p>
                        </>
                    ) : (
                        <p className="text-center text-[#999999]">Loading...</p>
                    )}
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
export default BlogDetail;
