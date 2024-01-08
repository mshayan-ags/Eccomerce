import React, { useEffect, useState } from "react"
import Dropdown from "../Dropdown"
import { withCartContext } from "../../context/Cart"
import { withAuthContext } from "../../context/Auth"
import { BackendLink } from "../../link"
import axios from "axios"
import swal from "sweetalert"
import { useNavigate } from "react-router-dom"
import { countries } from "./data"
function Address({ Token, CheckToken, setAddress, Notes, setNotes }) {
    const navigate = useNavigate();

    const [state, setState] = useState({
        full_name: "",
        phone_number: "",
        address_line1: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        address_line2: "",
        is_default: false,
    })
    const [Loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (Token) {
            setLoading(true);
            axios
                .post(`${BackendLink}/Create-Address`, state, {
                    headers: {
                        Authorization: Token
                            ? `${Token}`
                            : `${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    setLoading(false);
                    if (res?.data?.status == 200) {
                        setAddress(res?.data?.id);
                        navigate("/Payment");
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
        CheckToken()
    }, [])


    return (
        <React.Fragment>
            <h2 className="text-[24px] font-[500] font-poppins text-[#1A1A1A]">Billing Information</h2>
            <div className="flex items-center justify-between gap-[20px] mt-8 mb-5">
                <div className="w-[50%]">
                    <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] font-poppin">Full Name</p>
                    <input
                        value={state?.full_name}
                        onChange={(e) => {
                            setState({ ...state, full_name: e?.target?.value })
                        }}
                        placeholder="Your Full Name" type="text" className="w-full h-[49px] px-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" />
                </div>
                <div className="w-[50%]">
                    <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] font-poppin">Phone Number</p>
                    <input value={state?.phone_number}
                        onChange={(e) => {
                            setState({ ...state, phone_number: e?.target?.value })
                        }} placeholder="Your Phone Number" type="text" className="w-full h-[49px] px-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" />
                </div>
            </div>
            <div className="w-full mb-5">
                <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] font-poppin">Address Line 1</p>
                <input value={state?.address_line1}
                    onChange={(e) => {
                        setState({ ...state, address_line1: e?.target?.value })
                    }} placeholder="Address Line 1" type="text" className="w-full h-[49px] px-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" />
            </div>
            <div className="w-full mb-5">
                <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] font-poppin">Address Line 2</p>
                <input value={state?.address_line2}
                    onChange={(e) => {
                        setState({ ...state, address_line2: e?.target?.value })
                    }} placeholder="Address Line 2" type="text" className="w-full h-[49px] px-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" />
            </div>
            <div className="w-full flex items-center justify-between">

                <div className="w-[100%] flex flex-wrap justify-between mb-5">
                    <div className="w-full md:w-[280px]">
                        <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] font-poppin mb-[10px]">Country / Region</p>
                        <Dropdown width={"320px"} activeItem={state?.country}
                            setActiveItem={(e) => {
                                setState({ ...state, country: e })
                            }} Array={countries} />
                    </div>
                    <div className="w-[30%] md:w-[116px]">
                        <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] mt-[10px]">States</p>
                        <input type="text" placeholder="State" className="w-full h-[49px] px-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" value={state?.state}
                            onChange={(e) => {
                                setState({ ...state, state: e?.target?.value })
                            }} />

                    </div>
                    <div className="w-[30%] md:w-[116px]">
                        <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] mt-[10px]">City</p>
                        <input type="text" placeholder="City" className="w-full h-[49px] px-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" value={state?.city}
                            onChange={(e) => {
                                setState({ ...state, city: e?.target?.value })
                            }} />

                    </div>
                    <div className="w-[30%] md:w-[116px]">
                        <p className="text-[12px] md:text-[14px] font-bold text-[#1A1A1A] mt-[10px]">Zip Code</p>
                        <input value={state?.postal_code}
                            onChange={(e) => {
                                setState({ ...state, postal_code: e?.target?.value })
                            }}
                            placeholder="Zip Code" type="text" className="w-full h-[49px] px-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" />
                    </div>
                </div>
            </div>
            <div className="flex">
                <input type="checkbox" className="w-[20px] h-[20px]  rounded-[12px]" checked={!!state?.is_default}
                    onChange={(e) => {
                        setState({ ...state, is_default: e?.target?.checked })
                    }} />
                <p className="text-[12px] md:text-[14px] font-bold font-Poppins text-[#4D4D4D] ml-[10px]">Make It Default Address</p>
            </div>
            <hr className="mt-10 mb-10 color-[#E6E6E6]" />
            <h2 className="text-[24px] leading-[36px] font-[500] font-poppins text-[#1A1A1A] mb-6">Additional Info</h2>
            <p className="text-[12px] md:text-[14px] font-bold font-Poppins text-[#1A1A1A]">Order Notes (Optional)</p>
            <input placeholder="Notes about your order, e.g. special notes for delivery"
                value={Notes} onChange={(e) => {
                    setNotes(e?.target?.value)
                }}
                type="text" className="w-full text-start h-[100px]  px-[15px] py-[15px] mt-[5px] md:mt-[10px] text-[10px] md:text-[16px] font-[400] font-Poppins text-[#999999] rounded-[6px] border-2 border-[#E6E6E6]" />
            <button onClick={() => {
                handleSubmit()
            }} disabled={Loading}
                className="bg-[#1e8a30ff] py-[16px] w-full text-[#fff] mt-[15px] rounded-[25px] text-[10px] md:text-[16px] font-[600] leading-[19.2px]">{Loading ? "Loading ..." : "Save Address"}</button>

        </React.Fragment>
    )
}
export default withCartContext(withAuthContext(Address))