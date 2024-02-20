import React, { useEffect } from "react"
import Header from "../Components/Header"
import BreadsCrumbs from "../Components/BreadCrumbs"
import Navigation from "../Components/Navigation"
import Footer from "../Components/Footer"
import ChangePassword from "../Components/ChangePassword"

function ChangePasswordMain() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
    }, [])
    return (
        <React.Fragment>
            <Header />
            <main className="flex items-center justify-center my-4 md:mt-10 md:mb-24">
                <div className="w-[95%] md:w-[90%]">
                    <BreadsCrumbs />
                    <section className="flex md:flex-row flex-col justify-between md:mt-[20px]">
                        <Navigation active={"Change Password"} />
                        <ChangePassword />
                    </section>
                </div>
            </main>
            <Footer />
        </React.Fragment>
    )
}
export default ChangePasswordMain