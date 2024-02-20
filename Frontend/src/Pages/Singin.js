import * as React from "react";
import LoginImage from "../assests/Login Main.png"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import swal from "sweetalert";
import { useEffect } from "react";
import { BackendLink } from "../link";
import { withAuthContext } from "../context/Auth";
import BreadsCrumbs from "../Components/BreadCrumbs";
import { BiHide } from "react-icons/bi";
import { IoEye } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
function EmailInput({ value, onChange }) {
    return (
        <div className="mt-6">
            <div className="rounded-[5px] flex gap-2 md:gap-4 self-start text-base max-md:ml-1 border-2 items-center align-center justify-center">
                <div className=" bg-primary px-2 h-10 rounded-l-[5px] items-center justify-center flex">
                    <MdEmail className="w-6 md:w-10 md:h-6 h-4 text-white" />
                </div>
                <input value={value} onChange={(e) => onChange(e?.target?.value)} type="email" id="email" placeholder="Enter your email address" className="flex-auto text-[10px] md:text-[15px] outline-none w-full" />
            </div>
        </div>
    );
}

function PasswordInput({ label, id, value, onChange }) {
    const [hide, setHide] = useState(true)
    return (
        <div className="mt-6 w-full rounded-[5px] flex gap-2 md:gap-4 self-start text-base max-md:ml-1 border-2 items-center align-center justify-center">
            <div className=" bg-primary px-2 h-10 rounded-l-[5px] items-center justify-center flex">
                <FaLock className="w-6 md:w-10 md:h-6 h-4 text-white" />
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

function SignIn({ setToken, Token, CheckToken }) {
    const navigate = useNavigate();

    const [state, setState] = useState({
        email: "",
        password: "",
    })
    const [Loading, setLoading] = useState(false);

    const handleSubmit = ({ email, password }) => {
        if (email && password) {
            setLoading(true);
            axios
                .post(`${BackendLink}/Login`, { email, password })
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
        <div className="bg-white max-md:pr-5 max-h-[100vh] h-[100%] lg:overflow-hidden">
            <div className="flex gap-5 max-md:flex-col md:px-[0px] md:py-[0px] lg:overflow-hidden max-md:gap-0">
                <div className="relative flex flex-col px-[5%] w-full md:w-[50%] mt-[15%] md:mt-[5%] lg:overflow-hidden">
                    <div className="flex flex-col px-6 text-black max-md:px-5 max-md:max-w-full">
                        <BreadsCrumbs Page={"Sign In"} />
                        <h1 className="text-5xl font-bold text-primary mt-4">Sign In</h1>
                        <p className="mt-4 text-base">Don’t have an account, Create 1 right away</p>
                        <p className="my-2 mb-6 text-base text-black">
                            You can   <Link to={"/SignUp"} className="font-[600] text-sky-950">Register here !</Link>
                        </p>
                        <EmailInput value={state?.email} onChange={(e) => {
                            setState({ ...state, email: e })
                        }} />
                        <PasswordInput label="Password" id="password" value={state?.password} onChange={(e) => {
                            setState({ ...state, password: e })
                        }} />
                        <div className="w-full justify-center align-center flex">
                            <button
                                className="w-[70%] md:w-full justify-center items-center px-16 py-2 md:py-5 mt-10 text-[12px] md:text-lg font-medium text-white whitespace-nowrap shadow-lg bg-sky-950 rounded-[32px] max-md:px-5 max-md:mt-10 max-md:max-w-full"
                                onClick={() => {
                                    if (!Loading) {
                                        handleSubmit(state);
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
                                {Loading ? "Loading ... " : "SignIn"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="md:flex hidden flex-col w-[50%] max-md:ml-0 max-md:w-full">
                    <div className="flex overflow-hidden relative flex-col grow items-start px-2.5 pb-20 max-md:pr-5 max-md:mt-10 max-md:max-w-full">
                        <img loading="lazy" src={LoginImage} alt="" className="object-fit min-h-[100vh] min-w-[50vw]" />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default withAuthContext(SignIn);