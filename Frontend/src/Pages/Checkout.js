import React, { useEffect, useState } from "react"
import Headers from "../Components/Header/index"
import DogFood from "../assests/AddressPic.png"
import Footer from "../Components/Footer"
import ListCard from "../Components/Card/Card2"
import { withCartContext } from "../context/Cart"
import { withAuthContext } from "../context/Auth"
import swal from "sweetalert"
import { useNavigate } from "react-router-dom"
import Address from "../Components/Address"
import AddressCard from "../Components/Card/AddressCard"
import { withProductContext } from "../context/Product"
import UsedDiscountCoupon from "../Components/Coupons/used"
import { MdAddBusiness } from "react-icons/md";

function Checkout({ Cart, getTotal, GetAllAddress,
    AllAddress, getTotalAfterCoupon, getCouponDiscount,
    getSubTotal, getDiscount, Coupon }) {
    const [New, setNew] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
        GetAllAddress()
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
    }, [])
    return (
        <React.Fragment>
            <Headers />
            {/* <BreadCrumbContainer /> */}
            <div className="w-full flex items-center justify-center my-4 md:my-20">
                <div className="flex justify-between w-[90%] flex-col md:flex-row ">
                    <div className="w-full md:w-[60%]">
                        {AllAddress?.length > 0 ?
                            <div className="w-full">
                                <div className="flex w-full justify-end mb-[20px]">
                                    <button className="bg-[#1e8a30ff] py-[16px] px-[20px] text-[#fff] mt-[15px] rounded-[25px] text-[12px] md:text-[16px] font-[600] leading-[19.2px]" onClick={() => {
                                        setNew(!New)
                                    }}>{New ? "Cancel" : <MdAddBusiness className="w-[25px] h-[25px] text-[#FFFFFF]" />}</button>
                                </div>
                                {New ?
                                    <Address />
                                    :
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        {AllAddress?.map((a, i) => (
                                            <AddressCard
                                                key={a?._id}
                                                Select={true}
                                                id={a?._id}
                                                address={a?.address_line1 + " " + a?.address_line2}
                                                city={a?.city}
                                                country={a?.country}
                                                name={a?.full_name}
                                                state={a?.state}
                                                phone_number={a?.phone_number}
                                            />
                                        ))}
                                    </div>
                                }
                            </div> : !New ? (
                                <div className="h-[60vh] md:h-[80vh] w-full flex flex-col justify-center align-center items-center gap-2">
                                    <img src={DogFood} className="w-[80%] md:w-[40%] h-[20vh] md:h-[30vh] my-[2%]" />
                                    <h1 className="text-[20px] font-bold text-center md:text-[30px] text-primary">Share Your Address and Experience the Magic!</h1>
                                    <p className="text-[10px] md:text-[12px] text-[#000000] text-center">Your search for excellence ends here, where innovation meets dedication. Together, we’ll craft something extraordinary that exceeds expectations and leaves a lasting impression!</p>
                                    <button className="mt-[2%] bg-[#1e8a30ff] py-[8px] md:py-[16px] w-[80%] md:w-[20%] text-[#fff] mt-[15px] rounded-[25px] text-[12px] md:text-[16px] font-[600]" onClick={() => {
                                        setNew(!New)
                                    }}>{New ? "Cancel" : "Add Address"}</button>
                                </div>
                            ) : <Address />}
                    </div>
                    <div className="w-full md:w-[35%] border-2 boder-color-[#E6E6E6] p-[24px] rounded-[8px] h-fit mt-[30px] md:mt-[0%]">
                        <h2 className="text-[24px] mb-[20px] leading-[36px] font-[500] font-poppins text-[#1A1A1A]">Order Summary</h2>
                        {Cart?.length > 0 ? Cart?.map(e => (
                            <ListCard key={e?.ProductID} id={e?.ProductID} />
                        ))
                            :
                            <p className="font-bold text-[20px] text-center leading-[21px] font-poppins text-[#4D4D4D]">Your Cart is Empty</p>
                        }
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-bold leading-[21px] text-[18px] text-[#4D4D4D]">SubTotal</p>
                            <p className="font-[500] leading-[21px] text-[18px] text-[#4D4D4D] ">${getSubTotal()}</p>
                        </div>
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-bold leading-[21px] text-[18px] text-[#4D4D4D]">Discount</p>
                            <p className="font-[500] leading-[21px] text-[18px] text-[#4D4D4D] ">${getDiscount()}</p>
                        </div>
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-bold leading-[21px] text-[18px] text-[#4D4D4D]">Total(without coupon)</p>
                            <p className="font-[500] leading-[21px] text-[18px] text-[#4D4D4D] ">${getTotal()}</p>
                        </div>
                        <div className="flex py-[15px] border-b-2 justify-between">
                            <p className="font-bold leading-[21px] text-[18px] text-[#4D4D4D]">Coupon Discount</p>
                            <p className="font-[500] leading-[21px] text-[18px] text-[#4D4D4D] ">${getCouponDiscount()}</p>
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
                </div>
            </div>
            <Footer />
        </React.Fragment >
    )
}
export default withCartContext(withAuthContext(withProductContext(Checkout)))