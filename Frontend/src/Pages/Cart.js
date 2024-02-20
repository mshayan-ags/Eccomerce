import React, { useState } from "react"
import Footer from "../Components/Footer"
import Headers from "../Components/Header/index"
import { ReactComponent as Schedule } from "../assests/Schedule.svg";
import CartCard from "../Components/Card/CartCard"
import { withCartContext } from "../context/Cart"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { withAuthContext } from "../context/Auth"
import swal from "sweetalert"
import DiscountCoupon from "../Components/Coupons"
import UsedDiscountCoupon from "../Components/Coupons/used"
import Swal from "sweetalert2"
import moment from "moment"

function CartPage({ Cart, getTotal, Token, CheckToken, getSubTotal, getDiscount, ReedeemCoupon, AllCoupon, Coupon, GetAllCouponsUser, getCouponDiscount, getTotalAfterCoupon,
    ScheduleOrder,
    setScheduleOrder }) {
    const [CouponCode, setCouponCode] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
        CheckToken()
        GetAllCouponsUser()
    }, [])
    return (
        <React.Fragment>
            <Headers />
            <div className="w-full flex flex-col justify-center items-center mt-[7%]">
                <div className="w-[83%]">
         
                </div>
                <div className="w-[90%] h-[100%]">
                    <h2 className="text-center font-[400] text-[35px] leading-[36px] text-[#003459] font-abril mt-10 mb-10">My Cart</h2>
                    <div className="flex md:flex-row flex-col gap-10 justify-between">
                        <div className="md:w-[68%] w-[100%] border-2 rounded-[12px]">
                            <div className="flex items-center justify-between p-5 border-b-2 mb-2">
                                <p className="w-[43%] text-[8px] md:text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080]">PRODUCT</p>
                                <p className="text-center w-[10%] text-[8px] md:text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080]">PRICE</p>
                                <p className="w-[20%] text-[8px] md:text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080] text-center">QUANTITY</p>
                                <p className="text-center w-[10%] text-[8px] md:text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080]">SUBTOTAL</p>
                                <p className="w-[5%] text-[8px] md:text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080] opacity-0">SUBTOTAL</p>
                            </div>
                            {Cart?.length > 0 ? Cart?.map(e => (
                                <CartCard key={e?.ProductID} id={e?.ProductID} />
                            ))
                                :
                                <p className="mt-[20px] font-[400] text-[20px] text-center leading-[21px] font-poppins text-[#4D4D4D]">Your Cart is Empty</p>
                            }
                            <div className="flex justify-between p-5">
                                <div className="py-[14px] px-[32px] bg-[#F2F2F2] rounded-[25px] text-[8px] md:text-[14px] font-600 text-[#4D4D4D] font-poppin">Return To Shop</div>
                                <div className="py-[14px] px-[32px] bg-[#F2F2F2] rounded-[25px] text-[8px] md:text-[14px] font-600 text-[#4D4D4D] font-poppin">Update Cart</div>
                            </div>
                        </div>
                        <div className="md:w-[30%] w-[100%] h-[100%] border-2 rounded-[12px] p-5">
                            <p className="font-bold leading-[30px] text-[25px] text-[#1A1A1A] mb-[20px]">Cart Total</p>
                            <div className="flex py-[15px] border-b-2 justify-between">
                                <p className="font-bold leading-[21px] text-[14px] text-[#4D4D4D]">SubTotal</p>
                                <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getSubTotal()}</p>
                            </div>
                            <div className="flex py-[15px] border-b-2 justify-between">
                                <p className="font-bold leading-[21px] text-[14px] text-[#4D4D4D]">Discount</p>
                                <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getDiscount()}</p>
                            </div>
                            <div className="flex py-[15px] border-b-2 justify-between">
                                <p className="font-bold leading-[21px] text-[14px] text-[#4D4D4D]">Total(without coupon)</p>
                                <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getTotal()}</p>
                            </div>
                            <div className="flex py-[15px] border-b-2 justify-between">
                                <p className="font-bold leading-[21px] text-[14px] text-[#4D4D4D]">Coupon Discount</p>
                                <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getCouponDiscount()}</p>
                            </div>
                            <div className="flex py-[15px] border-b-2 justify-between">
                                <p className="font-bold text-[30px] text-[#1e8a30ff]">Total</p>
                                <p className="font-bold  leading-[31px]  text-[25px] text-[#1e8a30ff] ">
                                    <span className="font-bold  leading-[31px]  text-[30px] text-[#1e8a30ff] ">$</span>
                                    {getTotalAfterCoupon().toFixed(2) || 0}
                                </p>
                            </div>
                            <div className="bg-[#1e8a30ff] py-[16px] rounded-[30px] text-center text-white text-[16px] cursor-pointer font-[600] mt-4" onClick={() => {
                                if (getTotalAfterCoupon() > 0) {
                                    if (Token) {
                                        navigate("/Checkout")
                                    } else {
                                        navigate("/SignIn")
                                    }
                                } else {
                                    swal({
                                        text: "Please Add Some Items To Your Cart",
                                        button: {
                                            text: "Ok",
                                            closeModal: true
                                        },
                                        icon: "warning",
                                    }).then(() => {
                                        navigate("/")
                                    });
                                }
                            }}>
                                Proceed to checkout
                            </div>
                            <div className="flex justify-between cursor-pointer flex-row align-center items-center px-[5%] border-[2px] border-[#1e8a30ff] py-[16px] rounded-[30px] text-center text-[#1e8a30ff]  text-[16px] font-[600] mt-4"
                                onClick={async () => {
                                    if (getTotalAfterCoupon() > 0) {
                                        if (Token) {
                                            const { value: date } = await Swal.fire({
                                                title: "Enter your Preferred Date Time For Order Delivery",
                                                input: "datetime-local",
                                                inputLabel: "Your Preferred Date Time For Order Delivery",
                                                inputValue: moment(ScheduleOrder)?.format("YYYY-MM-DDTHH:MM"),
                                                showCancelButton: true,
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return "You need to write something!";
                                                    }
                                                }
                                            });
                                            if (date) {
                                                setScheduleOrder(date)
                                                Swal.fire(`Your Order is Being Scheduled for ${moment(date)?.format("YYYY-MM-DDTHH:MM")}`);
                                            }
                                            navigate("/Checkout")
                                        } else {
                                            navigate("/SignIn")
                                        }
                                    } else {
                                        swal({
                                            text: "Please Add Some Items To Your Cart",
                                            button: {
                                                text: "Ok",
                                                closeModal: true
                                            },
                                            icon: "warning",
                                        }).then(() => {
                                            navigate("/")
                                        });
                                    }
                                }}>
                                Schedule Order
                                <div className="w-18 h-18"><Schedule /></div>
                            </div>
                            <div className="flex justify-center align-center mt-12">
                                {!(Coupon == "" || !Coupon) && (
                                    <UsedDiscountCoupon />
                                )}
                            </div>
                        </div>
                    </div>
                    {(Coupon == "" || !Coupon) && (
                        <div className="flex items-center justify-between md:w-[68%] w-[100%] p-[20px] mt-5 border-2 rounded-[18px] flex-col">
                            <div className="flex md:flex-row flex-col gap-4 items-center justify-between mt-5 w-[100%]">
                                <h2 className="text-[25px] md:text-[20px] font-bold font-Poppins text-[#1A1A1A]">Coupon Code</h2>
                                <div className="md:w-[80%] w-[100%] flex border-2 rounded-[40px] ">
                                    <input value={CouponCode} onChange={(e) => {
                                        setCouponCode(e?.target?.value)
                                    }} placeholder="Enter Code" type="text" className=" pl-[5px] md:pl-[20px] rounded-[40px] outline-none border-r-none border-l-none border-t-[1px] border-b-[1px] w-[75%] text-[#999999] text-[10px] md:text-[16px] font-[100]" />
                                    <button className="bg-[#1e8a30ff] text-white py-[6px] md:py-[16px] md:w-[25%] w-[40%] rounded-[35px] text-[10px] md:text-[16px] " onClick={() => {
                                        ReedeemCoupon(CouponCode)
                                        GetAllCouponsUser()
                                    }}>Apply Coupon</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-5 w-[100%]">
                                {AllCoupon?.length > 0 ? (
                                    AllCoupon?.map((a) => (
                                        <DiscountCoupon key={a?._id} data={a?.Coupon} coupon_sale={a?.coupon_sale} />
                                    ))
                                ) : <p className="text-[10px] md:text-[16px] font-[900]">No Coupons Availaible</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </React.Fragment >
    )
}
export default withAuthContext(withCartContext(CartPage))
