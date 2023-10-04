import { React, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import playstoreimg from '../assets/play_store.png';
import appstoreimg from '../assets/app_store.png';
import logo from '../assets/logo.png';
import api from "../Api/GeneralApi";
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import { getUserDetails } from '../features/redux/auth'
import ContactUsModal from "../pages/Modals/ContactUsModal";
import Zendesk from "react-zendesk";
import { ZendeskAPI, } from "react-zendesk";
const ZENDESK_KEY = "2a6aa6";

const Footer = () => {
    const location = useLocation()
    const [Address, setAddress] = useState([]);
    const navigate = useNavigate()
    const userRole = useSelector(getUserDetails)
    const [userType, setuserType] = useState(userRole.is_professional)
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        getAddress();
        setuserType(userRole?.is_professional)
    }, []);
    const getAddress = () => {
        api
            .getLegalInfo()
            .then((result) => {
                setAddress(result.data.data);
            })
            .catch((err) => {
                console.log("api error Faq response", err);
            });
    };
    useEffect(() => {
        if (location.hash === "#mobile-app") {
            let elem = document.getElementById(location.hash.slice(1))
            elem.scrollIntoView({ behavior: "smooth" })
        }
    }, [location])
    if (window.location.pathname === "/session-call" || window.location.pathname === "/otp-checkout" || window.location.pathname.split('/')[1] === "referral") {
        return null;
    } else {
        return (
            <>
                <Zendesk zendeskKey={ZENDESK_KEY} />
                <footer className=" mt-5 lg:mt-20 md:p-5 p-2">
                    <div className="container mx-auto">
                        <div className="flex flex-col justify-center items-center h-full">
                            <div className="flex w-full flex-col gap-1 lg:gap-6 md:flex-row">
                                <div className=" md:w-1/2 lg:w-2/4 lg:mb-8 mb-2" id="mobile-app">
                                    <p>Meeturdream is now available both on the Play Store and App Store. Download for free to get personalized & tailored advice just for you.</p>
                                    <div className="flex gap-3  mt-4 mb-5">
                                        <a href="https://play.google.com/store/apps/details?id=com.meet.urdream" target="_blank"><img src={playstoreimg} alt="" /> </a>
                                        <a href="https://apps.apple.com/in/app/meeturdream/id1663715162" target="_blank"> <img src={appstoreimg} alt="" /></a>
                                    </div>
                                    {/* <Link className="text-3xl font-bold" to="/"> Meet<span style={{ color: "#F4B319" }}>Ur</span>Dream </Link> */}
                                    <Link className="text-xl md:text-3xl font-bold" to="/">
                                        <img src={logo} width="60px" alt="" />
                                    </Link>
                                </div>
                                <div className=" md:w-1/2 lg:w-1/4 lg:mb-8 mb-2">
                                    <h2 className="text-lg font-bold pb-4">About Us</h2>
                                    <ul className="p-0">
                                        <li className="nav_item">
                                            <a onClick={() => { navigate("/about") }} className="cursor-pointer">Who we are</a>
                                        </li>
                                        <li className="nav_item">
                                            <a onClick={() => { navigate("/#how-it-works") }} className="cursor-pointer">How It Works</a>
                                        </li>
                                        <li className="nav_item">
                                            <a className="cursor-pointer" onClick={() => {
                                                ZendeskAPI("messenger", "open")
                                            }}>Help Center</a>
                                        </li>
                                        <li className="nav_item">
                                            <a className="cursor-pointer" onClick={() => { setShowModal(true) }}>Contact Us</a>
                                        </li>

                                    </ul>
                                </div>


                                <div className=" md:w-1/2 lg:w-1/4 lg:mb-8 mb-2">
                                    <h2 className="text-lg font-bold pb-4">Links</h2>
                                    <ul className="p-0">
                                        <li className="nav_item">
                                            <a onClick={() => { navigate("/Terms-and-service") }} className="cursor-pointer">Terms & Condition</a>
                                        </li>
                                        <li className="nav_item">
                                            <a onClick={() => { navigate("/privacy") }} className="cursor-pointer">Privacy Policy</a>
                                        </li>
                                        {!userType ? <li className="nav_item">
                                            <a onClick={() => { navigate("/become_profession") }} className="cursor-pointer">Become a Professional</a>
                                        </li> : ""}
                                    </ul>
                                </div>

                                <div className=" md:w-1/2 lg:w-1/4 lg:mb-8 mb-2">
                                    <h2 className="text-lg font-bold pb-4">Social</h2>
                                    <ul className="p-0">
                                        <li className="nav_item">
                                            <a href="https://www.instagram.com/_meeturdream/" target="_blank" rel="Instagram">Instagram</a>
                                        </li>
                                        <li className="nav_item">
                                            <a href="https://www.facebook.com/profile.php?id=100090693229711" target="_blank" rel="Facebook">Facebook</a>
                                        </li>
                                        <li className="nav_item">
                                            <a href="https://twitter.com/Meet_Ur_Dream" target="_blank" rel="Twitter">Twitter</a>
                                        </li>
                                        <li className="nav_item">
                                            <a href="https://www.linkedin.com/in/meet-ur-dream-608492272" target="_blank" rel="Linkedin">Linkedin</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/4 lg:mb-8 mb-2">

                                    <ul className="p-0">
                                        <li className="nav_item">
                                            <h6 className="text-gray-500 mb-3">ADDRESS :</h6>
                                            <p>{Address.address}
                                            </p>
                                        </li>
                                        <li className="nav_item">
                                            <h6 className="text-gray-500 mb-3">EMAIL :</h6>
                                            <p>{Address.email}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <p className="border-t-2 py-6">© {new Date().getFullYear()} Meet UR Dream Inc.
                            All Rights Reserved</p>
                    </div>
                    {showModal ? <ContactUsModal setModal={setShowModal} /> : null}
                </footer>
            </>
        );
    }
}


export default Footer;