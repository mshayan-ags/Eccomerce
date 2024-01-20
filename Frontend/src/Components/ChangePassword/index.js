import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { withAuthContext } from "../../context/Auth";
import { BackendLink } from "../../link";
import axios from "axios";
import BreadsCrumbs from "../BreadCrumbs";
import { BiHide } from "react-icons/bi";
import { IoEye } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

function PasswordInput({ label, id, value, onChange }) {
  const [hide, setHide] = useState(true)
  const validatePassword = (newPassword) => {
    const requirements = {
      minLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements
    };
  };
  return (
    <div className={`mt-6 w-full rounded-[5px] flex gap-2 md:gap-4 self-start text-base max-md:ml-1 border-2 items-center align-center justify-center ${validatePassword(value).isValid ? "border-primary" : "border-[#FF0000]"}`}>
      <div className={` ${validatePassword(value).isValid ? "bg-primary" : "bg-[#FF0000]"} px-2 h-10 rounded-l-[5px] items-center justify-center flex`}>
        <RiLockPasswordFill className="w-6 md:w-10 h-4 md:h-6 text-white" />
      </div>
      <input value={value} onChange={(e) => onChange(e?.target?.value)} type={hide ? "password" : "text"} id={id} placeholder={`Enter your ${label}`} className="flex-auto text-[10px] md:text-[15px] outline-none w-full" />
      {hide ? <BiHide
        onClick={() => setHide(!hide)}
        className="w-10 h-4"
      />
        :
        <IoEye
          onClick={() => setHide(!hide)}
          className="w-10 h-4"
        />
      }
    </div>
  );
}

function ChangePassword({ setToken, currUser }) {
  const navigate = useNavigate();

  const [state, setState] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [Loading, setLoading] = useState(false);

  const isFormValid = state?.password && state?.newPassword && state?.confirmPassword && state.newPassword === state.confirmPassword;

  const handleSubmit = ({ password, newPassword, confirmPassword }) => {
    if (password && newPassword && confirmPassword && (newPassword == confirmPassword)) {
      setLoading(true);
      axios
        .post(`${BackendLink}/Change-Password`, {
          email: currUser?.email,
          password,
          newPassword,
        })
        .then((res) => {
          setLoading(false);
          if (res?.data?.status == 200) {
            navigate("/Profile");
          }
          swal({
            text: res?.data?.message,
            button: {
              text: "Ok",
              closeModal: true
            },
            icon: res?.data?.status == 200 ? "success" : "error",
            time: 3000
          });
        })
        .catch((err) => {
          setLoading(false);
          swal({
            text: err?.response?.data?.message
              ? err?.response?.data?.message
              : "There was some Error",
            button: {
              text: "Ok",
              closeModal: true
            },
            icon: "error",
            time: 3000
          });
        });
    }
  };

  return (
    <div className="relative flex flex-col w-full border-2 ml-[5%] py-[5%] rounded-[25px] justify-center align-center itms-center px-[5%]">
      <div className="flex flex-col md:px-6 text-black ">
        <BreadsCrumbs Page={"Change Password"} />
        <h1 className="text-5xl font-bold text-primary mt-4">Change Password</h1>
        <PasswordInput label="Old Password" id="password" value={state?.password} onChange={(e) => {
          setState({ ...state, password: e })
        }} />
        <PasswordInput label="Password" id="newPassword" value={state?.newPassword} onChange={(e) => {
          setState({ ...state, newPassword: e })
        }} />
        <PasswordInput label="Confirm Password" id="confirmPassword" value={state?.confirmPassword} onChange={(e) => {
          setState({ ...state, confirmPassword: e })
        }} />

        <div className="w-full justify-center align-center flex mt-6">
          <button
            className={`w-[70%] md:w-full justify-center items-center px-16 py-2 md:py-5 text-[12px] md:text-lg font-medium text-white whitespace-nowrap shadow-lg ${!isFormValid ? 'bg-[#6e6e6e]' : 'bg-sky-950'} rounded-[32px] max-md:px-5 max-md:max-w-full`}
            disabled={!isFormValid}
            onClick={() => {
              if (!Loading) {
                handleSubmit({
                  password: state?.password,
                  newPassword: state?.newPassword,
                  confirmPassword: state?.confirmPassword
                });
              } else {
                swal({
                  text: "Please Let This Task Complete First",
                  button: {
                    text: "Ok",
                    closeModal: true
                  },
                  icon: "warning",
                  time: 3000
                });
              }
            }}
          >
            {Loading ? "Loading ... " : "Change Password"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default withAuthContext(ChangePassword);