// Menu.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withAuthContext } from '../../context/Auth';
import { withProductContext } from '../../context/Product';
import { ReactComponent as Arrow } from "../../assests/Chevron_Right_MD.svg";
import Image from "../../assests/Menu.avif";
import Image2 from "../../assests/dropdown-1.png";
import Image3 from "../../assests/dropdown-2.png";
import { FaDog } from "react-icons/fa6";
import { FaCat } from "react-icons/fa";
import { TbDogBowl } from "react-icons/tb";
import { GiHealthNormal } from "react-icons/gi";
import { LuToyBrick } from "react-icons/lu";
import { TbRibbonHealth } from "react-icons/tb";
import { FaPaw } from "react-icons/fa";

function capitalizeWords(str) {
  return str
    .split(/\s+/) // Split string into words by whitespace
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter and lowercase the rest
    )
    .join(' '); // Join words back into a single string
}

const Menu = ({ AllCategories }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate()
  const arr = [
    {
      name: "dog", searchValue: ["dog"], subItem: [
        "alternative", "wet", "freeze", "dry", "semi", "premium"
      ],
      Icon: <FaDog className="h-[30px] w-[25px] text-white" />,
      Img: Image
    },
    {
      name: "cat", searchValue: ["cat"], subItem: [
        "alternative", "wet", "freeze", "dry", "semi", "premium"
      ],
      Icon: <FaCat className="h-[30px] w-[25px] text-white" />,
      Img: Image2
    },
    {
      name: "treats", searchValue: ['treats', 'feadings'], subItem: [
        "alternative", "freeze", "semi", "cat", "dog", "wet"
      ],
      Icon: <TbDogBowl className="h-[30px] w-[25px] text-white" />,
      Img: Image3
    }, {
      name: "wellness", searchValue: [
        "health",
        "feadings",
        "litter",
        "ceramic",
        "collar",
        "travel",
        "shampoo"
      ], subItem: [
        "shampoo", "basics", "ceramic", "collar", "travel", "feeding",
      ],
      Icon: <TbRibbonHealth className="h-[30px] w-[25px] text-white" />,
      Img: Image3
    }, {
      name: "toys", searchValue: [
        "durable",
        "tie-outs",
        "litter",
        "retractable",
        "stainless",
        "toys",
        "collar",
        "lead"
      ]
      , subItem: [
        "durable", "retractable", "stainless", "collar", "lead", "tie-outs"
      ],
      Icon: <FaPaw className="h-[30px] w-[25px] text-white" />,
      Img: Image3
    }]

  let closeTimeout;
  const handleMouseEnter = (index) => {
    clearTimeout(closeTimeout); // Clear any existing timeout
    setHoveredItem(index); // Set hovered item
  };

  const handleMouseLeave = () => {
    // Set a delay to close the menu
    closeTimeout = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
  };

  return (
    <div className="relative flex gap-8 w-full justify-center align-center py-[10px] bg-primary hidden md:flex">
      {arr.map((item, index) => (
        <div
          key={index}
          className="relative group flex flex-row gap-4 justify-center align-center items-center cursor-pointer"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          data-aos="fade-left-down"
          data-aos-duration={300 * (index + 1)}
          data-aos-delay={500 * (index + 1)}
        >
          <div className="h-[20px] w-[20px] text-white"> {item?.Icon}</div>
          <button className="text-white font-semibold">{capitalizeWords(item?.name)}</button>
        </div>
      ))}
      {arr.map((item, index) =>
        (hoveredItem === index) &&
        <div key={index}>
          <div className='absolute left-0 top-full h-[100vh] w-full z-[10000] opacity-95 bg-primary'
            // onMouseEnter={() => clearTimeout(closeTimeout)} // Keep menu open
            onMouseEnter={handleMouseLeave} // Start close timer
          />

          <div
            className="z-[10000000] flex flex-row items-stretch absolute left-0 top-full bg-white text-gray-800 shadow-md rounded w-full h-[65vh] overflow-hidden"
            onMouseEnter={() => clearTimeout(closeTimeout)} // Keep menu open
            onMouseLeave={handleMouseLeave} // Start close timer
            data-aos="fade-down" data-aos-duration="1500" data-aos-delay="100"
          >
            <div className='w-full bg-white grid lg:grid-cols-3 md:grid-cols-3 xs:grid-cols-1 grid-cols-1  gap-4 my-[2%] mx-[2%] overflow-y-visible'>
              {item?.subItem.map((category) => (
                <div key={category} className='flex flex-col align-center px-[5%]'>
                  <h1 className='uppercase font-roboto text-primary text-[20px] text-left font-[900] mb-2'>{`${capitalizeWords(item?.name)} ${category}`}</h1>
                  {AllCategories?.filter((a) =>
                    a?.name?.includes(category)
                    && item?.searchValue?.some((value) => a?.name?.toLowerCase()?.includes(value.toLowerCase()))
                  ).slice(0, 4)?.map((a) =>
                    <div key={a?._id} className='w-full flex flex-row items-center justify-between align-center border-b-2 py-2'>
                      <p onClick={() => {
                        navigate(`/Category/${a?._id}`)
                        handleMouseLeave()
                        setTimeout(() => {
                          window.scrollTo({
                            top: 300,
                            behavior: 'smooth'
                          })
                        }, 500);
                      }} className="relative font-actor cursor-pointer leading-[20px] text-left text-xs w-[70%] font-[600] hover:text-primary">{capitalizeWords(a?.name?.replace(item?.name, "")?.replace('food', "") || "")}</p>
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Arrow />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <img
              src={item?.Img || Image}
              className="xs:hidden md:block hidden w-[30%] h-full object-cover"
            />
          </div>
        </div>
      )
      }
    </div >
  );
};

export default withAuthContext(withProductContext(Menu));
