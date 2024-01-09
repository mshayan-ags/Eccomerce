import React from "react";
import Dog from "../../assests/Dog.png";
import { useNavigate } from "react-router-dom";
import { withCartContext } from "../../context/Cart";
import { ImageCloud } from "../../link";
import { useProductInfo } from "../../hooks/useProductInfo";
import { getDiscountedUnitPrice } from "../../utils/pricing";

const ListCard = ({ id, getItemCart }) => {
	const navigate = useNavigate()

	const { ProductInfo } = useProductInfo(id);

	const quantity = getItemCart(id)?.quantity
	return (
		<div data-aos="zoom-in-down" data-aos-duration="3000" data-aos-delay="300" className="flex items-center justify-between mb-[20px]">
			<div className="flex items-center max-w-[80%]">
				<img onClick={() => {
					navigate(`/ProductDetails/${ProductInfo?._id}`)
				}} src={ProductInfo?.images?.[0]?.filename ? `${ImageCloud}/${ProductInfo?.images?.[0]?.filename}` : Dog} alt="" className="w-[60px] h-[60px] mr-[10px]" />
				<p className="text-[10px] md:text-[14px] leading-[21px] font-[600] font-actorPro text-[##00171F]">{ProductInfo?.name} x {quantity}</p>
			</div>
			<div className="flex flex-row gap-4 items-center">
				{ProductInfo?.Discount?._id ? (
					<p className="text-center text-[20px] leading-[24px] font-Poppins font-bold text-[#1e8a30ff]">
						<del className="text-[#00171F] text-[13px] mr-[5px] truncate">${Number(ProductInfo?.price * quantity)?.toFixed(2)}</del>
						${(getDiscountedUnitPrice(ProductInfo?.price, ProductInfo?.Discount) * quantity).toFixed(2)}
					</p>
				) : (
					<p className="text-center text-[20px] leading-[24px] font-Poppins font-bold text-[#1e8a30ff]">
						${Number(ProductInfo?.price * quantity)?.toFixed(2)}
					</p>
				)}
			</div>
		</div>
	);
};

export default withCartContext(ListCard);
