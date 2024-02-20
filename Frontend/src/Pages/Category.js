import React, { useEffect, useState } from "react";
import BreadsCrumbs from "../Components/BreadCrumbs";
import CustomCard from "../Components/Card";
import Filter from "../Components/Filter";
import Footer from "../Components/Footer";
import Headers from "../Components/Header/index";
import { withProductContext } from "../context/Product";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Arrow } from "../assests/Chevron_Right_MD.svg";
import Border from "../Components/Button/Border";
import Filled from "../Components/Button/Filled";
import { BiMenuAltRight } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import DogFood from "../assests/ErrorPayment.avif"
import { FaFilterCircleXmark } from "react-icons/fa6";

const PAGE_SIZE = 9;

const initialValue = {
    Category: null,
    Breed: null,
    Brand: null,
    Color: null,
    MinPrice: null,
    MaxPrice: null,
    Weight: null,
}
function Category({ AllProduct, GetAllProduct }) {
    const { name } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
        GetAllProduct()
    }, [])

    const [FilterValue, setFilterValue] = useState(initialValue)
    const [Products, setProducts] = useState([]);
    const [From, setFrom] = useState(0);
    const [Open, setOpen] = useState(false);

    useEffect(() => {
        if (!AllProduct || !FilterValue) { setProducts((AllProduct)); return; } // Handle null or undefined values

        let filteredProducts = [...(AllProduct)]; // Copy all products initially
        if (name) {
            filteredProducts = filteredProducts.filter(product => {
                if (product.name?.toLowerCase()?.includes(name?.toLowerCase())) {
                    return product
                }

                if (product.category?.toLowerCase() == name) {
                    return product
                }
            });
        }
        if (FilterValue.Category) {
            filteredProducts = filteredProducts.filter(product => product.category?.toLowerCase() == FilterValue.Category?.toLowerCase());
        }
        if (FilterValue.Brand) {
            filteredProducts = filteredProducts.filter(product => product.brand?.toLowerCase() == FilterValue.Brand?.toLowerCase());
        }
        if (FilterValue.Breed) {
            filteredProducts = filteredProducts.filter(product => product.currentFlavor?.toLowerCase() == FilterValue.Breed?.toLowerCase());
        }
        if (FilterValue.Weight) {
            filteredProducts = filteredProducts.filter(product => product.currentSize?.toLowerCase() == FilterValue.Weight?.toLowerCase());
        }
        if (FilterValue.Color) {
            filteredProducts = filteredProducts.filter(product => product.currentColor?.toLowerCase() == FilterValue.Color?.toLowerCase());
        }
        if (FilterValue.MinPrice) {
            filteredProducts = filteredProducts.filter(product => product.price >= FilterValue.MinPrice);
        }
        if (FilterValue.MaxPrice) {
            filteredProducts = filteredProducts.filter(product => product.price <= FilterValue.MaxPrice);
        }

        setProducts(filteredProducts);
        setFrom(0)
    }, [AllProduct, FilterValue, name]);

    return (
        <React.Fragment>
            <Headers />
            <hr style={{ color: "#EDEDED" }} />
            <div className="flex item-center justify-center mt-[10px] md:mt-[6rem]">
                <div className="md:w-[83%] w-full">
                    <div className="mb-[10px] px-4 gap-2 flex flex-col">
                        <BreadsCrumbs />
                   </div>
                    <div className="w-full mt-[28px] mb-[50px] flex md:flex-row flex-col justify-center">
                        <div className={`${Open ? "fixed top-[0px] bottom-0 left-0 z-[1000000000000000] overflow-y-scroll bg-white w-[80%]" : 'hidden'} md:flex md:w-[25%]  w-[100%] shadow-xl p-4 md:rounded-[20px] border-2 h-full align-center justify-center flex-col`}>
                            <div className="flex flex-row w-full justify-between mb-[20px] items-center">
                                <h3 className="text-[#003459] text-[20px] md:text-[30px] font-[700]">Filters</h3>
                                <FaFilterCircleXmark onClick={() => {
                                    setFilterValue(initialValue)
                                }}
                                    className="text-primary text-[20px] md:text-[25px] "
                                />

                                <BiMenuAltRight
                                    onClick={() => {
                                        setOpen(!Open)
                                    }}
                                    className="md:hidden text-primary text-[20px]"
                                />
                            </div>
                            <Filter setFilterValue={(e) => {
                                setFilterValue(e)
                                setOpen(false)
                            }} />
                        </div>
                        <div className={`${Open ? "fixed top-[0px] bottom-0 left-0 z-[1000] overflow-y-scroll bg-[#0f0f0f] w-full opacity-70" : 'hidden'} md:flex `} onClick={() => {
                            setOpen(!Open)
                        }} />
                        <div className="md:w-[70%] md:ml-[2%] mt-[10%] md:mt-0 w-[100%]">
                            <div className="flex md:flex-row flex-col gap-10 justify-between mb-[28px] w-full pl-[15px] pr-[15px]">
                                <div className="flex items-center gap-2">
                                    <div className={"w-[20px] h-[20px] flex md:hidden"}>
                                        <FaFilter
                                            onClick={() => {
                                                setOpen(!Open)
                                            }}
                                            className="text-primary text-[20px]"
                                        />
                                    </div>
                                    <h2 className="text-primary font-[800] font-actorPro text-[20px] md:text-[30px] capitalize">
                                        {"Discounted Items"}
                                    </h2>
                                    <p className="text-[#667479] font-actorPro text-[10px] md:text-[14px]  font-normal text-center ml-[10px]">{Products?.length} {" results"}</p>
                                </div>
                                {Products?.length > 0 && (
                                    <div className="flex flex-row align-center justify-center content-center gap-4">
                                        <button
                                            onClick={() => {
                                                setFrom(From > 0 ? From - PAGE_SIZE : 0);
                                                window.scrollTo({
                                                    top: 299,
                                                    behavior: 'smooth' // This makes the scrolling smooth
                                                });
                                            }}
                                            className="w-[120px] rounded-full border-2 border-primary inline-flex py-[10px] px-[28px] gap-2 items-center justify-center mr-[25px]">
                                            <div className="w-5 h-5 flex items-center justify-center rotate-180">
                                                <Arrow />
                                            </div>
                                            <p className="text-primary font-actorPro text-[10px] md:text-[14px]">Previous</p>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFrom(From < Products?.length ? From + PAGE_SIZE : 0);
                                                window.scrollTo({
                                                    top: 299,
                                                    behavior: 'smooth' // This makes the scrolling smooth
                                                });
                                            }}
                                            className="w-[120px] rounded-full border-2 border-primary inline-flex md:py-[10px] md:px-[28px] gap-2 items-center justify-center mr-[25px]">
                                            <p className="text-primary font-actorPro text-[10px] md:text-[14px]">Next</p>
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <Arrow />
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex-wrap md:p-[20px] p-[10px] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                {Products?.length > 0 ? Products.map((a, i) => {
                                    if (i >= From && i < From + PAGE_SIZE) return (
                                        <CustomCard key={a?._id} data={a} />
                                    )
                                }) : (
                                    <div className="h-[80vh] w-full flex flex-col justify-center align-center items-center col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 ">
                                        <img src={DogFood} className="w-[80%] md:w-[40%] h-[50vh] my-[2%]" />
                                        <h1 className="text-[20px] text-center md:text-[30px] text-primary">Oops! No products match your search. 🐾</h1>
                                        <p className="text-[10px] md:text-[12px] text-[#000000] text-center">
                                            "Oops! It seems there are no products available that match your search criteria. Don’t worry, though! Feel free to explore other options or try adjusting your search to find what you’re looking for. We’re here to help you discover the perfect product! 🐾"
                                        </p>
                                        <button className="bg-[#1e8a30ff] py-[6px] md:py-[16px] w-[40%] md:w-[20%] text-[#fff] mt-[15px] rounded-[25px] text-[12px] md:text-[16px] font-[600]" onClick={() => {
                                            setFilterValue(initialValue)
                                            navigate("/Category")
                                        }}>{"Shop More"}</button>
                                    </div>
                                )}
                            </div>
                            {Products?.length > 0 && (
                                <div className="w-full p-[20px] md:flex flex-row grid grid-cols-5 md:grid-cols-3 align-center justify-center content-center gap-4">
                                    <button
                                        onClick={() => {
                                            setFrom(From > 0 ? From - PAGE_SIZE : 0);
                                            window.scrollTo({
                                                top: 299,
                                                behavior: 'smooth' // This makes the scrolling smooth
                                            });
                                        }}
                                        className="md:w-[120px] rounded-full border-2 border-primary inline-flex py-[10px] px-[28px] gap-2 items-center justify-center mr-[25px]">
                                        <div className="w-5 h-5 flex items-center justify-center rotate-180">
                                            <Arrow />
                                        </div>
                                        <p className="text-primary font-actorPro hidden md:flex text-[10px] md:text-[14px]">Previous</p>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFrom(From);
                                            window.scrollTo({
                                                top: 299,
                                                behavior: 'smooth' // This makes the scrolling smooth
                                            });
                                        }}
                                        className="rounded-full border-2 bg-primary inline-flex py-[10px] px-[28px] gap-2 items-center justify-center mr-[25px]">
                                        <p className="text-white font-actorPro  text-[10px] md:text-[14px]">{Math.ceil((From / PAGE_SIZE) + 1)}</p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFrom(From < Products?.length ? From + PAGE_SIZE : 0);
                                            window.scrollTo({
                                                top: 299,
                                                behavior: 'smooth' // This makes the scrolling smooth
                                            });
                                        }}
                                        className="hidden md:flex rounded-full border-2 border-primary inline-flex py-[10px] px-[28px] gap-2 items-center justify-center mr-[25px]">
                                        <p className="text-primary font-actorPro  text-[10px] md:text-[14px]">{Math.ceil((From / PAGE_SIZE) + 2) < Math.ceil(Products.length / PAGE_SIZE) ? Math.ceil((From / PAGE_SIZE) + 2) : 2}</p>
                                    </button>

                                    <button className="rounded-full border-2 border-primary inline-flex py-[10px] px-[28px] gap-2 items-center justify-center mr-[25px]">
                                        <p className="text-primary font-actorPro  text-[10px] md:text-[14px]">...</p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFrom(From < Products?.length ? Products?.length - PAGE_SIZE : 0);
                                            window.scrollTo({
                                                top: 299,
                                                behavior: 'smooth' // This makes the scrolling smooth
                                            });
                                        }}
                                        className="rounded-full border-2 border-primary inline-flex py-[10px] px-[28px] gap-2 items-center justify-center mr-[25px]">
                                        <p className="text-primary font-actorPro  text-[10px] md:text-[14px]">{Math.ceil(Products.length / PAGE_SIZE) > Math.ceil((From + PAGE_SIZE) / PAGE_SIZE) ? Math.ceil(Products.length / PAGE_SIZE) : 1}</p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setFrom(From < Products?.length ? From + PAGE_SIZE : 0);
                                            window.scrollTo({
                                                top: 299,
                                                behavior: 'smooth' // This makes the scrolling smooth
                                            });
                                        }}
                                        className="md:w-[120px] rounded-full border-2 border-primary inline-flex py-[10px] px-[28px] gap-2 items-center justify-center mr-[25px]">
                                        <p className="text-primary font-actorPro  hidden md:flex text-[10px] md:text-[14px]">Next</p>
                                        <div className="w-5 h-5 flex items-center justify-center">
                                            <Arrow />
                                        </div>
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </React.Fragment >
    )
}
export default withProductContext(Category)