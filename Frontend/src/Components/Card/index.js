import React, { useEffect, useState } from "react";
import Dog from "../../assests/Dog.png";
import { useNavigate } from "react-router-dom";
import { withCartContext } from "../../context/Cart";
import { withWishlistContext } from "../../context/Wishlist";
import { withAuthContext } from "../../context/Auth";
import { ImageCloud } from "../../link";
import { getDiscountedUnitPrice } from "../../utils/pricing";
import { BsFillBasket3Fill } from "react-icons/bs";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Minus from "../../assests/Minus.png";
import Plus from "../../assests/Plus.png";
import swal from "sweetalert";

const CustomCard = ({ data, AddToCart, isItemCart, RemoveItemCart, UpdateItemCart, getItemCart, isInWishlist, ToggleWishlist, Token }) => {
	const navigate = useNavigate()
	const [quantity, setQuantity] = useState(1)

	const handleWishlistClick = () => {
		if (!Token && !localStorage.getItem("token")) {
			swal({
				text: "Please Login To Save Items To Your Wishlist",
				button: { text: "Ok", closeModal: true },
				icon: "warning",
			}).then(() => navigate("/SignIn"));
			return;
		}
		ToggleWishlist(data?._id);
	};
	useEffect(() => {
		if (isItemCart(data?._id)) {
			UpdateItemCart(data?._id, quantity)
		}

	}, [quantity])

	return (
		<div data-aos="zoom-in-up" data-aos-delay="300" data-aos-duration="3000" className="relative inline-flex flex-col p-[8px] flex-shrink-0 bg-neutral rounded-[25px] shadow-xl w-[100%] h-[100%]">
			<div
				onClick={() => {
					navigate(`/ProductDetails/${data?._id}`)
				}}>
				<div className={`md:w-[100%] h-[100px] md:h-[200px] flex-shrink-0 flex align-center justify-center items-center`}>
					<img src={data?.images?.[0]?.filename ? `${ImageCloud}/${data?.images?.[0]?.filename}` : Dog} className="rounded-[25px] w-[150px] h-[100px]" alt="Product Image" />
				</div>

				<div className="flex flex-col items-start p-[8px] pb-[10px] md:pb-[20px] gap-0">
					<p className="text-neutral text-[#00171F] font-actorPro md:text-[16px] text-[8px] font-bold w-full overflow-hidden md:h-[50px]">
						{/* {data?.ProductCode}- */}
						{data?.name}
					</p>

					<div className="flex flex-col md:flex-row justify-start md:justify-between my-[10px] md:mt-[5px] md:gap-1">
						<div className="flex flex-row justify-start md:justify-center gap-1">
							<p className="text-gray font-actorPro md:text-[12px] text-[8px] font-bold leading-18 text-[#667479]">Quantity:</p>
							<p className="text-gray font-actorPro md:text-[12px] text-[8px] font-normal leading-18 text-[#667479]">{data?.quantity}</p>
						</div>
						{data?.currentFlavor?.toUpperCase() && <div className="flex flex-row justify-start md:justify-center gap-1"> <p className="text-gray font-actorPro md:text-[12px] text-[8px] font-bold leading-18 text-[#667479]">Flavor:</p>
							<p className="text-gray font-actorPro md:text-[12px] text-[8px] font-normal leading-18 text-[#667479]">{data?.currentFlavor?.toUpperCase()}</p>
						</div>}
					</div>
					<div className="flex flex-row justify-between w-full">
						{data?.Discount?._id ? (
							<p className="text-neutral font-actorPro text-[15px] md:text-[25px] font-normal md:h-[50px] text-[#1e8a30ff]">
								<del className="text-[#00171F] md:text-[20px] text-[10px] mr-[5px] truncate">${Number(data?.price)?.toFixed(2)}</del>
								${getDiscountedUnitPrice(data?.price, data?.Discount).toFixed(2)}
							</p>
						) : (
							<p className="text-neutral font-actorPro md:text-[30px] text-[15px] font-normal md:h-[50px] text-[#1e8a30ff]">
								${Number(data?.price)?.toFixed(2)}
							</p>
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-row align-center justify-evenly items-center gap-2 md:gap-4 mb-[10px]">
				<div
					onClick={handleWishlistClick}
					className="flex md:w-[44px] md:h-[34px] w-[45px] h-[30px] flex items-center justify-center align-center shadow-lg rounded-full bg-[#deded9] cursor-pointer">
					{isInWishlist(data?._id) ?
						<FaHeart className="md:w-[18px] md:h-[18px] w-[12px] h-[12px] text-primary flex-shrink-0" />
						: <FaRegHeart className="md:w-[18px] md:h-[18px] w-[12px] h-[12px] text-[#667479] flex-shrink-0" />
					}
				</div>
				<div className="border-[2px] gap-2 md:gap-6 md:h-12 rounded-[25px] flex flex-row items-center justify-center  md:px-[26px] px-[10px]  box-border whitespace-nowrap">
					<img src={Minus} className="md:h-[34px] md:w-[34px] h-[20px] w-[20px]" onClick={() => {
						const a = getItemCart(data?._id)?.quantity || quantity;
						setQuantity(a > 1 ? a - 1 : 1);
					}} />
					<div className=" md:text-[16px] text-[10px] font[400] md:leading-[24px] font-actorPro text-[#1A1A1A] text-left">
						{getItemCart(data?._id)?.quantity || quantity}
					</div>
					<img src={Plus} className="md:h-[34px] md:w-[34px] h-[20px] w-[20px]" onClick={() => {
						const a = getItemCart(data?._id)?.quantity || quantity;
						setQuantity(a + 1);
					}} />
				</div>
				<div
					onClick={() => {
						if (isItemCart(data?._id)) {
							RemoveItemCart(data?._id)
						} else {
							AddToCart({
								id: data?._id,
								quantity: quantity,
								price: data?.price,
								discountedPrice: getDiscountedUnitPrice(data?.price, data?.Discount),
								DiscountID: data?.Discount?._id || null
							})
						}
					}}
					className="md:w-[44px] md:h-[34px] w-[45px] h-[30px] flex items-center justify-center align-center shadow-lg rounded-full bg-primary">
					{isItemCart(data?._id) ?
						<IoIosRemoveCircleOutline className="md:w-[18px] md:h-[18px] w-[12px] h-[12px] object-contain text-white" />
						: <BsFillBasket3Fill className="md:w-[18px] md:h-[18px] w-[12px] h-[12px] object-contain text-white"
						/>
					}
				</div>

			</div>
		</div>
	);
};

export default withAuthContext(withCartContext(withWishlistContext(CustomCard)));
