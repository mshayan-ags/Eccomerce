import React, { useEffect, useState } from "react";
import MainImage from "../../assests/DetailImage.png";
import Minus from "../../assests/Minus.png";
import Plus from "../../assests/Plus.png";
import { ImageCloud } from "../../link";
import { withCartContext } from "../../context/Cart";
import Close from "../../assests/Close.png"
import { useProductInfo } from "../../hooks/useProductInfo";
import { getDiscountedUnitPrice } from "../../utils/pricing";

function CartCard({ id, isItemCart, RemoveItemCart, UpdateItemCart, getItemCart }) {

	const [quantity, setQuantity] = useState(1)

	const { ProductInfo } = useProductInfo(id);

	useEffect(() => {
		if (isItemCart(ProductInfo?._id)) {
			UpdateItemCart(ProductInfo?._id, quantity)
		}
	}, [quantity])

	return (
		<React.Fragment>
			<div data-aos="fade-left" data-aos-duration="3000" data-aos-delay="300" className="md:flex md:flex-row grid grid-cols-8 gap-2 items-center justify-between p-2 py-[5%] md:p-5 border-b-2 mb-2">
				<div className="md:w-[43%] w-[100%] col-span-5 flex items-center">
					<img
						src={ProductInfo?.images?.[0]?.filename ? `${ImageCloud}/${ProductInfo?.images?.[0]?.filename}` : MainImage}
						className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] mr-[10px]"
					/>
					<p className="md:text-[14px] text-[12px] text-[#00171F] font-actor font-bold">{ProductInfo?.name}</p>
				</div>
				<div className="hidden md:flex md:w-[10%] w-[100%]">
					{ProductInfo?.Discount?._id ? (
						<p className="text-center md:text-[14px] text-[12px] font-Poppins font-bold text-[#1e8a30ff]">
							<del className="text-[#e31717] text-[12px] mr-[5px] truncate">${Number(ProductInfo?.price)?.toFixed(2)}</del>
							${getDiscountedUnitPrice(ProductInfo?.price, ProductInfo?.Discount).toFixed(2)}
						</p>
					) : (
						<p className="text-center md:text-[14px] text-[12px] font-Poppins font-bold text-[#1e8a30ff]">
							${Number(ProductInfo?.price)?.toFixed(2)}
						</p>
					)}
				</div>
				<div className="md:w-[20%]">
					<div className="border-[2px] gap-1 md:gap-8 py-[1%] h-10 md:h-12 rounded-[25px] flex flex-col-reverse md:flex-row items-center justify-center md:px-[26px]  box-border whitespace-nowrap">
						<img src={Minus} className="md:h-[34px] md:w-[34px] h-[20px] w-[20px]" onClick={() => {
							const a = getItemCart(id)?.quantity || quantity;
							setQuantity(a > 1 ? a - 1 : 1);
						}} />
						<div className=" md:text-[16px] text-[10px] font-bold font-actorPro text-[#1A1A1A] text-left">
							{getItemCart(id)?.quantity || quantity}
						</div>
						<img src={Plus} className="md:h-[34px] md:w-[34px] h-[20px] w-[20px]" onClick={() => {
							const a = getItemCart(id)?.quantity || quantity;
							setQuantity(a + 1);
						}} />
					</div>
				</div>
				<div className="md:w-[10%] w-[100%]">
					{ProductInfo?.Discount?._id ? (
						<p className="text-center md:text-[18px] text-[14px] font-bold text-[#1e8a30ff]">
							<del className="text-[#e31717] text-[13px] mr-[5px] truncate">${Number(ProductInfo?.price * quantity)?.toFixed(2)}</del>
							${(getDiscountedUnitPrice(ProductInfo?.price, ProductInfo?.Discount) * quantity).toFixed(2)}
						</p>
					) : (
						<p className="text-center md:text-[18px] text-[14px] font-bold text-[#1e8a30ff]">
							${Number(ProductInfo?.price * quantity)?.toFixed(2)}
						</p>
					)}
				</div>
				<div className="md:w-[5%] w-[100%] flex justify-end">
					<img onClick={() => {
						if (isItemCart(ProductInfo?._id)) {
							RemoveItemCart(ProductInfo?._id)
						}
					}} src={Close} />
				</div>
			</div>
		</React.Fragment>
	)
}
export default withCartContext(CartCard)