import React, { useEffect } from 'react';
import Background from "../../assests/SaleBanner.png";
import Play from "../../assests/bi_play-circle.png";
import moment from 'moment';

const MidYearSale = () => {
  return (
    <div
      className="relative overflow-hidden bg-black text-white h-[60vh] w-full rounded-lg shadow-lg"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Sale Text */}
      <div className="relative z-10 flex flex-col justify-center h-full px-10">
        <div>
          <h1 className='font-roboto text-[35px] font-blacktext-left text-white p-0 m-0'>MID YEAR</h1>
          <h1 className="font-poppins text-[56px] font-black italic leading-[60px] text-left text-[#0EC8DD] p-0 m-0">SALE</h1>
          <h1 className='font-roboto text-[35px] font-blacktext-left text-white uppercase p-0 m-0'>is now live</h1>
        </div>
        <div className='flex md:flex-row-reverse flex-col w-full justify-between items-start md:items-end align-center'>
          <div className="hidden space-x-4 mt-4 md:flex">
            <div className="flex flex-col items-center justify-between px-6 py-3 bg-[#ffffff33] w-[146px] h-[151px] rounded-tl-[20px] rounded-br-[20px]">
              <div className="text-white font-Tomorrow text-[72px] font-bold leading-[86.4px] text-left">{moment(new Date("9-27-24") - new Date()).format("DD")}</div>
              <div className="font-space-grotesk text-[16px] font-normal leading-[20.42px] text-left">Days</div>
            </div>
            <div className="flex flex-col items-center justify-between px-6 py-3 bg-[#ffffff33] w-[146px] h-[151px] rounded-tl-[20px] rounded-br-[20px]">
              <div className="text-white font-Tomorrow text-[72px] font-bold leading-[86.4px] text-left">{moment(new Date("9-27-24") - new Date()).format("hh")}</div>
              <div className="font-space-grotesk text-[16px] font-normal leading-[20.42px] text-left">Hours</div>
            </div>
          </div>
          {/* Explore Now Button */}
          <button className="shadow-[3px_2px_31px_1px_#00000082] h-[60px] flex items-center justify-center px-4 py-2 mt-4 text-black bg-white rounded-full hover:bg-gray-200">
            <span className="font-roboto text-[17px] font-black leading-[19.92px] text-center mr-2">EXPLORE NOW</span>
            <img src={Play} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MidYearSale;
