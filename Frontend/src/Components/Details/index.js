import React, { useEffect, useState } from "react";
import MainImage from "../../assests/DetailImage.png";
import DogFood from "../../assests/DogFood.png";
import LeftArrow from "../../assests/LeftArrow.png";
import Minus from "../../assests/Minus.png";
import Plus from "../../assests/Plus.png";
import BreadsCrumbs from "../BreadCrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { ImageCloud } from "../../link";
import { withCartContext } from "../../context/Cart";
import { withWishlistContext } from "../../context/Wishlist";
import { withAuthContext } from "../../context/Auth";
import { useProductInfo } from "../../hooks/useProductInfo";
import { getDiscountedUnitPrice } from "../../utils/pricing";
import swal from "sweetalert";

import { BsFillBasket3Fill } from "react-icons/bs";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { FaHeart, FaRegHeart } from "react-icons/fa";


function Details({ Cart, AddToCart, isItemCart, RemoveItemCart, UpdateItemCart, getItemCart, isInWishlist, ToggleWishlist, Token }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [quantity, setQuantity] = useState(1)

    const { ProductInfo } = useProductInfo(id);

    const handleWishlistClick = () => {
        if (!Token && !localStorage.getItem("token")) {
            swal({
                text: "Please Login To Save Items To Your Wishlist",
                button: { text: "Ok", closeModal: true },
                icon: "warning",
            }).then(() => navigate("/SignIn"));
            return;
        }
        ToggleWishlist(ProductInfo?._id);
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
    }, [id])


    useEffect(() => {
        if (isItemCart(ProductInfo?._id)) {
            UpdateItemCart(ProductInfo?._id, quantity)
        }
    }, [quantity])

    return (
        <React.Fragment>
            <div className="m-0 self-stretch rounded-xl bg-neutral-color-00 box-border flex md:flex-row flex-col gap-10 items-start justify-start md:pt-[22px] pb-6 px-0 md:px-5 gap-[0px_29px] md:border-[1px] md:border-solid border-neutral-color-10 md:flex-wrap md:pr-6 md:box-border">
                <div className="md:w-[40%] w-[100%] flex flex-col items-start justify-start gap-[17px_0px]">
                    <div className="self-stretch flex flex-col items-center justify-center align-center pt-0 pb-2.5 pr-[5px] pl-0 box-border gap-[12px_0px] max-w-full">
                        <div className="relative border-2 rounded-[20px] self-stretch rounded-3xs flex flex-row items-center justify-between box-border min-h-[276px] md:min-h-[476px] gap-[20px] max-w-full mq450:flex-wrap mq450:pt-[135px]">
                            <div
                                className="h-[100%] w-[560px] rounded-3xs max-w-full flex align-center justify-center"
                            >

                                <img
                                    alt=""
                                    className="h-[20%] md:h-[50%] md:w-[300px] w-[100px]"
                                    src={ProductInfo?.images?.[0]?.filename ? `${ImageCloud}/${ProductInfo?.images?.[0]?.filename}` : MainImage}
                                />
                            </div>
                            <img
                                className="h-[52px] w-[52px] absolute left-4  shrink-0"
                                loading="eager"
                                alt=""
                                src={LeftArrow}
                            />
                            <img
                                className="h-[52px] w-[52px] absolute shrink-0 right-7 [transform:_rotate(-180deg)]"
                                loading="eager"
                                alt=""
                                src={LeftArrow}
                            />
                        </div>
                        <div className="self-stretch overflow-hidden flex flex-row items-start justify-start max-w-full">
                            <div className="w-[560px] overflow-x-auto shrink-0 flex flex-row items-start justify-start gap-[0px_12px] max-w-full">
                                {ProductInfo?.images?.length ? ProductInfo?.images?.map((e, i) =>
                                    <div key={e?._id || i} className="h-[50px] w-[50px] md:h-[120px] md:w-[120px] border-2 border-primary rounded-md relative overflow-hidden flex justify-center align-center items-center">
                                        {/* <div className="h-full w-full bg-gradient-to-r from-[#01111c]  to-[#83abf2]  absolute top-0 opacity-40" /> */}
                                        <img
                                            className="h-[44px] md:h-[94px] md:w-[94px] object-cover"
                                            loading="eager"
                                            alt=""
                                            src={e?.filename ? `${ImageCloud}/${e?.filename}` : DogFood}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:w-[60%] w-[100%] flex flex-col items-start justify-start gap-[18px_0px] lg:flex-1 mt-[5%] md:mt-0">
                    <div className="hidden md:flex">
                        <BreadsCrumbs Brand={ProductInfo?.brand?.name} />
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[6px_0px]">
                        <div className="self-stretch flex flex-col items-start justify-start gap-[2px_0px]">
                            <div className="self-stretch  md:text-[14px] text-[10px] font-actorPro text-[#5a5b5c] md:text-[#99A2A5] text-left">
                                {ProductInfo?.ProductCode}
                            </div>
                            <h2 className="m-0 self-stretch md:text-[25px] text-[15px] font-semibold font-adventPro text-[#00171F] text-left mq450:text-xl mq450:leading-[29px]">
                                {ProductInfo?.name}
                            </h2>
                        </div>
                        {ProductInfo?.Discount?._id ? (
                            <p className="text-neutral md:text-[25px] text-[20px] font-[600] md:h-[50px] text-[#1e8a30ff]">
                                <del className="text-[#00171F] text-[20px] mr-[5px] truncate">${Number(ProductInfo?.price)?.toFixed(2)}</del>
                                ${getDiscountedUnitPrice(ProductInfo?.price, ProductInfo?.Discount).toFixed(2)}
                            </p>
                        ) : (
                            <p className="text-neutral md:text-[25px] text-[20px] font-[600] md:h-[50px] text-[#1e8a30ff]">
                                ${Number(ProductInfo?.price)?.toFixed(2)}
                            </p>
                        )}
                    </div>
                    <div className="w-full gap-10 flex flex-row items-center justify-between gap-[0px_18px] border-[2px] p-3">
                        <div onClick={() => {
                            if (isItemCart(ProductInfo?._id)) {
                                RemoveItemCart(ProductInfo?._id)
                            } else {
                                AddToCart({
                                    id: ProductInfo?._id,
                                    quantity: 1,
                                    price: ProductInfo?.price,
                                    discountedPrice: getDiscountedUnitPrice(ProductInfo?.price, ProductInfo?.Discount),
                                    DiscountID: ProductInfo?.Discount?._id || null
                                })
                            }
                        }} className="bg-[#1e8a30ff] w-[40px] md:h-[52px] h-[40px] md:flex-1 rounded-[25px] box-border flex flex-row items-center justify-center md:pt-3.5 md:pb-2.5 md:pr-6 md:pl-5 gap-[0px_10px] border-[2px] border-solid border-[#1e8a30ff]">
                            {isItemCart(ProductInfo?._id) ?
                                <IoIosRemoveCircleOutline className="w-[22px] h-[22px] object-contain text-white" />
                                : <BsFillBasket3Fill className="w-[18px] h-[18px] object-contain text-white"
                                />
                            }
                            <div className="hidden md:flex text-white md:text-[16px] text-[10px] font-600 leading-[24px] font-actorPro  text-left">
                                {isItemCart(ProductInfo?._id) ? "Remove From Cart" : "Add To Cart"}
                            </div>
                        </div>
                        <div className="col-span-2 border-[2px] gap-8 h-12 rounded-[25px] flex flex-row items-center justify-center px-[10px] md:px-[26px]  box-border whitespace-nowrap">
                            <img src={Minus} className="h-[34px] w-[34px]" onClick={() => {
                                const a = getItemCart(id)?.quantity || quantity;
                                setQuantity(a > 1 ? a - 1 : 1);
                            }} />
                            <div className=" md:text-[16px] text-[14px] font-[400] font-actorPro text-[#1A1A1A] text-left">
                                {getItemCart(id)?.quantity || quantity}
                            </div>
                            <img src={Plus} className="h-[34px] w-[34px]" onClick={() => {
                                const a = getItemCart(id)?.quantity || quantity;
                                setQuantity(a + 1);
                            }} />
                        </div>
                        <div onClick={handleWishlistClick} className="md:w-[60px] md:h-[60px] w-[40px] h-[40px] flex items-center justify-center rounded-full border-2 border-primary cursor-pointer">
                            {isInWishlist(ProductInfo?._id) ?
                                <FaHeart className="w-[24px] h-[24px] text-primary" />
                                : <FaRegHeart className="w-[24px] h-[24px] text-primary" />
                            }
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-start max-w-full">
                        <div className="self-stretch box-border flex flex-row items-start justify-start py-2 px-0 [row-gap:20px] max-w-full border-b-[1px] border-solid border-neutral-color-10">
                            <div className="md:w-[194px] w-[70px] flex flex-row items-center justify-start pt-1 px-[11px] pb-0.5 box-border">
                                <div className="md:text-[18px] text-[12px] font-actorPro font-bold text-[#333738] text-left">
                                    Product Name
                                </div>
                            </div>
                            <div className="flex-1 flex flex-row items-start justify-start pt-1 px-[11px] pb-0.5 box-border min-w-[118px] max-w-full">
                                <div className=" md:text-[14px] text-[10px] font-actorPro text-[#333738] text-left">
                                    {ProductInfo?.name}

                                </div>
                            </div>
                        </div>
                        <div className="self-stretch box-border flex flex-row items-start justify-start py-2 px-0 [row-gap:20px] max-w-full border-b-[1px] border-solid border-neutral-color-10">
                            <div className="md:w-[194px] w-[70px] flex flex-row items-center justify-start pt-1 px-[11px] pb-0.5 box-border">
                                <div className="md:text-[18px] text-[12px] font-actorPro font-bold text-[#333738] text-left">
                                    Category
                                </div>
                            </div>
                            <div className="flex-1 flex flex-row items-start justify-start pt-1 px-[11px] pb-0.5 box-border min-w-[50px] max-w-full">
                                <div className="relative md:text-[14px] text-[10px] font-actorPro text-[#333738] text-left uppercase">
                                    {ProductInfo?.category?.name}

                                </div>
                            </div>
                        </div>
                        <div className="self-stretch box-border flex flex-row items-start justify-start py-2 px-0 [row-gap:20px] max-w-full border-b-[1px] border-solid border-neutral-color-10">
                            <div className="md:w-[194px] w-[70px] flex flex-row items-center justify-start pt-1 px-[11px] pb-0.5 box-border">
                                <div className="md:text-[18px] text-[12px] font-actorPro font-bold text-[#333738] text-left">
                                    Product Code
                                </div>
                            </div>
                            <div className="flex-1 flex flex-row items-start justify-start pt-1 px-[11px] pb-0.5 box-border min-w-[99px] max-w-full">
                                <div className="relative md:text-[14px] text-[10px] font-actorPro text-[#333738] text-left">
                                    {ProductInfo?.ProductCode}
                                </div>
                            </div>
                        </div>
                        {ProductInfo?.color?.length > 1 && <div className="self-stretch box-border flex flex-row items-start justify-start py-2 px-0 [row-gap:20px] max-w-full border-b-[1px] border-solid border-neutral-color-10">
                            <div className="md:w-[194px] w-[70px] flex flex-row items-center justify-start pt-1 px-[11px] pb-0.5 box-border">
                                <div className="md:text-[18px] text-[12px] font-actorPro font-bold text-[#333738] text-left">
                                    Color
                                </div>
                            </div>
                            <div className="flex-1 flex flex-row items-start justify-start pt-1 px-[11px] pb-0.5 box-border min-w-[33px] max-w-full">
                                <div className="relative md:text-[14px] text-[10px] font-actorPro text-[#333738] text-left">
                                    <span className="mx-[10px] px-[15px] py-[5px] rounded-full" style={{ background: ProductInfo?.currentColor }}></span>
                                </div>
                                {ProductInfo?.color?.map((a) => {
                                    if (a?.currentColor != ProductInfo?.currentColor) return <div key={a?._id} onClick={() => navigate(`/ProductDetails/${a?._id}`)} className="relative md:text-[14px] text-[10px] font-actorPro text-[#333738] text-left">
                                        <span className="mx-[10px] px-[15px] py-[5px] rounded-full" style={{ background: a?.currentColor }}></span>
                                    </div>
                                })}
                            </div>
                        </div>}
                        <div className="self-stretch box-border flex flex-row items-start justify-start py-2 px-0 [row-gap:20px] max-w-full border-b-[1px] border-solid border-neutral-color-10">
                            <div className="md:w-[194px] w-[70px] flex flex-row items-center justify-start pt-1 px-[11px] pb-0.5 box-border">
                                <div className="md:text-[18px] text-[12px] font-actorPro font-bold text-[#333738] text-left">
                                    Flavor
                                </div>
                            </div>
                            <div className="flex-1 flex flex-row items-start justify-start pt-1 px-[11px] pb-0.5 box-border min-w-[54px] max-w-full grid md:grid-cols-5 grid-cols-3 gap-4">
                                <button
                                    className="rounded-[5px] bg-primary inline-flex py-[5px] px-[5px] h-[30px] gap-2 items-center justify-center">
                                    <p className="text-white font-actorPro font-normal leading-6 h-[20px] md:text-[10px] text-[8px] overflow-hidden">{ProductInfo?.currentFlavor || "-"}</p>
                                </button>
                                {ProductInfo?.flavor?.map((a) => {
                                    if (a?.currentFlavor != ProductInfo?.currentFlavor) return <button key={a?._id} onClick={() => navigate(`/ProductDetails/${a?._id}`)}
                                        className="rounded-[5px] border-2 border-primary inline-flex py-[5px] px-[5px] h-[30px] gap-2 items-center justify-center">
                                        <p className="text-primary font-actorPro  font-normal leading-6 h-[20px] md:text-[10px] text-[8px] overflow-hidden">{a?.currentFlavor || "-"}</p>
                                    </button>
                                })}
                            </div>
                        </div>
                        <div className="self-stretch box-border flex flex-row items-start justify-start py-2 px-0 [row-gap:20px] max-w-full border-b-[0px] border-solid border-neutral-color-10">
                            <div className="md:w-[194px] w-[70px] flex flex-row items-center justify-start pt-1 px-[11px] pb-0.5 box-border">
                                <div className="md:text-[18px] text-[12px] font-actorPro font-bold text-[#333738] text-left">
                                    Size
                                </div>
                            </div>
                            <div className="flex-1 flex flex-row items-start justify-start pt-1 px-[11px] pb-0.5 box-border min-w-[171px] max-w-full grid md:grid-cols-6 grid-cols-3 gap-4">
                                <button
                                    className="rounded-[25px] bg-primary inline-flex py-[5px] px-[5px] h-[30px] gap-2 items-center justify-center">
                                    <p className="text-white font-actorPro font-normal leading-6 h-[20px] md:text-[10px] text-[8px] overflow-hidden">{ProductInfo?.currentSize || "-"}</p>
                                </button>
                                {ProductInfo?.size?.map((a) => {
                                    if (a?.currentSize != ProductInfo?.currentSize) return <button key={a?._id} onClick={() => navigate(`/ProductDetails/${a?._id}`)}
                                        className="rounded-[25px] border-2 border-primary inline-flex py-[5px] px-[5px] h-[30px] gap-2 items-center justify-center">
                                        <p className="text-primary font-actorPro  font-normal leading-6 h-[20px] md:text-[10px] text-[8px] overflow-hidden">{a?.currentSize || "-"}</p>
                                    </button>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}
export default withAuthContext(withCartContext(withWishlistContext(Details)))
