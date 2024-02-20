import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { withAuthContext } from "../context/Auth";
import { BackendLink } from "../link";
import axios from "axios";
import { useEffect } from "react";
import BreadsCrumbs from "../Components/BreadCrumbs";
import { BiHide } from "react-icons/bi";
import { IoEye } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import Img from "../assests/signupimg.png"

function Logo() {
  return <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/395d56d2626595ed7f9a61e609f0d43b0801cfdd98852e7fb3a84ae2ab4ae640?apiKey=ba2b07dc4dbe4eae88567108b946aa3a&" alt="Logo" className="max-w-full aspect-[1.11] w-[223px] absolute" />;
}

function EmailInput({ value, onChange }) {
  return (
    <div className="mt-6">
      <div className="rounded-[5px] flex gap-2 md:gap-4 self-start text-base max-md:ml-1 border-2 items-center align-center justify-center">
        <div className=" bg-primary px-2 h-10 rounded-l-[5px] items-center justify-center flex">
          <MdEmail className="w-6 md:w-10 h-4 md:h-6 text-white" />
        </div>
        <input value={value} onChange={(e) => onChange(e?.target?.value)} type="email" id="email" placeholder="Enter your email address" className="flex-auto text-[10px] md:text-[15px] outline-none w-full" />
      </div>
    </div>
  );
}

function UsernameInput({ value, onChange }) {
  return (
    <div className="mt-6">
      <div className="rounded-[5px] flex gap-2 md:gap-4 self-start text-base max-md:ml-1 border-2 items-center align-center justify-center">
        <div className=" bg-primary px-2 h-10 rounded-l-[5px] items-center justify-center flex">
          <FaUser className="w-6 md:w-10 h-4 md:h-6 text-white" />
        </div>
        <input value={value} onChange={(e) => onChange(e?.target?.value)} type="text" id="username" placeholder="Enter your username" className="flex-auto text-[10px] md:text-[15px] outline-none w-full" />
      </div>
    </div>
  );
}

function PasswordInput({ label, id, value, onChange }) {
  const [hide, setHide] = useState(true)
  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
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

function SignUp({ setToken, Token, CheckToken }) {
  const navigate = useNavigate();

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accept: false
  })
  const [Loading, setLoading] = useState(false);

  const handleSubmit = ({ email, password, confirmPassword, name }) => {
    if (email && password && confirmPassword && (password == confirmPassword)) {
      setLoading(true);
      axios
        .post(`${BackendLink}/SignUp`, {
          name,
          email,
          password,
          confirmPassword,
          accept: state?.accept
        })
        .then((res) => {
          setLoading(false);
          if (res?.data?.status == 200) {
            localStorage.setItem("token", res?.data?.token);
            setToken(res?.data?.token);
            navigate("/Checkout");
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
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scrolling smooth
    });
    CheckToken()
  }, [])

  useEffect(() => {
    if (Token && Token !== "") {
      swal({
        text: "Youre All Ready Signed In Please Prooceed To Purchase",
        button: {
          text: "Ok",
          closeModal: true
        },
        icon: "warning",
      }).then(() => {
        navigate("/")
      });
    }
  }, [Token])
  return (
    <div className="pr-10 bg-white max-md:pr-5 max-h-[100vh] lg:overflow-hidden">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="md:flex hidden flex-col w-[50%] max-md:ml-0 max-md:w-full">
          <div className="flex lg:overflow-hidden relative flex-col grow items-start px-2.5 pb-20">
            <img loading="lazy" src={Img} alt="" className="object-cover absolute inset-0 size-full" />
            <Logo />
          </div>
        </div>
        <div className="relative flex flex-col w-full md:w-[50%] mt-[10%] md:mt-[10px] md:h-[100vh] justify-center align-center itms-center px-[5%]">
          <div className="flex flex-col md:px-6 text-black ">
            <BreadsCrumbs Page={"Sign Up"} />
            <h1 className="text-5xl font-bold text-primary mt-4">Sign Up</h1>
            <p className="mt-4 text-[12px] md:text-base max-md:max-w-full">If you already have an account register</p>
            <p className="mt-2 text-[12px] md:text-base text-sky-950 max-md:max-w-full">
              You can <Link to="/SignIn" className="font-semibold text-sky-950">Login here !</Link>
            </p>
            <EmailInput value={state?.email} onChange={(e) => {
              setState({ ...state, email: e })
            }} />
            <UsernameInput value={state?.name} onChange={(e) => {
              setState({ ...state, name: e })
            }} />
            <PasswordInput label="Password" id="password" value={state?.password} onChange={(e) => {
              setState({ ...state, password: e })
            }} />
            <PasswordInput label="Confirm Password" id="confirmPassword" value={state?.confirmPassword} onChange={(e) => {
              setState({ ...state, confirmPassword: e })
            }} />
            <div className="flex flex-row  mt-2 md:mt-10 ">
              <input value={state?.accept} onChange={(e) => setState({ ...state, accept: !state?.accept })} type="checkbox" className="w-6 h-6" />
              <p className="text-[15px] px-2 text-primary font-bold">By signing up, you agree to our
                <a href="/TermsOfUse" target="_blank" className="text-black px-[5px] font-actor text-sm font-bold">Terms of Service</a>
                and
                <a href="/privacy-policy" target="_blank" className="text-black px-[5px] font-actor text-sm font-bold">Privacy Policy</a>
              </p>
            </div>
            <div className="w-full justify-center align-center flex mt-6">
              <button
                className={`w-[70%] md:w-full justify-center items-center px-16 py-2 md:py-5 text-[12px] md:text-lg font-medium text-white whitespace-nowrap shadow-lg ${!state?.accept ? 'bg-[#6e6e6e]' : 'bg-sky-950'} rounded-[32px] max-md:px-5 max-md:max-w-full`}
                disabled={!state?.accept}
                onClick={() => {
                  if (!Loading) {
                    handleSubmit({
                      name: state?.name,
                      email: state?.email,
                      password: state?.password,
                      confirmPassword: state?.confirmPassword,
                      accept: state?.accept
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
                {Loading ? "Loading ... " : "SignUp"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthContext(SignUp);