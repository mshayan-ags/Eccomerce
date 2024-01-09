import React from 'react';
import { withCartContext } from '../../context/Cart';
import { useNavigate } from 'react-router-dom';
import AddressPic from "../../assests/AddressPic.png"
import { MdEditLocationAlt } from "react-icons/md";
import { RiUserLocationFill } from "react-icons/ri";
import { MdHome } from "react-icons/md";

const Card = ({ id, address, country, city, state, phone_number, name, setAddress, Select }) => {
  const navigate = useNavigate();
  return (
    <div data-aos="zoom-in" data-aos-duration="3000" data-aos-delay="300" className="w-full rounded flex flex-row items-center px-4  overflow-hidden shadow-lg bg-white border border-gray-200">
      <div className='flex flex-col bg-primary rounded-[5px] gap-2 items-center justify-center'>
        <MdHome className='m-2 text-white w-[40px] h-[40px]' />
        {Select && <button
          onClick={
            () => {
              console.log("Clicked")
              setAddress(id);
              navigate("/Payment");
            }}
          className="flex bg-[#5aabfa] p-1 px-3 text-[#fff] rounded-[5px] text-[12px] text-center font-[600]">
          Select
        </button>}
      </div>
      <div className="px-4 py-3">
        <h2 className="text-[15px] md:text-[18px] font-bold font-Poppins mb-0 md:mb-2 text-blue-900">{name}</h2>
        <p className="flex text-[12px] text-gray-800">{phone_number}</p>

        <p className="flex text-[10px] py-3 text-gray-800">{address + " " + city + " " + state + " " + country + " "}</p>

      </div>
    </div >
  );
};

export default withCartContext(Card);
