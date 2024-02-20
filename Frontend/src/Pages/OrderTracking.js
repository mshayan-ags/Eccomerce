import React, { useEffect, useState } from "react"
import Header from "../Components/Header"
import BreadCrumbContainer from "../Components/BreadCrumbContainer"
import FoodImage from "../assests/cartImage.png"
import Footer from "../Components/Footer"
import { useNavigate, useParams } from "react-router-dom"
import { BackendLink, ImageCloud } from "../link"
import axios from "axios"
import swal from "sweetalert"
import { withAuthContext } from "../context/Auth"
import moment from "moment"
import DiscountCoupon from "../Components/Coupons"
import { socket } from "../socket"
function OrderTracking({ Token, CheckToken }) {
    const navigate = useNavigate();
    const { id } = useParams()
    const [state, setState] = useState({
    })
    const [Loading, setLoading] = useState(false);
    const [Checked, setChecked] = useState(0);

    const STATUS_STEP = { Pending: 1, Processing: 2, Shipped: 3, Delivered: 4 };

    const getData = () => {
        if (Token && id) {
            setLoading(true);
            axios
                .get(`${BackendLink}/SaleInfo/${id}`, {
                    headers: {
                        Authorization: Token
                            ? `${Token}`
                            : `${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    setLoading(false);
                    if (res?.data?.status == 200) {
                        setState(res?.data?.data)
                        setChecked(STATUS_STEP[res?.data?.data?.status] || 0)
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err)
                });
        }
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
         CheckToken()
    }, [])

    useEffect(() => {
        getData();
    }, [id, Token])

    // Live status updates: the admin panel emits "order-updated" over the
    // same socket when it changes this order's status, so this page reflects
    // it immediately instead of requiring a refresh.
    useEffect(() => {
        if (!id || !Token) return;

        socket.connect();
        socket.emit("join-order", { saleId: id, token: Token || localStorage.getItem("token") });

        const handleUpdate = (payload) => {
            if (payload?.id !== id) return;
            setState((prev) => ({ ...prev, status: payload.status, trackingDetails: payload.trackingDetails }));
            setChecked(STATUS_STEP[payload.status] || 0);
        };

        socket.on("order-updated", handleUpdate);

        return () => {
            socket.emit("leave-order", id);
            socket.off("order-updated", handleUpdate);
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, Token])

    return (
        <React.Fragment>
            <Header />
            <BreadCrumbContainer />
            <main className="w-full flex items-center justify-center mb-40">
                <div className="w-[60%] border-2 mt-20 rounded-[8px]">
                    <section className="p-[20px] flex items-center justify-between">
                        <div className=" flex items-center gap-[10px]">
                            <h2 className="font-poppins font-[500] text-[20px] leading-[30px] text-[#1A1A1A]">Order Details</h2>
                            <span className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A]">.</span>
                            <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A]">{moment(state?.created_at).format("DD MMMM YYYY")}</p>
                            <span className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A]">.</span>
                            <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A]">{state?.Product?.length} Products</p>
                        </div>
                        <div>
                            <span className="font-poppins font-[500] text-[16px] leading-[24px] text-[#1e8a30ff]" onClick={() => {
                                navigate("/")
                            }}>Back to List</span>
                        </div>
                    </section>
                    <section className="flex justify-between p-[20px]">
                        <div className="border-2 flex items-center rounded-[8px] w-[66%]">
                            <div className="border-r-[2px] w-[50%] ">
                                <p className="font-[500] text-[14px] leading-[14px] font-poppins  p-[20px] border-b-2 w-[100%]">Basic Details</p>
                                <hr />
                                <div className="p-[20px]">
                                    <p className="font-poppins font-[400] text-[16px] leading-[24px] text-[#1A1A1A] ">{state?.User?.name}</p>
                                    <p className="font-poppins font-[400] text-[14px] leading-[16px] text-[#666666] mt-[10px]">{state?.Address?.address_line1 + "\n" + state?.Address?.address_line2}</p>
                                </div>
                                <div className="p-[20px]">
                                    <p className="font-poppins font-[500] text-[12px] leading-[12px] text-[#999999]">Email</p>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A] ">{state?.User?.email}</p>
                                    <p className="font-poppins font-[500] text-[12px] leading-[12px] text-[#999999] mt-[10px]">Phone</p>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#666666] ">{state?.Address?.phone_number}</p>
                                </div>
                            </div>
                            <div className="border-r-[2px] w-[50%] ">
                                <p className="font-[500] text-[14px] leading-[14px] font-poppins  p-[20px] border-b-2 w-[100%]">Shipping Address</p>
                                <hr />
                                <div className="p-[20px]">
                                    <p className="font-poppins font-[400] text-[16px] leading-[24px] text-[#1A1A1A] ">{state?.Address?.full_name}</p>
                                    <p className="font-poppins font-[400] text-[14px] leading-[16px] text-[#666666] mt-[10px]">{state?.Address?.address_line1 + "\n" + state?.Address?.address_line2}</p>
                                </div>
                                <div className="p-[20px]">
                                    <p className="font-poppins font-[500] text-[12px] leading-[12px] text-[#999999]">Email</p>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A] ">{state?.User?.email}</p>
                                    <p className="font-poppins font-[500] text-[12px] leading-[12px] text-[#999999] mt-[10px]">Phone</p>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#666666] ">{state?.Address?.phone_number}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-2 rounded-[8px] w-[32%]">
                            <div className="flex justify-between w-full p-[20px]">
                                <div>
                                    <h2 className="font-poppins font-[500] text-[12px] leading-[12px] text-[#999999]">ORDER ID:</h2>
                                    <h2 className="mt-[5px] font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A]">#{state?._id}</h2>
                                </div>
                                {/* <hr className="w-[10px]"/> */}
                                <div className="h-[40px] w-[2px] text-[#1A1A1A]"></div>
                                <div>
                                    <h2 className="font-poppins font-[500] text-[12px] leading-[12px] text-[#999999]">Payment Method:</h2>
                                    <h2 className="mt-[5px] font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A]">{state?.paymentMethod}</h2>
                                </div>

                            </div>
                            <hr />
                            <div className="p-[20px]">
                                <div className="flex justify-center align-center mt-12">
                                    {!(state?.CouponRedeem?._id == "" || !state?.CouponRedeem?._id) && (
                                        <DiscountCoupon data={state?.CouponRedeem?.Coupon} noButton />
                                    )}
                                </div>
                                <div className="flex items-center justify-between border-b-2 pb-[10px] mb-[10px]">
                                    <p className="font-[400] text-[14px] leading-[21px] text-[#666666]">Subtotal</p>
                                    <p className="font-[500] text-[14px] leading-[21px] text-[#1A1A1A]">${state?.totalAmount?.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-between border-b-2 pb-[10px] mb-[10px]">
                                    <p className="font-[400] text-[14px] leading-[21px] text-[#666666]">Discount</p>
                                    <p className="font-[500] text-[14px] leading-[21px] text-[#1A1A1A]">${Number(state?.totalAmount - state?.totalAmountAfterDiscount)?.toFixed(2)}</p>
                                </div>
                                {state?.couponvalue > 0 && (
                                    <div className="flex items-center justify-between border-b-2 pb-[10px] mb-[10px]">
                                        <p className="font-[400] text-[14px] leading-[21px] text-[#666666]">Coupon Discount</p>
                                        <p className="font-[500] text-[14px] leading-[21px] text-[#1A1A1A]">${Number(state?.couponvalue)?.toFixed(2)}</p>
                                    </div>
                                )}
                                <div className="flex items-center justify-between ">
                                    <p className="font-[400] text-[28px] leading-[27px] text-[#1A1A1A]">Total</p>
                                    <p className="font-[600] text-[18px] leading-[27px] text-[#003459]">${state?.totalAmountAfterDiscount?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="relative  flex items-center justify-center">
                        {Checked > 0 ? (
                            <div className="relative w-[90%]  flex items-center">
                                <div className="relative flex flex-col justify-center items-center">
                                    <div className={`w-[40px] h-[40px] flex items-center justify-center ${Checked >= 1 ? "bg-[#1e8a30ff]" : "bg-[#F2F2F2]"} rounded-full`}>
                                        <p className={`font-[500] leading-[40px] text-[14px] ${Checked >= 1 ? 'text-[#fff]' : 'text-[#000]'} `}>01</p>
                                    </div>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1e8a30ff]">Order received</p>
                                </div>
                                <div className={`absolute left-[65px] bottom-[35px]  w-[200px] h-[8px] ${Checked >= 1 ? "bg-[#1e8a30ff]" : "bg-[#F2F2F2]"}`}></div>
                                <div className="absolute left-[220px] flex flex-col justify-center items-center">
                                    <div className={`w-[40px] h-[40px] flex items-center justify-center ${Checked >= 2 ? "bg-[#1e8a30ff]" : "bg-[#F2F2F2]"} rounded-full`}>
                                        <p className={`font-[500] leading-[40px] text-[14px] ${Checked >= 2 ? 'text-[#fff]' : 'text-[#000]'} `}>02</p>
                                    </div>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1e8a30ff]">Processing</p>
                                </div>
                                <div className={`absolute left-[270px] bottom-[35px]  w-[200px] h-[8px] ${Checked >= 2 ? "bg-[#1e8a30ff]" : "bg-[#F2F2F2]"}`}></div>
                                <div className="absolute left-[455px] flex flex-col justify-center items-center">
                                    <div className={`w-[40px] h-[40px] flex items-center justify-center ${Checked >= 3 ? "bg-[#1e8a30ff]" : "bg-[#F2F2F2]"} rounded-full`}>
                                        <p className={`font-[500] leading-[40px] text-[14px] ${Checked >= 3 ? 'text-[#fff]' : 'text-[#000]'}`}>03</p>
                                    </div>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1e8a30ff]">On the way</p>
                                </div>
                                <div className={`absolute left-[510px] bottom-[35px]  w-[200px] h-[8px] ${Checked >= 3 ? "bg-[#1e8a30ff]" : "bg-[#F2F2F2]"}`}></div>
                                <div className="absolute left-[695px] flex flex-col justify-center items-center">
                                    <div className={`w-[40px] h-[40px] flex items-center justify-center ${Checked >= 4 ? " bg-[#1e8a30ff]" : "bg-[#F2F2F2]"} rounded-full`}>
                                        <p className={`font-[500] leading-[40px] text-[14px] ${Checked >= 4 ? 'text-[#fff]' : 'text-[#000]'}`}>04</p>
                                    </div>
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1e8a30ff]">Delivery</p>
                                </div>
                            </div>
                        ) : (
                            <p className="font-[400] text-[28px] leading-[27px] text-[#1A1A1A]">The Order Was {state?.status} Or There Must Be Some Issue</p>
                        )}
                    </section>
                    <section>
                        <div className="w-full flex items-center justify-between p-[10px] mt-[15px] bg-[#F2F2F2]">
                            <p className="font-[500] text-[12px] leading-[12px] font-poppins text-[#4D4D4D] w-[40%]">Product</p>
                            <p className="font-[500] text-[12px] leading-[12px] font-poppins text-[#4D4D4D] w-[10%]">PRICE</p>
                            <p className="font-[500] text-[12px] leading-[12px] font-poppins text-[#4D4D4D] w-[10%]">QUANTIY</p>
                            <p className="font-[500] text-[12px] leading-[12px] font-poppins text-[#4D4D4D] w-[20%]">SUBTOTAL</p>
                        </div>{state?.Product?.length > 0 && state?.Product?.map((a) =>
                            <div key={a?._id} className="flex items-center justify-between w-full border-b-2 p-[10px] border-b-[#E6E6E6]">
                                <div className="flex items-center gap-[5px] w-[40%]">
                                    <img src={a?.product?.images?.[0]?.filename ? `${ImageCloud}/${a?.product?.images?.[0]?.filename}` : FoodImage} className="w-[70px] h-[70px]" />
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#00171F]">{a?.product?.ProductCode} - {a?.product?.name}</p>
                                </div>
                                <div className="w-[10%]">
                                    {a?.totalPriceAfterDiscount < a?.totalPrice ? (
                                        <p className="text-center text-[16px] leading-[24px] font-Poppins font-400 text-[#1e8a30ff]">
                                            <del className="text-[#00171F] text-[13px] mr-[5px] truncate">${Number(a?.totalPrice)?.toFixed(2)}</del>
                                            ${Number(a?.totalPriceAfterDiscount)?.toFixed(2)}
                                        </p>
                                    ) : (
                                        <p className="text-center text-[16px] leading-[24px] font-Poppins font-400 text-[#1e8a30ff]">
                                            ${Number(a?.totalPrice)?.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                                <div className="w-[10%]">
                                    <p className="font-poppins font-[400] text-[14px] leading-[21px] text-[#1A1A1A] ">x{a?.quantity}</p>
                                </div>
                                <div className="w-[20%]">
                                    {a?.totalPriceAfterDiscount < a?.totalPrice ? (
                                        <p className="text-center text-[16px] leading-[24px] font-Poppins font-400 text-[#1e8a30ff]">
                                            <del className="text-[#00171F] text-[13px] mr-[5px] truncate">${Number(a?.totalPrice * a?.quantity)?.toFixed(2)}</del>
                                            ${Number(a?.totalPriceAfterDiscount * a?.quantity)?.toFixed(2)}
                                        </p>
                                    ) : (
                                        <p className="text-center text-[16px] leading-[24px] font-Poppins font-400 text-[#1e8a30ff]">
                                            ${Number(a?.totalPrice * a?.quantity)?.toFixed(2)}
                                        </p>
                                    )}</div>
                            </div>)}
                    </section>
                </div>
            </main >
            <Footer />
        </React.Fragment >
    )
}
export default withAuthContext(OrderTracking)