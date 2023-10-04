import React from "react";
import home__bg from "../../assets/banner__home.png";
import a2 from "../../assets/a2.png";
import a1 from "../../assets/a1.png";
import bg from "../../assets/bg.jpg";
import bg2 from "../../assets/image1.png";
import Qustion from "../../components/Qustion";
import Header from '../../components/Header'
import { FaUser } from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";
import { AiFillSchedule } from "react-icons/ai";
import { SiGooglemeet } from "react-icons/si";
import Card from "./HomeCard";
import { selectIsLoggedIn, getUserDetails, setLoggedInValue, userDetailsFetch } from '../../features/redux/auth'
import { setSearchKeyword, setDirectSearch } from "../../features/redux/professionFilter";
import { useEffect, useState } from "react";
import { useSelector, useDispatch, connect } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom"
import api from "../../Api/GeneralApi"
import DeactivateModal from "../Modals/DeactivateModal";
import { googleLogout } from '@react-oauth/google';

function Home({ professionFilter: { directSearch, searchKeyWord } }) {
    let location = useLocation()
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const userRole = useSelector(getUserDetails)
    const dispatch = useDispatch()
    const [userType, setuserType] = useState(userRole.is_professional)
    const [searchProfessor, setSearchProfessor] = useState('')
    const [userAlreadyLogin, setUserAlreadyLogin] = useState({
        status: false,
        message: ""
    })
    const navigate = useNavigate()
    const clearZendeskHistory = () => {
        const e = ["clientId", "appUserId", "sessionToken"];
        Object.keys(localStorage).filter(t => e.includes((e => e.split(".")[1])(t))).forEach(e => localStorage.removeItem(e))
    }
    const optIntoUncachedConfigEndpoint = () => {
        window.zESettings = {
            ...window.zESettings,
            preview: !0
        }
    }
    useEffect(() => {
        if (isLoggedIn) {
            let fcmToken = localStorage.getItem("fcmToken")
            let data = {
                device_token: fcmToken,
            };
            api.CheckUserAlreadyLogin(data).then((res) => {
                if (res.data.status) {
                    setUserAlreadyLogin({
                        status: res.data.login_status,
                        message: res.data.message
                    })
                } else if (res.response.status === 401) {
                    if (clearZendeskHistory()) {
                        optIntoUncachedConfigEndpoint()
                    }
                    dispatch(setLoggedInValue(false))
                    dispatch(userDetailsFetch({}))
                    localStorage.removeItem('meetingDuration')
                    localStorage.removeItem('meetingEndtime')
                    localStorage.removeItem('callRecieverDetails')
                    localStorage.removeItem('MEETING_CREDENTIALS')
                    localStorage.removeItem('meetingDurationInTimestamp')
                    window.history.pushState({}, null, "/sign_in");
                    window.location.reload();
                    googleLogout()
                    window.FB.getLoginStatus(function (response) {
                        window.FB.logout(function (response) {
                            console.log("Logout")
                        });
                    });
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [])
    useEffect(() => {
        if (location.hash === "#how-it-works") {
            let elem = document.getElementById(location.hash.slice(1))
            elem.scrollIntoView({ behavior: "smooth" })
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        }
    }, [location])
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/')
        }
    }, [isLoggedIn])
    useEffect(() => {
        const submitSearch = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                getSearch(searchProfessor)
            }
        }
        if (searchProfessor.length > 0) {
            document.addEventListener('keydown', submitSearch)
        }
        return () => {
            document.removeEventListener('keydown', submitSearch)
        }
    }, [searchProfessor])

    const getSearch = (searchKey) => {
        dispatch(setDirectSearch(true))
        dispatch(setSearchKeyword(searchKey))
        navigate('/search')
    }

    return (
        <>
            <Header screen="Home" />
            {/* Banner section Start*/}
            <div className="bg__wrap">
                <section className="container mx-auto xl:pt-24 lg:pt-16 pt-20 px-6 lg:px-0">
                    <div className="lg:flex md:flex items-center">
                        <div className="lg:w-1/2 md:w-1/2">
                            <div className="justify-center">
                                <h5 className="uppercase lg:mb-4 mb-2 text-md font-semibold primary">Your wishes are now a click away</h5>
                                <h1 className="text-3xl lg:text-5xl md:text-5xl xl:text-5xl sm:text-5xl font-bold head__home capitalize"> <span className="text-3xl">Express</span> yourself  <span className="text-3xl">With</span> millions of dream people in <span style={{ color: "#F4B319" }}> one click.</span></h1>
                                <p className="text-lg lg:mt-5 mt-2">With MEETURDREAM application, find your favorite professionals with just a click</p>

                                <div className="lg:mt-4 mt-3 relative">
                                    <input type="text" value={searchProfessor} onChange={(e) => setSearchProfessor(e.target.value)} placeholder="Search Professionals" className="w-full h-[60px] bg-white shadow pl-11 rounded" />
                                    <button className="bg_primary  rounded-sm py-3 px-10 text-white absolute right-0 h-[60px] top-0" onClick={() => getSearch(searchProfessor)}>Explore</button>

                                    <span className="absolute top-[18px] left-[15px]">
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_23_108)">
                                                <path d="M9.9796 3.08603C11.3034 3.08482 12.5977 3.47625 13.699 4.21081C14.8002 4.94536 15.6588 5.99003 16.1663 7.21267C16.6737 8.43531 16.8071 9.78097 16.5495 11.0794C16.292 12.3779 15.6552 13.5708 14.7196 14.5073C13.784 15.4437 12.5917 16.0816 11.2934 16.3403C9.99522 16.599 8.64944 16.4669 7.42634 15.9606C6.20324 15.4543 5.15778 14.5966 4.42222 13.496C3.68666 12.3955 3.29405 11.1014 3.29405 9.7777C3.30207 8.00649 4.00883 6.31002 5.2607 5.057C6.51258 3.80398 8.2084 3.09567 9.9796 3.08603M9.9796 1.83325C8.40834 1.83325 6.87236 2.29919 5.56591 3.17213C4.25945 4.04508 3.24119 5.28583 2.63989 6.73749C2.0386 8.18915 1.88127 9.78651 2.18781 11.3276C2.49435 12.8687 3.25098 14.2842 4.36203 15.3953C5.47308 16.5063 6.88865 17.263 8.42972 17.5695C9.97079 17.876 11.5682 17.7187 13.0198 17.1174C14.4715 16.5161 15.7122 15.4979 16.5852 14.1914C17.4581 12.8849 17.9241 11.349 17.9241 9.7777C17.9241 7.6707 17.087 5.65 15.5972 4.16013C14.1073 2.67025 12.0866 1.83325 9.9796 1.83325Z" fill="#949494" />
                                                <path d="M21.3888 20.3438L16.8849 15.8093L16.0171 16.671L20.521 21.2054C20.5776 21.2624 20.6448 21.3077 20.7189 21.3387C20.793 21.3697 20.8724 21.3858 20.9527 21.3861C21.033 21.3863 21.1126 21.3708 21.1869 21.3403C21.2612 21.3099 21.3287 21.2651 21.3857 21.2085C21.4427 21.1519 21.488 21.0847 21.5189 21.0106C21.5499 20.9365 21.566 20.8571 21.5663 20.7768C21.5666 20.6965 21.5511 20.6169 21.5206 20.5426C21.4901 20.4683 21.4453 20.4007 21.3888 20.3438Z" fill="#949494" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_23_108">
                                                    <rect width="22" height="22" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </span>


                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 md:w-1/2">
                            <div className="justify-center">
                                <img src={home__bg} alt="" className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Banner section End */}


                <section>
                    <div className="container mx-auto lg:px-0 px-2">
                        <div className="grid grid-cols-2 lg:grid-cols-4 md-grid-cols-4 sm-grid-cols-2 gap-4">
                            <div className="">
                                <div className="lg:p-12 p-5 sm:p-8 bg-gray-50 shadow-sm">
                                    <h2 className="font-bold text-2xl lg:text-3xl primary ">500+</h2>
                                    <p className="lg:pt-2 pt-1 text-lg">Professionals</p>
                                </div>
                            </div>
                            <div className="">
                                <div className="lg:p-12 p-5 sm:p-8 bg-gray-50 shadow-sm">
                                    <h2 className="text-2xl lg:text-3xl primary font-bold">250K</h2>
                                    <p className="lg:pt-2 pt-1 text-lg">Users</p>
                                </div></div>
                            <div className="">
                                <div className="lg:p-12 p-5 sm:p-8 bg-gray-50 shadow-sm">
                                    <h2 className="text-2xl lg:text-3xl primary font-bold">10+</h2>
                                    <p className="lg:pt-2 pt-1 text-lg">Countries</p>
                                </div> </div>
                            <div className="">
                                <div className="lg:p-12 p-5 sm:p-8 bg-gray-50 shadow-sm">
                                    <h2 className="text-2xl lg:text-3xl primary font-bold">30K+</h2>
                                    <p className="lg:pt-2 pt-1 text-lg">Beneficiaries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="lg:pt-24 lg:pb-0 py-10 ">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-center mb-12 px-4 lg:px-0">
                            <h1 className="text-xl lg:text-3xl font-bold">What you are looking for ?</h1>
                            {/* <span className="block">View All</span> */}
                        </div>
                        <Card />
                    </div>
                </section>
            </div>
            {!userType ?
                <section className="lg:mt-52 mt-40 ">
                    <div className="container mx-auto lg:px-0 px-4">
                        <div className="lg:flex md:flex bg-[#153D57] rounded-3xl text-white items-center px-8 lg:px-14 gap-12 lg:py-0 py-10">
                            <div className="lg:w-1/2 margin_to">
                                <div className="text-center">
                                    <img src={bg2} alt="" className="img-responsive " />
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <div className=" justify-center">
                                    <h1 className="head_1 lg:mb-3 my-3 leading-10">Earn by becoming a professional</h1>
                                    <p className="lg:mb-8 mb-2 text-white">Register as a professional and start earning extra by providing your expertized services to your clients and  fans online with meet your dream.</p>
                                    <button className="text-black py-4 text-md font-semibold px-6 rounded-full bg-white" > <a onClick={() => { navigate("/become_profession") }}>Start Now</a></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> : ""}



            <section id="how-it-works" className="container mx-auto lg:py-28 py-10 lg:px-0 px-2">
                <div className="">
                    <h1 className="head_1 b-3 text-center mb-10  lg:mb-16"> How Meet your Dream works ?</h1>
                    {/* <p className="text-center lg:mb-16">Take live lessons with the best online language tutors</p> */}

                    <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-4">
                        <div className=" shadow-md min-h-[260px]">
                            <div className="p-10 rounded-xl ">
                                <div className="bg_primary inline-block p-4 rounded text-white">
                                    <FaUser size={25} />
                                </div>
                                <h2 className="mt-5 text-lg font-semibold mb-2">Sign up </h2>
                                <p className="mb-8">Sign up for free to meet your dream</p>
                            </div>
                        </div>
                        <div className=" shadow-md min-h-[260px]">
                            <div className="p-10 rounded-xl">
                                <div className="bg-orange-600 inline-block p-4 rounded text-white">
                                    <BsBriefcaseFill size={25} />
                                </div>
                                <h2 className="mt-5 text-lg font-semibold mb-2"> Find your professional</h2>
                                <p className="mb-8">Choose a professional of your choice from over 500+ Professional within few seconds.</p>
                            </div>
                        </div>

                        <div className=" shadow-md min-h-[260px]">
                            <div className="p-10 rounded-xl">
                                <div className="bg-[#8936DC] inline-block p-4 rounded text-white">
                                    <AiFillSchedule size={25} />
                                </div>
                                <h2 className="mt-5 text-lg font-semibold mb-2"> Schedule at your convenience </h2>
                                <p className="mb-8">No more waiting for Meeting your dreams, Meet your professional at your convenience.</p>
                            </div>
                        </div>

                        <div className=" shadow-md min-h-[260px]">
                            <div className="p-10 rounded-xl">
                                <div className="bg-[#5F8E3A] inline-block p-4 rounded text-white">
                                    <SiGooglemeet size={25} />
                                </div>
                                <h2 className="mt-5 text-lg font-semibold mb-2">Meet your professional</h2>
                                <p className="mb-8">From Tips to consultation, Enjoy the meet of your dreams with your choice of professional.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {!userType ?
                <section className="container mx-auto lg:py-14 py-8 lg:px-0 px-2">
                    <div className="lg:flex md:flex items-center">
                        <div className="lg:w-1/2 md:w-1/2 mb-2 lg:mb-0 lg:px-10">
                            <div className=" lg:text-left md:text-left sm:text-center text-center sm:mt-5 mt-5">
                                <h1 className="head_1 mb-3">Get paid automatically by referring</h1>
                                <p className="mb-6">Share your referal Code with your contacts and everytime a session is completed using your referral code, You earn too.</p>
                                <button className="btn_primary rounded-full"><a onClick={() => { navigate("/become_profession") }}>Become a professional</a></button>
                            </div>
                        </div>
                        <div className="lg:w-1/2 md:w-1/2 ">
                            <div className="justify-center">
                                <img src={a2} alt="" className="img-responsive" />
                            </div>
                        </div>
                    </div>
                </section> : ""}

            <section className="py-24">
                <img src={bg} alt="" className="w-full " />
            </section>

            {!userType ?
                <section className="container mx-auto">
                    <div className="lg:flex md:flex items-center md:gap-4">
                        <div className="lg:w-1/2 md:w-1/2">
                            <div className="text-center justify-center flex">
                                <img src={a1} alt="" className="lg:max-w-3xl" />
                            </div>
                        </div>
                        <div className="lg:w-1/2 md:w-1/2">
                            <div className="lg:pr-32 lg:pt-10 lg:text-left md:text-left sm:text-center text-center sm:mt-5 mt-5">
                                <h1 className="head_1 mb-3">Your Professional, Your Choice</h1>
                                <p className="mb-6">With MEETURDREAM, you can now choose from a pool of professionals from all over the world.</p>
                                <button className="btn_primary rounded-full cursor-pointer"><a onClick={() => { navigate("/become_profession") }}>Get started</a></button>
                            </div>
                        </div>
                    </div>
                </section> : ""}

            <Qustion />
            {userAlreadyLogin.status && <DeactivateModal deactivateStatus={userAlreadyLogin} />}


        </>
    );
}

export default connect((state) => state)(Home);