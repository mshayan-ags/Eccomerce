import React, { useEffect } from "react";
import Comments from "../Components/Comments";
import Details from "../Components/Details";
import Footer from "../Components/Footer";
import Headers from "../Components/Header/index";
import New from "../Section/New";
import { withProductContext } from "../context/Product";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetails({ AllProduct, shuffleArr }) {
  let navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scrolling smooth
    });

    // Pressing the browser's back button from a product page returns to the
    // category listing rather than an arbitrary prior page.
    const handlePopState = () => navigate("/Category");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate])
  return (
    <React.Fragment>
      
      <Headers />
      <hr style={{ color: "#EDEDED" }} />
      <div className="w-full flex items-center justify-center my-[7%]">
        <div className="w-full md:w-[93%] flex flex-col items-end justify-start box-border  tracking-[normal] ">
          <section className="self-stretch flex flex-row items-start justify-start py-0 px-6">
            <div className="flex-1 flex flex-col items-start justify-start gap-[20px_0px] max-w-full">
              <Details />
              <Comments productId={id} />
              <New
                ProductsArr={shuffleArr(AllProduct).sort(() => Math.random() - 0.1).slice(
                  0,
                  4
                )}
                heading={"View Related Products"}
                subHeading={"Whats new?"}
              />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
export default withProductContext(ProductDetails);
