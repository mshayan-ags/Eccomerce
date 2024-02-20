import React, { useEffect } from "react"
import Footer from "../Components/Footer"
import Header from "../Components/Header/index"
import NoOrders from "../assests/NO Orders.png"
import Close from "../assests/Close.png"
import Dog from "../assests/Dog.png"
import RelatedProduct from "../Components/RelatedProduct"
import { withProductContext } from "../context/Product"
import { withWishlistContext } from "../context/Wishlist"
import { withCartContext } from "../context/Cart"
import { useNavigate } from "react-router-dom"
import { ImageCloud } from "../link"
import { getDiscountedUnitPrice } from "../utils/pricing"

function Wishlist({ AllProduct, shuffleArr, GetAllProduct, Wishlist, RemoveFromWishlist, AddToCart, isItemCart, RemoveItemCart }) {
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        GetAllProduct();
    }, [])

    return (
        <React.Fragment>
            <Header />
            <div className="w-full flex flex-col justify-center items-center">
                <div className="w-[90%] ">
                    <h2 className="text-center font-[400] text-[35px] leading-[36px] text-[#003459] font-abril mt-10 mb-10">Wish list</h2>

                    {Wishlist?.length > 0 ? (
                        <div className="w-full border-2 rounded-[12px]">
                            <div className="flex items-center justify-between p-5 border-b-2 mb-2">
                                <p className="w-[53%] text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080]">PRODUCT</p>
                                <p className=" w-[10%] text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080]">PRICE</p>
                                <p className="w-[10%] text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080]">STOCK STATUS</p>
                                <p className="w-[10%] text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080] opacity-0">SUBTOTAL</p>
                                <p className="w-[5%] text-[14px] font-[400] leading-[14px] font-Poppins text-[#808080] opacity-0">SUBTOTAL</p>
                            </div>
                            {Wishlist.map((product) => (
                                <div key={product?._id} className="flex items-center justify-between p-5 border-b-2 mb-2">
                                    <div className="w-[53%] flex items-center cursor-pointer" onClick={() => navigate(`/ProductDetails/${product?._id}`)}>
                                        <img
                                            src={product?.images?.[0]?.filename ? `${ImageCloud}/${product.images[0].filename}` : Dog}
                                            className="w-[60px] h-[60px] mr-[15px] object-cover"
                                            alt={product?.name}
                                        />
                                        <p className="text-[16px] leading-[24px] font-Poppins font-400 text-[#00171F]">{product?.name}</p>
                                    </div>
                                    <div className="w-[10%]">
                                        <p className=" text-[16px] leading-[24px] font-Poppins font-400 text-[#00171F]">
                                            ${getDiscountedUnitPrice(product?.price, product?.Discount).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-[10%]">
                                        <p className={`text-[14px] leading-[24px] font-Poppins font-400 py-[4px] rounded-[10px] text-center ${Number(product?.quantity) > 0 ? "text-[#1e8a30ff] bg-[#20B52633]" : "text-[#e31717] bg-[#e3171733]"}`}>
                                            {Number(product?.quantity) > 0 ? "In Stock" : "Out of Stock"}
                                        </p>
                                    </div>
                                    <div className="w-[10%]">
                                        <p
                                            className="cursor-pointer text-[16px] leading-[24px] font-Poppins font-400 text-[#fff] bg-[#1e8a30ff] py-[10px] px-[10px] text-center rounded-[25px]"
                                            onClick={() => {
                                                if (isItemCart(product?._id)) {
                                                    RemoveItemCart(product?._id);
                                                } else {
                                                    AddToCart({
                                                        id: product?._id,
                                                        quantity: 1,
                                                        price: product?.price,
                                                        discountedPrice: getDiscountedUnitPrice(product?.price, product?.Discount),
                                                        DiscountID: product?.Discount?._id || null,
                                                    });
                                                }
                                            }}
                                        >
                                            {isItemCart(product?._id) ? "Remove From Cart" : "Add To Cart"}
                                        </p>
                                    </div>
                                    <div className="w-[5%] flex justify-end cursor-pointer" onClick={() => RemoveFromWishlist(product?._id)}>
                                        <img src={Close} alt="Remove" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-[60px] border-2 rounded-[12px]">
                            <img src={NoOrders} className="w-[60%] md:w-[25%] mb-[3%]" alt="Empty wishlist" />
                            <h1 className="text-[18px] md:text-[24px] text-center text-primary font-bold">Your wishlist is empty</h1>
                            <p className="text-[10px] md:text-[12px] text-[#000000] text-center max-w-[400px] mt-2">
                                Browse our catalog and save the products you love here for later.
                            </p>
                            <button
                                className="my-[3%] bg-[#1e8a30ff] py-[10px] px-[30px] text-[#fff] rounded-[25px] text-[12px] md:text-[16px] font-[600]"
                                onClick={() => navigate("/Category")}
                            >
                                Browse Products
                            </button>
                        </div>
                    )}

                    <RelatedProduct
                        heading={"You Might Also Like"}
                        subHeading={"Hard to choose right toy products for your pets?"}
                        products={shuffleArr(AllProduct || []).slice(0, 8)}
                    />
                </div>
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </React.Fragment>
    )
}
export default withProductContext(withWishlistContext(withCartContext(Wishlist)))
