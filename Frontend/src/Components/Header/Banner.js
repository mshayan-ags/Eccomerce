import { ReactComponent as Play } from "../../assests/Play_Circle.svg";
import Dog from "../../assests/Dog.png";
import Border from "../Button/Border";
import Filled from "../Button/Filled";
import { useNavigate } from "react-router-dom";
function Banner() {
	const navigate = useNavigate()
	return (
		<div className="overflow-hidden w-full flex flex-col items-center md:flex-row justify-center lg:pr-[5%] lg:pl-[8%] md:px-[2%] py-[5%] md:py-[0%]">
			<div className="overflow-hidden w-[100%] md:w-[50%] flex flex-col justify-center">
				<p className="text-primary font-adventPro text-5xl text-[60px] font-normal leading-[68px] capitalize font-[400] banner-heading ">
					Petty Pleasures
				</p>
				<p className="text-primary font-abril  text-[42px] font-normal leading-[60px] capitalize font-[400] banner-subheading">
					Elevate Your Pet's Lifestyle !
				</p>
				<p className="text-neutral-color-80 font-advent text-base font-bold leading-6 w-[90%] m-[32px] mr-[0px] ml-[0px] banner-description">
					Having a pet means you have more joy, a new friend, a happy person who will always be with
					you to have fun. We have 200+ different pets that can meet your needs!
				</p>
				<div className="flex flex-row">
					<Border
						text={"View Products"}
						Component={() => (
							<div className="w-5 h-5 rounded-full  border-2 border-primary flex items-center justify-center">
								<Play />
							</div>
						)}
						onClick={() => navigate("/Category")}
					/>

					<Filled text={"Join Our Community"}
						onClick={() => navigate("/SignUp")}
					/>
				</div>
			</div>
			<div className="overflow-visible w-[50%] h-[80vh] relative hidden md:block">
				<div
					className="w-full h-[78vh] rounded-[15%] overflow-visible absolute"
					style={{
						background: "#003459",
						transform: "rotate(5deg)",
						bottom: "-35%",
						right: "6%",

					}}
				></div>

				<div
					className="w-[100%] flex flex-col items-center content-center justify-center h-[80vh] rounded-[15%] absolute"
					style={{
						background: "#F7DBA7",
						transform: "rotate(20deg)",
						bottom: "-30%",
						right: "2%"
					}}
				>
					<img
						src={Dog}
						className="mr-[8%] ml-[8%] h-[80vh] w-[90%] absolute"
						style={{
							transform: "rotate(340deg)",
							bottom: "23%",
							right: "10%"
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default Banner;
