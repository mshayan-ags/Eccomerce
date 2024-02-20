import React from "react";
import Comments from "../Components/Comments";
import Details from "../Components/Details";
import Footer from "../Components/Footer";
import Headers from "../Components/Header/index";
import New from "../Section/New";

function ProductDetailWithComments() {
  return (
    <React.Fragment>
      
      <Headers />
      <hr style={{ color: "#EDEDED" }} />
      <div className="w-full flex items-center justify-center mt-[70px]">
        <div className="w-[83%] flex flex-col items-end justify-start  box-border  tracking-[normal] ">
          <section className="self-stretch flex flex-row items-start justify-start py-0 px-[59px] box-border max-w-full lg:pl-[29px] lg:pr-[29px] lg:box-border">
            <div className="flex-1 flex flex-col items-start justify-start gap-[20px_0px] max-w-full">
              <Details />
              {/* <FrameComponent /> */}
              <Comments />
              <New
                isNew={false}
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
export default ProductDetailWithComments;
