import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import api from "../../Api/GeneralApi";
import { Link, useNavigate } from "react-router-dom";
import MyAccount from "./My-Account";
import Payment from "./Payment";
import Settings from "./Settings";
import PaymentHistory from "./PaymentHistory";
import MyProfile from "./My-Profile";
import EditProfile from "./EditProfile";
import { FiInfo } from "react-icons/fi";
import Calender from "./Calender";
import ManageSlot from "./ManageSlot";
import BudgetDuration from "./BudgetDuration";
import { getUserDetails, selectIsLoggedIn, setLoggedInValue, userDetailsFetch } from "../../features/redux/auth";
import ReferralsAndRewards from "./ReferralsAndRewards";
import DeactivateModal from "../Modals/DeactivateModal";
import { googleLogout } from '@react-oauth/google';
const SettingsLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const userDetails = useSelector(getUserDetails);
  const emailToSentOtp = userDetails.email
  const [settingSelected, setSettingSelected] = useState("My Account");
  const [userAlreadyLogin, setUserAlreadyLogin] = useState({
    status: false,
    message: ""
  })
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    image_url: "",
    category: "",
    subCategory: "",
    base_rate: "",
    work_experience: "",
    description: "",
    language_list: [],
    intro_video: "",
    educations: [],
    certificates: [],
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
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign_in")
    }
    api.getMyProfile().then(data => {
      let profileData = data.data;
      let socialLogin = false;
      if (profileData?.facebook_id === true || profileData?.google_id === true || profileData?.apple_id === true) {
        socialLogin = true;
      }
      setProfileDetails((prevValue) => ({
        ...prevValue,
        name: profileData.name,
        image_url: profileData.profile_image,
        professional_id: profileData.professionalId,
        category: profileData.category,
        subCategory: profileData.subCategory,
        base_rate: profileData.base_rate,
        work_experience: profileData.work_experience,
        description: profileData.description,
        language_list: profileData.language_list,
        intro_video: profileData.intro_vedio,
        educations: profileData.education_certificates,
        certificates: profileData.certification_certificates,
        customSlots: profileData.customSlots,
        predefindSlots: profileData.predefindSlots,
        socialLogin: socialLogin
      }))
    })
  }, [])
  useEffect(() => {
    if (isLoggedIn) {
      let fcmToken = localStorage.getItem("fcmToken")
      let data = {
        device_token: fcmToken
      }
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
          googleLogout();
          window.FB.getLoginStatus(function (response) {
            window.FB.logout(function (response) {
              console.log("Logout")
            });
          });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }, [settingSelected])
  return (
    <>
      <Header screen="" />
      <section className="pb-10 settings_page">
        <div className="container mx-auto p-4">
          {/* <div className="max-w-[960px] lg:flex justify-between mx-auto p-4 mb-5 bg-[#F7F7F7] rounded-lg border-2">
            <p className="lg:flex items-center gap-1">
              <i>
                <FiInfo color="red" />
              </i>
              link we sent to{' '}
              <b>{emailToSentOtp}</b>
            </p>
            <span className="uppercase text-green-500 font-semibold">
              Resend Confirmation
            </span>
          </div> */}

          <div className="lg:flex md:flex max-w-[960px] mx-auto gap-10">
            <div className="lg:w-[250px] md:w-[250px] sm:py-4 py-4 lg:py-0 md:py-0">
              <div className="side__nav lg:flex md:flex lg:flex-col md:flex-col whitespace-nowrap overflow-auto sm:py-4 py-4 md:py-0 lg:py-0">
                <Link
                  to=""
                  onClick={() => setSettingSelected("My Account")}
                  className={`item ${settingSelected === "My Account" ? "active" : "inactive"
                    }`}
                >
                  My Account
                </Link>
                {userDetails.is_professional === 1 ? (
                  <>
                    <Link
                      to=""
                      onClick={() => setSettingSelected("My Profile")}
                      className={`item ${settingSelected === "My Profile"
                        ? "active"
                        : settingSelected === "Edit Profile"
                          ? "active"
                          : "inactive"
                        }`}
                    >
                      My Profile
                    </Link>
                    <Link
                      to=""
                      onClick={() => setSettingSelected("Manage Your Slot")}
                      className={`item ${settingSelected === "Manage Your Slot"
                        ? "active"
                        : "inactive"
                        }`}
                    >
                      Manage Your Slot
                    </Link>
                  </>
                ) : null}
                <Link
                  to=""
                  onClick={() => setSettingSelected("Calender")}
                  className={`item ${settingSelected === "Calender" ? "active" : "inactive"
                    }`}
                >
                  Calender
                </Link>
                <Link
                  to=""
                  onClick={() => setSettingSelected("Payment")}
                  className={`item ${settingSelected === "Payment" ? "active" : "inactive"
                    }`}
                >
                  Payment
                </Link>
                <Link
                  to=""
                  onClick={() => setSettingSelected("Payment History")}
                  className={`item ${settingSelected === "Payment History"
                    ? "active"
                    : "inactive"
                    }`}
                >
                  Payment History
                </Link>
                <Link
                  to=""
                  onClick={() => setSettingSelected("Referrals & Rewards")}
                  className={`item ${settingSelected === "Referrals & Rewards"
                    ? "active"
                    : "inactive"
                    }`}
                >
                  Referrals & Rewards
                </Link>
                {userDetails.is_professional === 1 ? (
                  <>
                    <Link
                      to=""
                      onClick={() => setSettingSelected("Budget & Duration")}
                      className={`item ${settingSelected === "Budget & Duration"
                        ? "active"
                        : "inactive"
                        }`}
                    >
                      Budget & Duration
                    </Link>
                  </>) : null}
                < Link
                  to=""
                  onClick={() => setSettingSelected("Settings")}
                  className={`item ${settingSelected === "Settings" ? "active" : "inactive"
                    }`}
                >
                  Settings
                </Link>
              </div>
            </div>

            <div className="nav__content w-full">
              {settingSelected === "My Account" && <MyAccount setProfilesDetails={setProfileDetails} />}
              {settingSelected === "Payment" && <Payment />}
              {settingSelected === "Settings" && <Settings profileDetails={profileDetails} setProfileDetails={setProfileDetails} />}
              {settingSelected === "Payment History" && <PaymentHistory />}
              {settingSelected === "My Profile" && (
                <MyProfile setSettingSelected={setSettingSelected} profileDetails={profileDetails} setProfileDetails={setProfileDetails} />
              )}
              {settingSelected === "Edit Profile" && <EditProfile profileDetails={profileDetails} setProfileDetails={setProfileDetails} setSettingSelected={setSettingSelected} />}
              {settingSelected === "Calender" && <Calender />}
              {settingSelected === "Budget & Duration" && <BudgetDuration />}
              {settingSelected === "Manage Your Slot" && <ManageSlot profileDetails={profileDetails} setProfileDetails={setProfileDetails} />}
              {settingSelected === "Referrals & Rewards" && <ReferralsAndRewards />}
            </div>
          </div>
        </div>
      </section >
      {userAlreadyLogin.status && <DeactivateModal deactivateStatus={userAlreadyLogin} />}
    </>
  );
};

export default SettingsLayout;
