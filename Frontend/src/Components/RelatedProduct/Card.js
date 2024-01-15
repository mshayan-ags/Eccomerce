import React from "react";
import Dog from "../../assests/Dog.png";
import Heart from "../../assests/heart.png";
import { useNavigate } from "react-router-dom";
import { ImageCloud } from "../../link";
import { getDiscountedUnitPrice } from "../../utils/pricing";

const Card = ({ data }) => {
	const navigate = useNavigate();
	if (!data) return null;

	return (
		<div onClick={() => navigate(`/ProductDetails/${data?._id}`)} className="inline-flex flex-col cursor-pointer p-[8px] flex-shrink-0 bg-neutral rounded-[12px] shadow-xl w-[280px] h-[391px]">
			<img src={data?.images?.[0]?.filename ? `${ImageCloud}/${data.images[0].filename}` : Dog} alt={data?.name || "Product"} className="w-[100%] h-[244px] flex-shrink-0 object-cover" />

			<div className="flex flex-col items-start p-[8px] pb-[20px] gap-0">
				<p className="text-neutral line-[24px] text-[#00171F] font-actorPro text-[16px] font-normal leading-[20px] w-full truncate">
					{data?.name}
				</p>

				<div className="flex flex-row justify-between mt-[5px] gap-1">
					<p className="text-gray font-actorPro text-[12px] font-normal leading-18 text-[#667479]">{data?.currentSize && data?.currentSize !== "-" ? data.currentSize : ""}</p>
				</div>
				<div className="flex flex-row justify-between w-full items-center">
					<p className="text-neutral font-actorPro text-base font-normal leading-33 h-[50px] text-[#00171F]">
						${getDiscountedUnitPrice(data?.price, data?.Discount).toFixed(2)}
					</p>
					<img
						src={Heart}
						alt="Wishlist"
						className="w-[22px] h-[22px] object-contain flex-shrink-0"
					/>
				</div>
			</div>
		</div>
	);
};

export default Card;
