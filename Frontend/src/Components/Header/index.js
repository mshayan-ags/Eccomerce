import { ReactComponent as User } from "../../assests/user.svg";
import { FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

import { ReactComponent as CartIcon } from "../../assests/Buy.svg";
import { ReactComponent as Schedule } from "../../assests/Schedule.svg";
import { ReactComponent as Menu } from "../../assests/Group 2.svg";
import { ReactComponent as Search } from "../../assests/Search.svg";
import { ReactComponent as SubMenu } from "../../assests/list.svg";
import Logo from "../../assests/Logo.png";
import { useNavigate } from "react-router-dom";
import { withAuthContext } from "../../context/Auth";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import MainMenu from "../Menu/MainMenu";
import swal from "sweetalert";
import Border from "../Button/Border";
import { withCartContext } from "../../context/Cart";
import MenuStrip from "../Menu/MenuStrip";
import { BiMenuAltRight } from "react-icons/bi";
import { TbCalendarTime } from "react-icons/tb";
import { BsFillCalendarWeekFill } from "react-icons/bs";

function Header({ CheckToken, Token, MenuOpen, setMenuOpen, Cart }) {
  useEffect(() => {
    CheckToken();
  }, []);
  const InputField = useRef(null)
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 300);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MainMenu />
      <div className={
        isSticky ? "sticky top-0 bg-white z-[10000000]  w-full shadow-2xl" : "bg-transparent relative"
      }>
        <div className={" w-full flex flex-row items-center content-center justify-between p-[14px] m-0 px-[10px] md:px-[4%] main-header gap-10 bg-primary"}>
          <div
            className={
              "w-[30%] lg:w-[20%] flex flex-row items-center content-center justify-center gap-2 search-and-logo-responsive cursor-pointer"
            }
          >
            <div className={"w-[20px] h-[20px] flex md:hidden"}>
              <BiMenuAltRight
                onClick={() => {
                  setMenuOpen(!MenuOpen)
                }}
                className="text-white text-[20px]"
              />
            </div>
            <img
              src={Logo}
              className="w-[130px] h-[56.889px] flex-shrink-0 ml-[25px] logo-responsive"
              onClick={() => {
                navigate("/");
              }}
            />
            <div className="md:hidden xs:block">
              <Search />
            </div>
          </div>
          <div className="w-[100%] md:w-[65%]  lg:w-[75%] flex flex-row items-center content-center justify-end md:justify-between xs:hidden md:flex">
            <div className="relative md:w-[60%] w-[90%] h-[48px] flex-shrink-0 input-responsive ml-[20px] bg-white">
              {/* Left Icon */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search />
              </div>

              {/* Input Field */}
              <input
                type="text"
                className="w-full h-full pl-12 pr-12 rounded-md bg-opacity-40 bg-white border-none"
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
            <div className="flex flex-row">
              {[
                {
                  text: Token ? "Profile" : "Sign Up/Sign In",
                  Icon: <FaUser className="text-white" />,
                  onClick: () => {
                    navigate(Token ? "/Profile" : "/SignIn");
                  },
                },
                {
                  text: "Cart",
                  Icon: <FaCartShopping className="text-white" />,
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
              <button onClick={() => {
                if (Cart?.length <= 0) {
                  swal({
                    text: "For Scheduling an Order please add Products to your cart and Proceed",
                    button: {
                      text: "Ok",
                      closeModal: true
                    },
                    icon: "warning",
                    time: 3000
                  })
                  navigate("/Category")
                }
                else { navigate("/Cart") }
              }} className="md:bg-white rounded-full border-2 border-primary inline-flex md:py-[10px] py-[5px] md:px-[28px] gap-2 items-center justify-center md:mr-[25px]">
                <p className="hidden md:block text-primary font-actorPro  font-normal leading-6 md:text-[14px] text-[10px]">Schedule Order</p>
                <BsFillCalendarWeekFill className="text-[15px] md:text-[18px] text-white md:text-primary" />
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuthContext(withCartContext(Header));
