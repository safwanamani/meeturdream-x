import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import message from '../assets/message.svg';
import calender from '../assets/calendar 2.svg';
import settings from '../assets/settings.svg';
import log from '../assets/log-out 1.svg';
import logo from '../assets/logo.png';
import { useState } from "react";
import { setLoggedInValue, userDetailsFetch, selectIsLoggedIn, getUserDetails } from '../features/redux/auth'
import { useSelector, useDispatch } from 'react-redux'
import LogOutModal from "../pages/Modals/LogOutModal";
import { AiOutlineClose } from 'react-icons/ai';
import ChatMessageModal from "../pages/Chat/ChatMessageModal";
import api from "../Api/GeneralApi";
import DeactivateModal from "../pages/Modals/DeactivateModal";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { appl } from "../firebaseConfig/config";
import { googleLogout } from '@react-oauth/google';
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { onMessageListener } from "../firebasePush/firebase";

const Header = (props) => {
    const toast = useRef(null)
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const [isOpen, setOpen] = useState(false);
    const [showModal, setModal] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [deactivateStatus, setDeactivateStatus] = useState({
        status: false,
        message: "",
        response: ""
    });
    const userDetails = useSelector(getUserDetails)
    const displayPicture = userDetails?.user_profile_detail?.image_url != null ?
        userDetails?.user_profile_detail?.image_url : "/assets/NoneProfile.png"
    const userRole = useSelector(getUserDetails)
    const [userType, setuserType] = useState(userRole.is_professional)
    const [unseenedChatCount, setUnseenedChatCount] = useState(0)
    const navigate = useNavigate()
    const db = getFirestore(appl)
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
    //onmessage
    useEffect(() => {
        onMessageListener().then(payload => {
            toast.current.show({ severity: 'info', summary: payload.notification.title, detail: payload.notification.body, life: 3000 });
        }).catch(err => console.log("failed: ", err))
    }, [])
    useEffect(() => {
        if (isLoggedIn) {
            api.checkProfessionalStatus().then(({ data }) => {
                if (data.status === true) {
                    let user_details = { ...userDetails };
                    if (data.professional_status === true) {
                        user_details.is_professional = 1;
                        user_details.professional_status = true;
                        setuserType(1)
                    } else {
                        user_details.is_professional = 0;
                        user_details.professional_status = false;
                        setuserType(0)
                    }
                    dispatch(userDetailsFetch(user_details))
                }
            })
            api.getDeactivateStatus().then(({ data }) => {
                setDeactivateStatus({
                    status: data.status,
                    message: data.message,
                    response: data.response
                })
            })
        }
    }, [])
    useEffect(() => {
        let user_id = userDetails?.id;
        const chatCollectionRef = collection(db, `chats/chatroom/messageCounts`)
        let unsubscribeChatCount = onSnapshot(chatCollectionRef, snapshot => {
            const docs = snapshot.docs.map(doc => (doc.data()))
            setUnseenedChatCount(0)
            if (isLoggedIn) {
                docs.forEach((chatCountData) => {
                    if (user_id) {
                        if (chatCountData.user1 === user_id) {
                            if (chatCountData.user1Count > 0) {
                                setUnseenedChatCount(unseenedChatCount + chatCountData.user1Count)
                            }
                        }
                        if (chatCountData.user2 === user_id) {
                            if (chatCountData.user2Count > 0) {
                                setUnseenedChatCount(unseenedChatCount + chatCountData.user2Count)
                            }
                        }
                    }
                })
            }
        })
        return () => {
            unsubscribeChatCount()
        }
    }, [])
    function OpenDrom() {
        setOpen(true)
    }
    function hide() {
        setOpen(false)
    }
    const logOut = async () => {
        await api.userLogout().then((data) => {
            if (data.status === true) {
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
                googleLogout();
                window.FB.getLoginStatus(function (response) {
                    window.FB.logout(function (response) {
                        console.log("Logout")
                    });
                });
            } else {
                if (data.response.status === 401) {
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
                    googleLogout();
                    window.FB.getLoginStatus(function (response) {
                        window.FB.logout(function (response) {
                            console.log("Logout")
                        });
                    });
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: data.message
                    })
                }
            }
        }).catch(err => {
            console.log("server error response", err)
        })
        // FB.getLoginStatus(function(response) {
        //     if (response && response.status === 'connected') {
        //         FB.logout(function(response) {
        //             document.location.reload();
        //         });
        //     }
        // });

    }
    const showChatModal = () => {
        if (showMessageModal) {
            localStorage.setItem('chatScheduleStatus', false)
        } else {
            localStorage.setItem('chatScheduleStatus', true)
        }
        setShowMessageModal(!showMessageModal)
    }
    const openMenu = () => {
        setIsNavOpen((prev) => !prev);
        document.documentElement?.classList?.add('mobile-menu-opened');
    }
    const closeMenu = () => {
        setIsNavOpen(false)
        document.documentElement?.classList?.remove('mobile-menu-opened');
    }
    return (
        <>
            <Toast ref={toast} />
            <header id="header" className={props.screen != "About" ? ((props.screen == 'Home') ? "fixed lg:border-b top-0 backdrop-blur w-full" : " mx-auto ") : "absolute w-full text-white white-svg mx-auto border-b-[1px] border-[#ffffff2e]"}>
                <nav className="flex items-center justify-between py-3 px-3 sm-px-3 lg:px-3">
                    <div className="flex">
                        <div className="lg:hidden ">
                            <button className="navbar-burger flex items-center text-black-600 p-3" onClick={() => openMenu()}>
                                <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                                </svg>
                            </button>

                            <div className={isNavOpen ? "absolute w-full h-screen top-0 left-0 z-20 bg-white flex flex-col justify-evenly items-center" : "hidden"}>
                                <div
                                    className="absolute top-0 right-0 px-8 py-8 text-black"
                                    onClick={() => closeMenu()}
                                >
                                    <AiOutlineClose />
                                </div>
                                <ul className="flex flex-col items-center min-h-[250px]">
                                    {!userType ? <li className="m-4">
                                        <Link to="/become_profession" className="text-black" onClick={() => closeMenu()}>Become a Professional</Link>
                                    </li> : ""}

                                    <li className="m-4">
                                        <a className="text-black" onClick={() => {
                                            closeMenu()
                                            navigate("#mobile-app")
                                        }}
                                        >Get the mobile app</a>
                                    </li>
                                    <li className="m-4">
                                        <Link to="/search" className="text-black" onClick={() => closeMenu()}>Find Professional</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Link className="text-xl md:text-3xl font-bold z-10" to="/">
                            <img src={logo} width="40px" alt="" />
                        </Link>
                    </div>

                    <div className="absolute flex justify-center w-full z-0">
                        <ul className="lg:flex hidden">
                            {!userType ? <li className="'block px-3 py-2 text-m ">
                                <Link to="/become_profession">Become a Professional</Link>
                            </li> : ""}

                            <li className="'block px-3 py-2 text-m cursor-pointer">
                                <a onClick={() => { navigate("#mobile-app") }}>Get the mobile app</a>
                            </li>
                            <li className="'block px-3 py-2 text-m">
                                <Link to="/search">Find Professional</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="menu__right flex items-center z-10">
                        <div className="">
                            {isLoggedIn ? <ul className="flex items-center gap-3">
                                <Link to="/favourites">
                                    <div className="relative">
                                        <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.59976 3.13132L8.79312 2.34518C6.89968 0.499857 3.42783 1.13666 2.17454 3.45665C1.58615 4.54784 1.45339 6.12331 2.5278 8.13397C3.56283 10.07 5.71615 12.3889 9.59976 14.9147C13.4834 12.3889 15.6356 10.07 16.6717 8.13397C17.7461 6.12224 17.6145 4.54784 17.025 3.45665C15.7717 1.13666 12.2998 0.498791 10.4064 2.34412L9.59976 3.13132ZM9.59976 16.2001C-7.65039 5.39264 4.28848 -3.04253 9.40176 1.41932C9.46926 1.47799 9.53564 1.53879 9.59976 1.60172C9.66324 1.53884 9.72929 1.47835 9.79777 1.42039C14.9099 -3.04466 26.8499 5.39157 9.59976 16.2001Z" fill="#2F2F2F" />
                                        </svg>
                                    </div>
                                </Link>
                                <Link to="" className="cursor-pointer" onClick={() => showChatModal()}>
                                    <strong class="relative inline-flex items-center font-medium mt-[8px]">
                                        {unseenedChatCount > 0 && (
                                            <span class={`absolute -top-2 -right-2 h-5 rounded-full bg-red-600 flex justify-center items-center text-white items ${unseenedChatCount < 100 ? 'w-5 text-xs' : unseenedChatCount < 1000 && unseenedChatCount >= 100 ? 'w-6 text-[10px]' : 'text-[10px] w-7'}`}><span>{unseenedChatCount}</span></span>
                                        )}
                                        <span>
                                            <svg width="19" height="19" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.5087 7.7859C15.5115 8.87912 15.2561 9.95756 14.7632 10.9334C14.1788 12.1027 13.2804 13.0862 12.1686 13.7738C11.0568 14.4613 9.77551 14.8258 8.46828 14.8263C7.37506 14.8291 6.29663 14.5737 5.32081 14.0808L0.599609 15.6546L2.17334 10.9334C1.68046 9.95756 1.42504 8.87912 1.42789 7.7859C1.4284 6.47867 1.79284 5.1974 2.4804 4.08559C3.16797 2.97379 4.15149 2.07537 5.32081 1.49096C6.29663 0.998076 7.37506 0.742657 8.46828 0.745507H8.88243C10.6089 0.840753 12.2395 1.56945 13.4621 2.79207C14.6847 4.0147 15.4134 5.64533 15.5087 7.37176V7.7859Z" stroke="#2F2F2F" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </strong>
                                </Link>

                                <li to="" className="relative" >
                                    <span className="dropDown">
                                        <img src={displayPicture} onError={(e) => { e.target.src = "/assets/NoneProfile.png" }} className="rounded-full w-[26px] h-[26px] cursor-pointer" alt="" onMouseEnter={OpenDrom} />
                                    </span>

                                    {isOpen && (
                                        <div className="dropdown absolute right-0 w-[200px] rounded-lg top-12 dropdown_click z-10" onMouseLeave={hide}>
                                            <div className="bg-white text-black p-4 rounded-sm text-la">
                                                <ul className="flex flex-col gap-2">
                                                    <Link to="" onClick={() => showChatModal()} className="flex gap-1  hover:bg-gray-200 py-2 px-4"><img src={message} width="20" alt="" /> Messages</Link>
                                                    {/* <Link to="" className="flex gap-1 hover:bg-gray-200 py-2 px-4"><img src={saved} width="20" alt="" />Saved</Link> */}
                                                    <Link to="/mysession" className="flex gap-1 hover:bg-gray-200 py-2 px-4"><img src={calender} width="20" alt="" />My Sessions</Link>
                                                    <Link to="/settings" className="flex gap-1 hover:bg-gray-200 py-2 px-4"><img src={settings} width="20" alt="" />Settings</Link>
                                                    <Link onClick={(e) => {
                                                        e.preventDefault()
                                                        setModal(true)
                                                    }} to="/" className="flex gap-1 hover:bg-gray-200 py-2 px-4"><img src={log} width="20" alt="" />Log Out</Link>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            </ul> : <div className="hidden lg:block">
                                <Link to="/sign_in"><button className="sign_in_btn mr-3 sign">Sign In</button></Link> |
                                <Link to="/sign_up"> <button className="sign__in sign_up_btn ml-5">Sign Up</button></Link>
                            </div>}
                        </div>
                    </div>
                </nav>
            </header>
            {showModal ? <LogOutModal setModal={setModal} logOut={logOut} /> : null}
            {showMessageModal ? <ChatMessageModal setShowMessageModal={setShowMessageModal} /> : null}
            {deactivateStatus?.status ? <DeactivateModal deactivateStatus={deactivateStatus} /> : null}
        </>

    );
}


export default Header;