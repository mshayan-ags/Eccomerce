import React from "react";
import CustomCard from "../Components/Card";
import Border from "../Components/Button/Border";
import { ReactComponent as Arrow } from "../assests/Chevron_Right_MD.svg";
import "./index.css";
import { useNavigate } from "react-router-dom";
function New({ heading, subHeading, ProductsArr }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden w-full flex flex-col items-center justify-center md:py-[30px] mb-[5%]">
      <div className="flex flex-row justify-between  md:my-[28px] w-full">
        <div>
          <p className="text-black font-actorPro text-[16px] text-base font-normal leading-24 ">
            {subHeading}
          </p>
          <h2 className="text-primary font-bold font-abril text-[24px] md:text-[34px] capitalize mt-[5px]">
            {heading}
          </h2>
        </div>
        <div className="md:flex hidden">
          <Border
            text={"View more"}
            Component={() => (
              <div className="w-5 h-5 flex items-center justify-center">
                <Arrow />
              </div>
            )}
            onClick={() => navigate("/Category")}
          />
        </div>
      </div>
      <div className="w-full py-[20px] md:p-[20px] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {ProductsArr?.length
          ? ProductsArr?.map((a) => <CustomCard key={a?._id} data={a} />)
          : null}
      </div>
      <div className="md:hidden flex w-[80%] items-center justify-center">
        <button className="rounded-full border-2 border-primary inline-flex md:py-[10px] py-[5px] px-[28px] gap-2 items-center justify-center w-full" onClick={() => navigate("/Category")}>
          <p className="text-primary font-actorPro  font-normal leading-6 text-[10px]">
            {"View more"}
          </p>
        </button>
      </div>
    </div>
  );
}

export default New;
