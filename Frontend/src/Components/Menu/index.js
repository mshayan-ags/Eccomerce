import React, { useState } from 'react'
import { withProductContext } from '../../context/Product'
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Arrow } from "../../assests/Chevron_Right_MD.svg";
import { withAuthContext } from '../../context/Auth';
import { FaCat, FaDog, FaPaw } from 'react-icons/fa';
import { TbDogBowl, TbRibbonHealth } from 'react-icons/tb';

function capitalizeWords(str) {
  return str
    .split(/\s+/) // Split string into words by whitespace
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter and lowercase the rest
    )
    .join(' '); // Join words back into a single string
}

function Menu({ AllCategories, MenuOpen, setMenuOpen }) {
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  return (
    <div className='w-full h-auto bg-white grid lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-1 grid-cols-1  gap-2 my-[4%] mb-[5%] overflow-y-scroll'>
      {[{
        name: "cat food",
        Icon: <FaCat />,
      }, {
        name: "dog food",
        Icon: <FaDog />,
      }, {
        name: "dog fashion",
        Icon: <TbRibbonHealth />,
      }, {
        name: "treats",
        Icon: <TbDogBowl />,
      }, {
        name: "semi moist",
        Icon: <FaPaw />,
      }].map((category) => (
        <div className='flex flex-col align-center px-[5%]'>
          <div className='w-full flex flex-row items-center justify-between align-center border-b-2 border-b-primary py-3' onClick={() => {
            setActive(category.name)
          }}>
            <div className='flex flex-row items-center justify-center align-center gap-2'>
              <div className="h-[20px] w-[20px] text-primary"> {category?.Icon}</div>
              <h1 className='uppercase font-roboto text-primary text-[15px] text-left font-[900]'>{category.name}</h1>
            </div>
            <div className={`w-5 h-5 flex items-center justify-center ${category.name == active ? "-rotate-90" : "rotate-90"}`}>
              <Arrow />
            </div>
          </div>
          {AllCategories?.filter((a) => a?.name?.includes(category.name)).slice(0, 5)?.map((a, i) => {
            if (a?.name?.includes(active) && category.name == active) return (
              <div data-aos="fade-down" data-aos-duration={1000} data-aos-delay={300} className='w-full flex flex-row items-center justify-between align-center border-b-2 py-1'>
                <p onClick={() => {
                  navigate(`/Category/${a?._id}`)
                  setMenuOpen(false)
                }} className="relative font-actor text-left text-[10px] w-[90%] font-[600] hover:text-primary">{capitalizeWords(a?.name.replace(category.name, "").replace('food', ""))}</p>
                {/* <div className="w-5 h-5 flex items-center justify-center">
                <Arrow />
              </div> */}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default withAuthContext(withProductContext(Menu))
