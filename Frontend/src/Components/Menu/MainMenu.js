import React, { useEffect, useRef, useState } from 'react'
import Menu from '.'
import Logo from "../../assests/Logo.png";
import Image from "../../assests/Menu.avif";
import { withAuthContext } from '../../context/Auth';
import { BiMenuAltRight } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

import { FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import swal from "sweetalert";
import { withCartContext } from "../../context/Cart";
import { ReactComponent as Search } from "../../assests/Search.svg";
import { ReactComponent as SubMenu } from "../../assests/list.svg";
import Image3 from "../../assests/dropdown-1.png";

function MainMenu({ Cart, Token, MenuOpen, setMenuOpen }) {
  const [shouldRender, setShouldRender] = useState(MenuOpen);
  const navigate = useNavigate();
  const InputField = useRef(null)

  // When MenuOpen changes, trigger the appearance/disappearance with a delay for closing
  useEffect(() => {
    if (MenuOpen) {
      setShouldRender(true);  // Ensure the menu renders when it's opened
    } else {
      setTimeout(() => setShouldRender(false), 600); // Delay the removal for transition
    }
  }, [MenuOpen]);

  // If not rendering, return null to avoid DOM presence
  if (!shouldRender) return null;
  return (
    <div className={(MenuOpen ? "" : "zoom-effect-close") + '  py-[20px] fixed top-0 right-0 z-[1000000000000000] overflow-y-scroll w-full cursor-pointer h-full bg-white flex flex-col align-center justify-center items-center'}>
      <div data-aos="fade-down" data-aos-duration="1000" data-aos-delay="300" className='w-[100%] px-[2%] pt-[20px] h-full'>
        <div className='w-full md:hidden flex justify-between'>
          <BiMenuAltRight
            onClick={() => {
              setMenuOpen(!MenuOpen)
            }}
            className="text-primary text-[30px]"
          />
          <img
            src={Logo}
            className="w-[130px] h-[56.889px] flex-shrink-0 ml-[25px] logo-responsive"
          />

          <div className="flex flex-row">
            {[
              {
                text: Token ? "Profile" : "Sign Up/Sign In",
                Icon: <FaUser className="text-primary" />,
                onClick: () => {
                  navigate(Token ? "/Profile" : "/SignIn");
                },
              },
              {
                text: "Cart",
                Icon: <FaCartShopping className="text-primary" />,
                onClick: () => {
                  navigate("/Cart");
                },
              },
            ].map(({ text, Icon, onClick }) => (
              <div
                key={text}
                className={
                  "flex flex-row items-center content-center justify-center gap-2 mr-[15px] md:mr-[20px] ml-[0px] cursor-pointer"
                }
                onClick={onClick}
              >
                <div className="w-18 h-18">{Icon}</div>
                {/* <p className="text-actor text-base font-normal leading-18">
              {text}
            </p> */}
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-[90%] mx-auto h-[48px] border-2 border-primary my-[20px] flex-shrink-0 bg-white">
          {/* Left Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search />
          </div>

          {/* Input Field */}
          <input
            type="text"
            className="w-full h-full pl-12 pr-12 rounded-md bg-opacity-40 bg-white border-none text-[10px]"
            placeholder="Search Pet Essentials, Pet Products and more..."
            ref={InputField}
            // onClick={() => {
            //   navigate(`/Category/`);
            //   InputField?.current?.focus()
            //   setTimeout(() => {
            //     window.scrollTo({
            //       top: 500,       // Scroll to 500px from the top
            //       behavior: 'smooth'  // Optional: Smooth scrolling effect
            //     });
            //   }, 500);
            // }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/Category/${e?.target?.value}`);
                setTimeout(() => {
                  window.scrollTo({
                    top: 600,
                    behavior: 'smooth'
                  });
                }, 500);
              }
            }}
          />

          {/* Right Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
            <SubMenu
              onClick={() => {
                navigate(`/Category`);
                // setMenuOpen(!MenuOpen)
              }}
            />
          </div>
        </div>
        <Menu />
        <img
          src={Image3}
          className="w-full h-full object-cover"
        />
      </div>
    </div >
  )
}

export default withAuthContext(withCartContext(MainMenu))
