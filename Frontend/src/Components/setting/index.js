import React, { useEffect, useState } from "react"
import ProfileImage from "../../assests/ProfileImage.png"
import Eye from "../../assests/eye.svg"
import "./style.css"
import Address from "../Address"
import { withProductContext } from "../../context/Product"
import AddressCard from "../Card/AddressCard"
import { MdAddBusiness } from "react-icons/md";
import DogFood from "../../assests/AddressPic.png"
import AdresDetail from "../../assests/AdresDetail.png"

function Setting({ GetAllAddress,
    AllAddress, }) {
    const [New, setNew] = useState(false)
    useEffect(() => {
        GetAllAddress()
    }, [])
    return (
        <React.Fragment>
            <section className="md:w-[78%] w-[100%]">
                <main className="border-2 border-color-[#E6E6E6] p-2 md:py-8 rounded-[8px] w-[100%] mt-[20px] md:px-10">
                    {AllAddress?.length > 0 ?
                        <div className="w-full">
                            <div className="flex w-full justify-end mb-[20px]">
                                <button className="bg-[#1e8a30ff] py-[16px] px-[2%] text-[#fff] mt-[15px] rounded-[25px] text-[16px] font-[600] leading-[19.2px]" onClick={() => {
                                    setNew(!New)
                                }}>{New ? "Cancel" : <MdAddBusiness className="w-[25px] h-[25px] text-[#FFFFFF]" />}</button>
                            </div>
                            {New ?
                                <Address />
                                :
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    {AllAddress?.map((a, i) => (
                                        <AddressCard
                                            key={a?._id}
                                            Select={false}
                                            id={a?._id}
                                            address={a?.address_line1}
                                            city={a?.city}
                                            country={a?.country}
                                            name={`Address ${i + 1}`}
                                            state={a?.state}
                                            phone_number={a?.phone_number}
                                        />
                                    ))}
                                </div>
                            }
                        </div> : !New ? (
                            <div className="h-[80vh] w-full flex flex-col justify-center align-center items-center">
                                <img src={DogFood} className="w-[40%] h-[30vh] my-[2%]" />
                                <h1 className="text-[30px] text-primary">Share Your Address and Experience the Magic!</h1>
                                <p className="text-[12px] text-[#000000] text-center">Your search for excellence ends here, where innovation meets dedication. Together, we’ll craft something extraordinary that exceeds expectations and leaves a lasting impression!</p>
                                <button className="mt-[2%] bg-[#1e8a30ff] py-[16px] w-[20%] text-[#fff] mt-[15px] rounded-[25px] text-[16px] font-[600] leading-[19.2px]" onClick={() => {
                                    setNew(!New)
                                }}>{New ? "Cancel" : "Add Address"}</button>
                            </div>
                        ) : <Address />}

                </main>
            </section>
        </React.Fragment>
    )
}
export default withProductContext(Setting)