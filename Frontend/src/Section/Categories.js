import React from "react";
import dogImage from "../assests/BG.png";
import Border from "../Components/Button/Border";
import { ReactComponent as Arrow } from "../assests/Chevron_Right_MD.svg";
import "./index.css";
import { ImageCloud } from "../link";
import { useNavigate } from "react-router-dom";

const DogFood = ({ data, i }) => {
  const navigate = useNavigate()
  return (
    <div data-aos="flip-up" data-aos-duration={300 * (i + 1)} data-aos-delay={300 * (i + 1)} className="rounded overflow-hidden cursor-pointer" onClick={() => navigate(`/Category/${data?.search}`)}>
      <img
        className="w-full h-48 object-cover rounded"
        src={data?.image}
        alt={data?.name}
      />
      <div className="my-[20px] font-open-sans text-[18px] font-bold leading-[24.51px] text-left text-[#002A48]">{data?.name}</div>
    </div>
  );
};

function Categories({ heading, subHeading, ProductsArr }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden w-full flex flex-col items-center justify-center mb-[20%] md:mb-[0%] rounded-[5px]">
      <div className="flex flex-row justify-between my-[10px] md:mt-[28px] md:mb-[28px] w-full">
        <div>
          <p className="text-black font-actorPro text-[16px] text-base font-normal ">
            {subHeading}
          </p>
          <h2 className="text-primary font-bold font-abril text-[22px] md:text-[34px] capitalize mt-[5px] ml-[15px]">
            {heading}
          </h2>
        </div>

      </div>
      <div className="w-full p-[10px] md:p-[20px] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {ProductsArr?.length
          ? ProductsArr?.map((a, i) => <DogFood key={a?._id || i} data={a} i={i} />)
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

export default Categories;
