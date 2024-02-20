import React, { useEffect } from "react";
import Header from "../Components/Header";
import BreadsCrumbs from "../Components/BreadCrumbs";
import Navigation from "../Components/Navigation";
import Setting from "../Components/setting";
import Footer from "../Components/Footer";
import Table from "../Components/Table";
import ProfileImage from "../assests/ProfileImage.png";
import { withProductContext } from "../context/Product";
import { withAuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import AdresDetail from "../assests/AdresDetail.png"
import { MdOutlineMail } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
function Profile({ currUser, GetCurrentUser, GetAllAddress, AllAddress }) {
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scrolling smooth
    });
    GetCurrentUser()
    GetAllAddress()

  }, [])
  return (
    <React.Fragment>
      
      <Header />
      <main className="flex items-center justify-center mt-10 mb-24">
        <div className="w-[90%]">
          <BreadsCrumbs />
          <section className="flex md:flex-row flex-col gap-10 justify-between mt-[20px]">
            <Navigation active={"Dashboard"} />
            <section className="md:w-[78%] w-[100%]">
              <main className="w-full flex md:flex-row gap-4 flex-col mb-[20px] justify-between">
                <div className="w-full md:w-[55%] border-2 border-color-[#E6E6E6] rounded-[8px] flex flex-col items-center justify-center p-[20px]"
                  style={{ background: `url('${AdresDetail}')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}
                >

                  <p className="font-bold text-[30px] text-center text-[#FFFFFF]">
                    Welcome back {currUser?.name}!
                  </p>
                  <p className="font-bold text-[14px] text-center text-[#FFFFFF]">
                    We’re paws-itively thrilled to see you again!
                    <span className="text-[20px]">🐶❤️</span>
                  </p>
                  <div className="font-bold text-[14px] leading-[20px] text-[#999999] flex flex-row justify-center align-center items-center gap-2 mt-2">
                    <MdOutlineMail />
                    {currUser?.email}
                  </div>


                </div>
                <div className="w-full md:w-[43%] border-2 border-color-[#E6E6E6]  rounded-[8px] px-[20px] py-[30px]">
                  <h2 className="font-bold text-[22px] text-primary font-poppins">
                    BILLING ADDRESS
                  </h2>
                  <div className="flex flex-row justify-start align-center items-center gap-4 font-bold text-[16px] leading-[27px] text-[#1A1A1A] my-[8px]">
                    <FaUserCog className="w-[25px] h-[25px] text-primary" />
                    {AllAddress?.[0]?.full_name}
                  </div>
                  <div className="flex flex-row justify-start align-center items-center gap-4 font-bold text-[14px] leading-[21px] text-[#1A1A1A] my-[8px] w-[264px]">
                    <FaHouseUser className="w-[25px] h-[25px] text-primary" />
                    {AllAddress?.[0]?.address_line1 + "\t" + AllAddress?.[0]?.address_line2}
                  </div>
                  <div className="flex flex-row justify-start align-center items-center gap-4 font-bold text-[16px] leading-[24px] text-[#1A1A1A] my-[8px]">
                    <FaPhoneAlt className="w-[20px] h-[20px] text-primary" />
                    {AllAddress?.[0]?.phone_number}
                  </div>

                </div>
              </main>
              <Table />
            </section>
            {/* <Setting/> */}
          </section>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}
export default withAuthContext(withProductContext(Profile));
