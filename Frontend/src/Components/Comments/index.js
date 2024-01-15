import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { BackendLink } from "../../link";
import { withAuthContext } from "../../context/Auth";
import { FaStar, FaRegStar } from "react-icons/fa";

function Stars({ value, onChange }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} onClick={() => onChange && onChange(n)} className={onChange ? "cursor-pointer" : ""}>
                    {n <= value ? <FaStar className="text-[#FFB800]" /> : <FaRegStar className="text-[#FFB800]" />}
                </span>
            ))}
        </div>
    );
}

function Comments({ productId, Token }) {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);
    const [count, setCount] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const GetReviews = () => {
        if (!productId) return;
        axios
            .get(`${BackendLink}/GetProductReviews/${productId}`)
            .then((res) => {
                if (res?.data?.status == 200) {
                    setReviews(res?.data?.data?.reviews || []);
                    setAverage(res?.data?.data?.average || 0);
                    setCount(res?.data?.data?.count || 0);
                }
            })
            .catch(() => { });
    };

    useEffect(() => {
        GetReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const handleSubmit = () => {
        if (!Token && !localStorage.getItem("token")) {
            swal({
                text: "Please Login To Leave a Review",
                button: { text: "Ok", closeModal: true },
                icon: "warning",
            }).then(() => navigate("/SignIn"));
            return;
        }
        if (!rating) {
            swal({ text: "Please select a star rating", button: { text: "Ok", closeModal: true }, icon: "warning" });
            return;
        }

        setSubmitting(true);
        axios
            .post(
                `${BackendLink}/Create-Review`,
                { targetType: "Product", targetId: productId, rating, comment },
                { headers: { Authorization: Token || localStorage.getItem("token") } }
            )
            .then((res) => {
                setSubmitting(false);
                if (res?.data?.status == 200) {
                    setRating(0);
                    setComment("");
                    GetReviews();
                }
                swal({
                    text: res?.data?.message,
                    button: { text: "Ok", closeModal: true },
                    icon: res?.data?.status == 200 ? "success" : "error",
                });
            })
            .catch((err) => {
                setSubmitting(false);
                swal({
                    text: err?.response?.data?.message || "There was some Error",
                    button: { text: "Ok", closeModal: true },
                    icon: "error",
                });
            });
    };

    return (
        <div className="self-stretch p-12 pt-0 relative max-w-full">
            <div className="flex items-center gap-3">
                <h2 className="m-0 text-actorPro leading-[36px] font-normal text-[24px] text-[#00171F] flex items-end">
                    Customer Reviews
                </h2>
                {count > 0 && (
                    <>
                        <Stars value={Math.round(average)} />
                        <p className="m-0 font-poppins text-[14px] text-[#667479]">{average} out of 5 ({count} review{count === 1 ? "" : "s"})</p>
                    </>
                )}
            </div>

            <div className="mt-6 p-4 border-2 rounded-[12px]">
                <p className="m-0 font-actorPro text-[14px] font-[600] text-[#1A1A1A] mb-2">Leave a Review</p>
                <Stars value={rating} onChange={setRating} />
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full mt-3 p-3 border-2 rounded-[8px] text-[14px] outline-none"
                    rows={3}
                />
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-2 bg-[#1e8a30ff] text-white py-[8px] px-[20px] rounded-[25px] text-[14px] font-[600] disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </div>

            <div className="my-0 mx-[!important] flex flex-col items-start justify-start py-0 pr-0 box-border max-w-full mt-4">
                {reviews?.length > 0 ? reviews.map((r) => (
                    <div key={r?._id} className="w-full mt-6">
                        <div className="flex justify-between w-full">
                            <div>
                                <p className="m-0 font-actorPro text-[14px] leading-[21px] font-[500] text-[#1A1A1A]">
                                    {r?.user?.name || "Anonymous"}
                                </p>
                                <Stars value={r?.rating} />
                            </div>
                            <p className="m-0 font-poppins text-[14px] leading-[21px] font-[500] text-[#999999]">
                                {moment(r?.created_at).fromNow()}
                            </p>
                        </div>
                        {r?.comment && (
                            <p className="m-0 mt-2 font-poppins text-[14px] leading-[21px] text-[#4D4D4D]">{r?.comment}</p>
                        )}
                    </div>
                )) : (
                    <p className="mt-6 font-poppins text-[14px] text-[#999999]">No reviews yet - be the first to share your thoughts.</p>
                )}
            </div>
        </div>
    )
}
export default withAuthContext(Comments)
