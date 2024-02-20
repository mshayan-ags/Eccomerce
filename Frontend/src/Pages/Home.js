import New from "../Section/New";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { withProductContext } from "../context/Product";
import { useEffect } from "react";
import ShopBanner1 from "../assests/ShopBanner.png"
import ShopBanner2 from "../assests/Shop2.png"
import ShopBanner3 from "../assests/Shop3.png"
import ShopArrow from "../assests/ShopArrow.png"
import Categories from "../Section/Categories";


import CategoryImg1 from "../assests/Category1.png"
import CategoryImg2 from "../assests/Category4.png"
import CategoryImg3 from "../assests/Category3.png"
import CategoryImg4 from "../assests/Category2.png"
import { useNavigate } from "react-router-dom";

function Home({ shuffleArr, AllProduct, GetAllProduct }) {
	const navigate = useNavigate()
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth' // This makes the scrolling smooth
		});
		GetAllProduct();
	}, [])
	return (
		<div>
			<Header />
			<div className="px-[5%] mb-[5%]">
				<New
					heading={"New Arrivals"}
					ProductsArr={shuffleArr(AllProduct).sort(() => Math.random() - 0.1).slice(0, 4)}
				/>
			</div>
			<Footer />
		</div>
	);
}

export default withProductContext(Home);
