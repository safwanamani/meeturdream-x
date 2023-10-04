import React from 'react'
import { useEffect } from 'react'
import Header from '../../components/Header'
import api from '../../Api/GeneralApi'
import { useState } from 'react'
import Professioncard from '../Search/ProfessionCard'
import SkeltonAnimation from '../../components/SkeltonAnimation'
import FavouritesCard from './FavouritesCard'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsLoggedIn, setLoggedInValue, userDetailsFetch } from '../../features/redux/auth'
import DeactivateModal from '../Modals/DeactivateModal'
import { googleLogout } from '@react-oauth/google';
function FavouriteList() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const [favouriteProfessionalsData, setFavouriteProfessionalsData] = useState([])
    const [userAlreadyLogin, setUserAlreadyLogin] = useState({
        status: false,
        message: ""
    })
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
    function getFavouriteProfessionalsList() {
        api.getFavouriteList().then((data) => {
            if (data.status == true) {
                setFavouriteProfessionalsData(data.favourited)
            }

        })
            .catch((err) => {
                console.log('err', err)
            })
    }
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/sign_in")
        } else {
            let fcmToken = localStorage.getItem("fcmToken")
            let data = {
                device_token: fcmToken
            };
            api.CheckUserAlreadyLogin(data).then(res => {
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
            }).catch(err => {
                console.log(err)
            })
            getFavouriteProfessionalsList()
        }
    }, [])
    return (<>
        <Header screen="Favourites" />
        {favouriteProfessionalsData.length == 0 && <section className="no__data text-center">
            <div className="text-center py-10 flex justify-center">
                <div className="">
                    <svg width="136.795" height="139.387"><g data-name="Group 146" transform="translate(-64.456)"><circle data-name="Ellipse 161" cx="47.358" cy="47.358" r="47.358" transform="translate(96.534)" fill="#153D57"></circle><circle data-name="Ellipse 162" cx="39.096" cy="39.096" r="39.096" transform="translate(104.797 8.262)" opacity="0.05"></circle><circle data-name="Ellipse 163" cx="32.042" cy="32.042" r="32.042" transform="translate(111.85 15.316)" opacity="0.05"></circle><circle data-name="Ellipse 164" cx="22.974" cy="22.974" r="22.974" transform="translate(120.918 24.384)" opacity="0.05"></circle><path data-name="Path 630" d="M67.653 51.596s-3.723 10.48-2.069 14.2a46.238 46.238 0 004.275 7.309s-.965-20.819-2.206-21.509z" fill="#d0cde1"></path><path data-name="Path 631" d="M67.653 51.596s-3.723 10.48-2.069 14.2a46.238 46.238 0 004.275 7.309s-.965-20.819-2.206-21.509z" opacity="0.1"></path><path data-name="Path 632" d="M70.273 75.867a22.35 22.35 0 01-.414 2.758c-.138.138.138.414 0 .827s-.276.965 0 1.1-1.517 12.273-1.517 12.273-4.413 5.792-2.62 14.893l.552 9.239s4.275.276 4.275-1.241a25.264 25.264 0 01-.276-2.62c0-.827.689-.827.276-1.241s-.414-.689-.414-.689.689-.552.552-.69 1.241-9.929 1.241-9.929 1.517-1.517 1.517-2.344v-.827s.689-1.793.689-1.931 3.723-8.55 3.723-8.55l1.517 6.068 1.655 8.688s.827 7.86 2.482 10.894c0 0 2.9 9.929 2.9 9.653s4.826-.965 4.689-2.206-2.9-18.617-2.9-18.617l.692-25.784z" fill="#2f2e41"></path><path data-name="Path 633" d="M66.55 116.273s-3.723 7.309-1.241 7.585 3.448.276 4.551-.827a18.354 18.354 0 012.808-2.022 3.631 3.631 0 001.724-3.455c-.073-.675-.325-1.231-.945-1.282a8.47 8.47 0 01-3.585-1.655z" fill="#2f2e41"></path><path data-name="Path 634" d="M87.097 121.649s-3.723 7.309-1.241 7.585 3.448.276 4.551-.827a18.356 18.356 0 012.808-2.022 3.631 3.631 0 001.723-3.453c-.073-.675-.325-1.231-.945-1.282a8.472 8.472 0 01-3.585-1.655z" fill="#2f2e41"></path><circle data-name="Ellipse 165" cx="5.797" cy="5.797" r="5.797" transform="translate(77.365 28.042)" fill="#ffb8b8"></circle><path data-name="Path 635" d="M79.436 35.743s-4.141 7.619-4.472 7.619 7.453 2.484 7.453 2.484 2.153-7.287 2.484-7.95z" fill="#ffb8b8"></path><path data-name="Path 636" d="M85.788 44.081s-8.274-4.551-9.1-4.413-9.653 7.86-9.515 11.032a68.162 68.162 0 001.241 8.412s.414 14.617 1.241 14.755-.138 2.62.138 2.62 19.306 0 19.444-.414-3.449-31.992-3.449-31.992z" fill="#d0cde1"></path><path data-name="Path 637" d="M90.407 76.832s2.62 8 .414 7.722-3.172-6.895-3.172-6.895z" fill="#ffb8b8"></path><path data-name="Path 638" d="M83.374 43.598s-5.1 1.1-4.275 8 2.344 13.79 2.344 13.79l5.1 11.17.552 2.069 3.723-.965-2.758-16s-.965-17.1-2.206-17.651a5.341 5.341 0 00-2.48-.413z" fill="#d0cde1"></path><path data-name="Path 639" d="M80.271 65.182l6.343 11.308-5.343-11.918z" opacity="0.1"></path><path data-name="Path 640" d="M88.937 32.132l.019-.443.881.219a.985.985 0 00-.395-.725l.939-.052a10.128 10.128 0 00-6.774-4.186 6.47 6.47 0 00-5.683 1.638 6.85 6.85 0 00-1.4 2.609c-.556 1.746-.669 3.828.49 5.248 1.178 1.443 3.236 1.725 5.09 1.9a4.019 4.019 0 001.941-.132 4.668 4.668 0 00-.26-2.048 1.365 1.365 0 01-.138-.652c.082-.552.818-.691 1.371-.616s1.217.189 1.58-.235a1.878 1.878 0 00.269-1.1c.085-1.035 2.057-1.206 2.07-1.425z" fill="#153D57">
                    </path></g></svg>
                </div>
            </div>
            <h2 className="text-sm font-medium text-gray-500">No Result Found</h2>
        </section>}

        {favouriteProfessionalsData.length > 0 && <section className="">
            <div className="container mx-auto py-6 lg:px-20 xl:max-w-[1300px]">
                <h2 className="text-xl font-bold inline-flex items-center cursor-pointer">
                    {favouriteProfessionalsData.length}{' '}saved
                </h2>

                {favouriteProfessionalsData.length > 0 ? favouriteProfessionalsData.map((items, index) => (
                    <FavouritesCard items={items} key={index} getProfessionals={getFavouriteProfessionalsList} />
                )) :
                    <SkeltonAnimation />
                }

            </div>
        </section>}
        {userAlreadyLogin.status && <DeactivateModal deactivateStatus={userAlreadyLogin} />}
    </>

    )
}

export default FavouriteList