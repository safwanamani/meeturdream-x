import React, { useState, useEffect, useRef } from "react";
import api from "../../Api/GeneralApi";
import authApi from "../../Api/AuthApi";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, userDetailsFetch, setLoggedInValue } from "../../features/redux/auth";
import { FiCopy, FiShare2 } from "react-icons/fi";
import { time } from "../Professional-Signup/time";
import { useNavigate } from "react-router-dom";
import { RWebShare } from "react-web-share";
import SmallCommonModal from "../Modals/SmallCommonModal";
import { googleLogout } from "@react-oauth/google";
import google from "../../assets/social-connect/google.png";
import facebook from "../../assets/social-connect/facebook.png";
const MyAccount = ({ setProfilesDetails }) => {
  const toast = useRef(null);
  let userDetails = useSelector(getUserDetails);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [showTooltipTitle, setShowTooltipTitle] = useState({
    status: false,
    message: ""
  })
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    phone: "",
    referral_id: "",
    image_url: "",
    profile_image: "",
    timezone: ""
  });
  const [errorName, setErrorName] = useState(false)
  const [errorPhone, setErrorPhone] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [removeProfile, setRemoveProfile] = useState(false)
  const [noneProfileStatus, setNoneProfileStatus] = useState(false)
  const [socialNetworkStatus, setSocialNetworkStatus] = useState({
    google: false,
    facebook: false,
    apple: false
  })
  const [disconnectSocialNetworkStatus, setDisconnectSocialNetworkStatus] = useState(false)
  const [disconnectSocialNetworkType, setDisconnectSocialNetworkType] = useState("")
  useEffect(() => {
    api.getMyProfile().then((data) => {
      let profileData = data.data;
      setNoneProfileStatus(profileData.profile_image_status)
      setProfileDetails((prevValue) => ({
        ...prevValue,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        referral_id: profileData.reference_code,
        image_url: profileData.profile_image,
        profile_image: "",
        timezone: profileData.time_zone
      }));
      setSocialNetworkStatus({
        google: profileData.google_id,
        facebook: profileData.facebook_id,
        apple: profileData.apple_id
      })
    });
  }, []);
  const onProfileChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      let number = Number(value)
      if (isNaN(number)) {
        setErrorPhone(true)
      }
      if (value.length < 10) {
        setErrorPhone(true)
      }
      if (!isNaN(number) && value.length >= 10) {
        setErrorPhone(false)
      }
    }
    if (name === "name") {
      if (value) {
        setErrorName(false)
      } else {
        setErrorName(true)
      }
    }
    setProfileDetails((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };
  const onImageChange = (e) => {
    const [file] = e.target.files;
    if (file != undefined) {
      setProfileDetails((prevValue) => ({
        ...prevValue,
        image_url: URL.createObjectURL(file),
        profile_image: e.target.files[0],
      }));
    }
  };
  const formSubmit = (e) => {
    e.preventDefault();
    let payload = {
      name: profileDetails.name,
      email: profileDetails.email,
      phone: profileDetails.phone,
      time_zone: profileDetails?.timezone
    };
    if (profileDetails.profile_image) {
      payload.profile_image = profileDetails.profile_image;
    }
    if (errorPhone === false && errorName === false) {
      api
        .editUserProfile(payload)
        .then((data) => {
          if (data.status == true) {
            if (profileDetails.profile_image) {
              userDetails = {
                ...userDetails,
                name: profileDetails.name,
                first_name: profileDetails.name,
                phone: profileDetails.phone,
                time_zone: profileDetails?.timezone,
                user_profile_detail: {
                  ...userDetails.user_profile_detail,
                  image_url: data.image,
                  thumb_image_url: data.image
                },
              };
              dispatch(userDetailsFetch(userDetails));
              setProfilesDetails((prevValue) => ({
                ...prevValue,
                image_url: data.image,
                thumb_image_url: data.image
              }));
              setNoneProfileStatus(true)
            } else {
              userDetails = {
                ...userDetails,
                name: profileDetails.name,
                first_name: profileDetails.name,
                phone: profileDetails.phone,
                time_zone: profileDetails?.timezone
              };
              dispatch(userDetailsFetch(userDetails));
            }
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: data.response,
              life: 3000,
            });
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: data.response,
            });
          }
        })
        .catch((err) => {
          console.log("server error response", err);
        });
    }
  };
  const copyClipBoard = () => {
    setShowTooltipTitle({
      status: true,
      message: "Code copied"
    })
    navigator.clipboard.writeText(profileDetails?.referral_id)
    setTimeout(() => {
      setShowTooltipTitle({
        status: false,
        message: ""
      })
    }, 2000)
  }
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
  const deleteAccount = () => {
    authApi.deleteAccount().then((data) => {
      if (data.status) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: data.message,
          life: 3000,
        });
        setTimeout(() => {
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
          window.history.pushState({}, null, "/sign_in")
          window.location.reload()
          googleLogout()
          window.FB.getLoginStatus(function (response) {
            window.FB.logout(function (response) {
              console.log("Logout")
            });
          });
        }, 1000)
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message,
        });
      }
    }).catch((err) => {
      console.log("server error response", err);
    })
  }
  const removeProfileImage = () => {
    api.removeProfileImage().then(({ data }) => {
      if (data.status) {
        setNoneProfileStatus(false)
        userDetails = {
          ...userDetails,
          user_profile_detail: {
            ...userDetails.user_profile_detail,
            image_url: data.non_profile_url ? data.non_profile_url : "https://admin.meeturdream.com/image/NoneProfile.png",
            thumb_image_url: data.non_profile_url ? data.non_profile_url : "https://admin.meeturdream.com/image/NoneProfile.png"
          }
        }
        dispatch(userDetailsFetch(userDetails));
        setProfileDetails((prevValue) => ({
          ...prevValue,
          image_url: data.non_profile_url ? data.non_profile_url : "https://admin.meeturdream.com/image/NoneProfile.png",
          thumb_image_url: data.non_profile_url ? data.non_profile_url : "https://admin.meeturdream.com/image/NoneProfile.png"
        }))
        document.getElementById("profile_image").value = "";
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: data.message,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message
        });
      }
    })
  }
  const DisconnectSocialNetworkModal = (type) => {
    setDisconnectSocialNetworkType(type)
    setDisconnectSocialNetworkStatus(true)
  }
  const DisconnectSocialNetwork = () => {
    let type = disconnectSocialNetworkType === "Google" ? "google_id" : "facebook_id"
    let socialObj = {...socialNetworkStatus}
    if (disconnectSocialNetworkType === "Google") {
      socialObj.google = false
    }
    if (disconnectSocialNetworkType  )
    setSocialNetworkStatus({
      google: false,
      facebook: false,
      apple: false
    })
    setDisconnectSocialNetworkStatus(false)
    authApi.disconnectSocialNetwork({
      type: type
    }).then((data) => {
      if (data.status) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: data.message,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message
        });
      }
    })
  }
  return (
    <div className="box__wrap w-full">
      <Toast ref={toast} />
      <h2 className="title">My Account</h2>
      <div className="relative">
        {showTooltipTitle.status ?
          <div className="absolute top-[-36px] right-0">
            <div className="bg-[#153D57] px-3 py-1 rounded-lg text-white tracking-wider z-40 text-sm">
              {showTooltipTitle.message}
            </div>
          </div> : ""
        }
        <div className="flex bg-[#f7f7f7] justify-between p-3 rounded-sm mb-3">
          <input className="cursor-pointer" defaultValue={profileDetails.referral_id} disabled />
          <div>
            <span className="mr-1">
              <button
                className="text-[#b9b9b9] capitalize cursor-pointer hover:text-[#153D57]"
                onClick={copyClipBoard}
              >
                <FiCopy className="my-auto text-xl" />
              </button>
            </span>
            <RWebShare
              data={{
                text: "With MEETURDREAM application, find your favorite professionals with just a click",
                url: `https://www.meeturdream.com/referral/${profileDetails?.referral_id}`,
                title: "MeetUrDream",
              }}
            >
              <span>
                <button
                  className="text-[#b9b9b9] capitalize cursor-pointer hover:text-[#153D57]"
                >
                  <FiShare2 className="my-auto text-xl" />
                </button>
              </span>
            </RWebShare>
          </div>

        </div>
      </div>

      <form action="">
        <div className="form-group">
          <label htmlFor="">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={profileDetails.name}
            onChange={onProfileChange}
          />
          {errorName ? <p className='text-red-500 text-sm'>Name is required</p> : ""}
        </div>
        <div className="form-group">
          <label htmlFor="">Email</label>
          <input
            type="text"
            className="form-control"
            name="email"
            value={profileDetails.email}
            onChange={onProfileChange}
            readOnly={true}
            disabled={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={profileDetails.phone}
            onChange={onProfileChange}
          />
          {errorPhone ? <p className='text-red-500 text-sm'>Please enter a valid phone number</p> : ""}
        </div>
        <div className="form-group">
          <label htmlFor="">Time Zone</label>
          <Dropdown
            className="w-full bg-[#f7f7f7]"
            value={profileDetails.timezone}
            options={time}
            onChange={onProfileChange}
            name="timezone"
            optionLabel="name"
            filter
            showClear
            filterBy="name"
            placeholder="Select Time Zone"
            style={
              { background: "#f7f7f7", border: "none", shadow: "none" }
            }
          />
        </div>
        <h2 className="text-md pb-4 mt-4 font-semibold">Profile image</h2>
        <div className="sm:flex items-center gap-4">
          <div className="mb-4 sm:mb-0 w-[80px] h-[80px] rounded-full">
            <img
              src={profileDetails.image_url}
              alt=""
              onError={(e) => {
                e.target.src = "/assets/NoneProfile.png";
              }}
              className="rounded-full img-responsive object-cover"
            />
          </div>
          <div>
            <input className="" id="profile_image" type="file" onChange={onImageChange} accept="image/*" />
            <p className="pt-2 text-sm text-gray-500">
              JPG or PNG Format Maximum 5 MB
            </p>
            {noneProfileStatus}
            {userDetails.is_professional === 0 && noneProfileStatus ? (
              <button className="bg-red-500 hover:bg-red-600 text-white rounded-md px-2 py-1 text-[11px]"
                onClick={e => {
                  e.preventDefault()
                  setRemoveProfile(true)
                }}>Remove</button>
            ) : null}
          </div>
        </div>

        <h2 className="text-md pb-4 mt-4 font-semibold">Social Network</h2>
        <div>
          <div className="flex mb-2">
            <div>
              <img src={google} alt="" className="h-[35px]" />
            </div>
            <div className="ml-2 my-auto">
              {socialNetworkStatus.google ? (
                <>
                  <p className="text-[13px]">Connected as {profileDetails.name}</p>
                  {/* <p className="text-[11px] text-red-500 cursor-pointer" onClick={() => DisconnectSocialNetworkModal("Google")}>Disconnect</p> */}
                </>
              ) : (
                <>
                  <p className="text-[13px]">Not Connected to Google Account</p>
                  {/* <p className="text-[11px] text-blue-500 cursor-pointer">Connect</p> */}
                </>
              )}
            </div>
          </div>
          <div className="flex">
            <div>
              <img src={facebook} alt="" className="h-[35px]" />
            </div>
            <div className="ml-2 my-auto">
              {socialNetworkStatus.facebook ? (
                <>
                  <p className="text-[13px]">Connected as {profileDetails.name}</p>
                  {/* <p className="text-[11px] text-red-500 cursor-pointer" onClick={() => DisconnectSocialNetworkModal("Facebook")}>Disconnect</p> */}
                </>
              ) : (
                <>
                  <p className="text-[13px]">Not Connected to Facebook Account</p>
                  {/* <p className="text-[11px] text-blue-500 cursor-pointer">Connect</p> */}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 justify-end flex">
          <button
            className="btn_danger text-lg mr-4 text-white rounded-md"
            onClick={e => {
              e.preventDefault()
              setDeleteModal(true)
            }}
          >
            Delete account
          </button>
          <button
            className="btn_primary bg_primary  text-lg text-white rounded-md"
            onClick={formSubmit}
          >
            Submit
          </button>
        </div>
      </form>
      {deleteModal ? <SmallCommonModal
        bodyText="Are you sure you want to delete account?"
        setModal={setDeleteModal}
        submitFunction={deleteAccount}
      /> : null}
      {removeProfile ? <SmallCommonModal
        bodyText="Are you sure you want to remove profile image?"
        setModal={setRemoveProfile}
        submitFunction={removeProfileImage}
      /> : null}
      {disconnectSocialNetworkStatus ? <SmallCommonModal
        bodyText={disconnectSocialNetworkType === "Google" ? "Are you sure you want to disconnect your Google Account?" : "Are you sure you want to disconnect your Facebook Account?"}
        setModal={setDisconnectSocialNetworkStatus}
        submitFunction={DisconnectSocialNetwork}
      /> : null}

    </div>
  );
};

export default MyAccount;
