import Dashboard from "../../assests/dashboard.svg";
import Dashboard2 from "../../assests/dashboard2.svg";
import OrderHistory from "../../assests/OrderHistory.svg";
import OrderHistory2 from "../../assests/OrderHistory2.svg";
import Wishlist from "../../assests/wishlist.svg";
import Shipping from "../../assests/shipping.svg";
import Setting from "../../assests/setting.svg";
import Setting2 from "../../assests/setting2.svg";
import Logout from "../../assests/logout.svg";
import { withAuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
function Navigation({ active, setToken, CheckToken }) {
  const navigate = useNavigate()
  return (
    <div className="border-2 border-color-[#E6E6E6] p-8 rounded-[8px] md:w-[20%] w-[100%] pointer">
      <h3 className="font-bold text-[25px] leading-[30px] text-[#1A1A1A]">
        Navigation
      </h3>
      <div className="flex gap-[5px] mt-[20px] " onClick={() => {
        navigate("/Profile")
      }}>
        <img src={active === "Dashboard" ? Dashboard2 : Dashboard} alt="" />
        <p className="font-bold text-[16px] leading-[24px] text-[#666666]">
          Dashboard
        </p>
      </div>
      <div className="flex gap-[5px]  mt-[20px] " onClick={() => {
        navigate("/OrderHistory")
      }}>
        <img
          src={active === "OrderHistory" ? OrderHistory2 : OrderHistory}
          alt=""
        />
        <p className="font-bold text-[16px] leading-[24px] text-[#666666]">
          Order History
        </p>
      </div>
      {/* <div className="flex gap-[5px]  mt-[20px] " onClick={() => {
        navigate("/Wishlist")
      }}>
        <img src={Wishlist} alt="" />
        <p className="font-bold text-[16px] leading-[24px] text-[#666666]">
          Wishlist
        </p>
      </div> */}
      <div className="flex gap-[5px]  mt-[20px] " onClick={() => {
        navigate("/AccountSetting")
      }}>
        <img src={active === "Setting" ? Setting : Setting2} alt="" />
        <p className="font-bold text-[16px] leading-[24px] text-[#666666]">
          Setting
        </p>
      </div>
      <div className="flex gap-[5px]  mt-[20px] " onClick={() => {
        navigate("/ChangePassword")
      }}>
        <img src={active === "ChangePassword" ? Setting : Setting2} alt="" />
        <p className="font-bold text-[16px] leading-[24px] text-[#666666]">
          Change Password
        </p>
      </div>
      <div className="flex gap-[5px]  mt-[20px] " onClick={() => {
        setToken("")
        localStorage.clear()
        CheckToken()
        navigate("/")
      }}>
        <img src={Logout} alt="" />
        <p className="font-bold text-[16px] leading-[24px] text-[#666666]">
          Logout
        </p>
      </div>
    </div>
  );
}
export default withAuthContext(Navigation);
