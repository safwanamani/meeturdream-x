import React from "react";
import { useState, useEffect } from "react";
import image1 from "../../assets/about.png";
import { FaUser } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { GiChoice } from "react-icons/gi";
import GetStart from "./GetStart";
import { Link, useNavigate } from 'react-router-dom'
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, setLoggedInValue, userDetailsFetch } from "../../features/redux/auth";
import api from "../../Api/GeneralApi";
import DeactivateModal from "../Modals/DeactivateModal";
import { googleLogout } from '@react-oauth/google';
// import api from '../../Api/Api';
// import { data } from "autoprefixer";


const Index = () => {

  const navigate = useNavigate()
  const [id, setId] = useState("");
  const [punch, setPunch] = useState("")
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const [userAlreadyLogin, setUserAlreadyLogin] = useState({
    status: false,
    message: ""
  })
  const dispatch = useDispatch()

  /*  useEffect(() => {
      getData();
    }, [id]);
    */

  // const getData=()=>{
  //   console.log("inside get data")
  //   let data={
  //     username:"nazeercsinfo@gmail.com",
  //     password:"12345678"
  //   }
  //   api
  //   .getJokes()
  //   .then((result) => {
  //     console.log("api response",result.data)
  //     setId(result.data.id);
  //     setPunch(result.data.punchline);

  //   })
  //   .catch((err) => {
  //     console.log("api error  response",err)
  //   });

  // }
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
    var scrollTop = function () {
      window.scrollTo(0, 0);
    };
    scrollTop()
    if (isLoggedIn) {
      let fcmToken = localStorage.getItem("fcmToken")
      let data = {
        device_token: fcmToken
      }
      api.CheckUserAlreadyLogin(data).then((res) => {
        if (res.data.status) {
          setUserAlreadyLogin({
            status: res.data.login_status,
            message: res.data.message
          })
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
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }, [])
  return (
    <>
      {/* main-top*/}
      <Header screen="Home" />
      <section className="bg_gray">
        <div className="container mx-auto pt-24 px-6 lg:px-0">
          <div className="lg:flex items-center">
            <div className="lg:w-1/2">
              <div className="justify-center">
                <h5 className="uppercase lg:mb-4 mb-2 text-md font-semibold primary">OUR WISHES ARE NOW A CLICK AWAY</h5>
                <h1 className="text-4xl lg:text-6xl xl:text-6xl sm:text-6xl font-bold capitalize">Earn by fulfilling others
                  <span style={{ color: "#F4B319" }}> dreams</span></h1>
                <p className="text-lg lg:mt-5 mt-2">You can now earn money from the comfort of your own home with the MEETURDREAM application.</p>
                <Link to="/profession-signup">
                  <button
                    className="btn_primary rounded-full mt-5">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="justify-center max-w-xl mx-auto">
                <img src={image1} alt="" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* user*/}
      <section className="pb-24">
        <div className="container mx-auto pt-24 px-6 lg:px-0">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-10">
            <div className="shadow-md min-h-[250px]">
              <div className="p-10 rounded-xl">
                <div className="bg-orange-600 inline-block p-4 rounded text-white">
                  <FaUserTie size={25} />
                </div>
                <h2 className="mt-5 text-lg font-semibold mb-2">Register</h2>
                <p className="mb-8">Register online with your details.</p>
              </div>
            </div>
            <div className="shadow-md min-h-[250px]">
              <div className="p-10 rounded-xl">
                <div className="bg-green-600 inline-block p-4 rounded text-white">
                  <GiChoice size={25} />
                </div>
                <h2 className="mt-5 text-lg font-semibold mb-2">  Fee of your choice</h2>
                <p className="mb-8">Charge a fee of your choice.</p>
              </div>
            </div>

            <div className="shadow-md min-h-[250px]">
              <div className="p-10 rounded-xl">
                <div className="bg-blue-600 inline-block p-4 rounded text-white">
                  <SiGooglemeet size={25} />
                </div>
                <h2 className="mt-5 text-lg font-semibold mb-2">Meet</h2>
                <p className="mb-8">Earn by meeting your clients and fans online.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <GetStart />
      {userAlreadyLogin.status && <DeactivateModal deactivateStatus={userAlreadyLogin} />}
    </>
  );
};

export default Index;
