import React, { useEffect } from "react"

import Headers from "../Components/Header/index"
import BreadCrumbContainer from "../Components/BreadCrumbContainer"
import Dropdown from "../Components/Dropdown"
import DogFood from "../assests/DogFood.png"
import Footer from "../Components/Footer"
import ListCard from "../Components/Card/Card2"
import { withCartContext } from "../context/Cart"
import Payment from "../Components/Payment"
import swal from "sweetalert"
import { useNavigate } from "react-router-dom"
import UsedDiscountCoupon from "../Components/Coupons/used"

function PaymentScreen({ Cart, getTotal, getDiscount, getSubTotal, getTotalAfterCoupon, getCouponDiscount, Coupon }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (getTotalAfterCoupon() <= 0) {
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
    }, [])
    return (
        <React.Fragment>
            
            <Headers />
            <div className="w-full flex items-center justify-center mt-20 mb-20">
                <div className="flex md:flex-row flex-col gap-10 justify-between w-[90%]">
                    <div className="md:w-[30%] w-[100%] border-2 boder-color-[#E6E6E6] p-[24px] rounded-[8px] h-fit">
                        <h2 className="text-[24px] mb-[20px] leading-[36px] font-[500] font-poppins text-[#1A1A1A]">Order Summary</h2>
                        {Cart?.length > 0 ? Cart?.map(e => (
                            <ListCard key={e?.ProductID} id={e?.ProductID} />
                        ))
                            :
                            <p className="font-[400] text-[20px] text-center leading-[21px] font-poppins text-[#4D4D4D]">Your Cart is Empty</p>
                        }
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-[400] leading-[21px] text-[14px] text-[#4D4D4D]">SubTotal</p>
                            <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getSubTotal()}</p>
                        </div>
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-[400] leading-[21px] text-[14px] text-[#4D4D4D]">Discount</p>
                            <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getDiscount()}</p>
                        </div>
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-[400] leading-[21px] text-[14px] text-[#4D4D4D]">Total(without coupon)</p>
                            <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getTotal()}</p>
                        </div>
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-[400] leading-[21px] text-[14px] text-[#4D4D4D]">Coupon Discount</p>
                            <p className="font-[500] leading-[21px] text-[14px] text-[#4D4D4D] ">${getCouponDiscount()}</p>
                        </div>
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-bold text-[30px] text-[#1e8a30ff]">Total</p>
                            <p className="font-bold  leading-[31px]  text-[20px] text-[#1e8a30ff] ">
                                <span className="font-bold  leading-[31px]  text-[30px] text-[#1e8a30ff] ">$</span>
                                {getTotalAfterCoupon()}
                            </p>
                        </div>
                        <div className="flex justify-center align-center mt-12">
                            {!(Coupon == "" || !Coupon) && (
                                <UsedDiscountCoupon />
                            )}
                        </div>
                    </div>
                    <div className="md:w-[65%]  w-[100%]">
                        <Payment />
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    )
}
export default withCartContext(PaymentScreen)