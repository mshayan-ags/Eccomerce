import React from "react";
import { ReactComponent as Facebook } from "../../assests/Facebook.svg";
import { ReactComponent as Youtube } from "../../assests/Youtube.svg";
import { ReactComponent as Twitter } from "../../assests/Twitter.svg";
import { ReactComponent as Instagram } from "../../assests/Instagram.svg";
import Logo from "../../assests/Logo.png";
import "./index.css"
import { useNavigate } from "react-router-dom";
function Footer({ }) {
	const navigate = useNavigate()
	return (
		<div className="overflow-hidden w-full flex flex-col items-center justify-center pt-[5%] px-[5%] md:px-[10%] rounded-tl-2xl rounded-tr-2xl rounded-bl-none rounded-br-none bg-gradient-to-r from-[#FCEED5] via-[#FCEED5] to-[#FFE7BA]">
			<div className="w-full rounded-2xl bg-primary flex p-4 md:p-8 items-start gap-4 md:gap-20 footer-letter-container">
				<p className="text-white font-actor text-[15px] text-center md:text-left md:text-2xl font-bold capitalize md:w-[40%] w-full">
					Register now so you don't miss our programs{" "}
				</p>
				<div className="rounded-xl bg-white flex flex-row w-full md:w-[60%] p-1 md:p-3 items-center gap-3">
					<input
						className="w-full rounded-md border border-white bg-white flex md:p-3.5 md:px-7 iems-center gap-2 flex-1 text-white font-actor text-[10px] md:text-sm font-normal leading-5"
						placeholder="Enter Your Email For Blogs ... "
						style={{
							borderColor: "#99A2A5",
							// outline: "none",
							border: "none",
							color: "black",
							paddingLeft: "5px"
						}}
					/>
					<button className="rounded-md bg-primary flex w-[40%] md:w-[30%] p-3 md:p-3.5 md:px-7 justify-center items-center gap-2 flex-shrink-0 text-white
					 flex justify-center align-center
					 font-actor text-[12px] md:text-base font-normal">
						Subcribe Now
					</button>
				</div>
			</div>

			<img src={Logo} className="md:hidden flex w-[140px] h-[70px] flex-shrink-0 mt-[10%]" />

			<div className="flex flex-col md:flex-row items-center justify-between overflow-hidden w-full mt-[5%] md:mt-[0%] pt-[5%]">
				<div className="flex flex-row items-center justify-between overflow-hidden w-[80%] md:w-[30%]">
					<p className="text-primary cursor-pointer md:text-black font-actor text-base font-bold" onClick={() => navigate("/")}>Home</p>
					<p className="text-primary cursor-pointer md:text-black font-actor text-base font-bold" onClick={() => navigate("/Category")}>Category </p>
					<p className="text-primary cursor-pointer md:text-black font-actor text-base font-bold" onClick={() => navigate("/#About")}>About </p>
					<p className="text-primary cursor-pointer md:text-black font-actor text-base font-bold" onClick={() => navigate("/Profile")}>My Profile </p>
				</div>
				<div className="flex flex-row items-center justify-between overflow-hidden pt-[5%] md:pt-[0%] w-[70%] md:w-[20%]">
					<div className="w-[24px] h-[24px]">
						<Facebook width={"24px"} height={"24px"} />
					</div>
					<div className="w-[24px] h-[24px]">
						<Youtube width={"24px"} height={"24px"} />
					</div>
					<div className="w-[24px] h-[24px]">
						<Twitter width={"24px"} height={"24px"} />
					</div>
					<div className="w-[24px] h-[24px]">
						<Instagram width={"24px"} height={"24px"} />
					</div>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-center justify-between overflow-hidden w-full my-[5%] md:my-[0%] md:pt-[5%] pb-[5%]">
				<p className="text-neutral-60 font-actor text-sm font-bold hidden md:flex">
					© {new Date().getFullYear()} . All rights reserved.
				</p>
				<img src={Logo} className="hidden md:flex w-[140px] h-[70px] flex-shrink-0" />
				<div className="flex flex-row items-center justify-between overflow-hidden  pt-[5%] md:pt-[0%] w-[60%] md:w-[20%]">
					<p className="text-neutral-60 font-actor text-sm font-bold cursor-pointer" onClick={() => navigate("/TermsOfUse")}>Terms of Service</p>
					<p className="text-neutral-60 font-actor text-sm font-bold cursor-pointer" onClick={() => navigate("/privacy-policy")}>Privacy Policy</p>
				</div>
				<p className="text-neutral-60 font-actor text-sm font-bold pt-[5%] flex md:hidden">
					© {new Date().getFullYear()} . All rights reserved.
				</p>
			</div>
		</div>
	);
}

export default Footer;
