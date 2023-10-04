import api from "../../Api/GeneralApi"
import api_forget from "../../Api/AuthApi"
import React, { useState, useRef, useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import ProcessingButton from "../Settings/components/ProcessingButton";
import { setLoggedInValue } from "../../features/redux/auth";
import { userDetailsFetch } from "../../features/redux/auth";
import { googleLogout } from "@react-oauth/google";

const Settings = ({ profileDetails }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordEye, setOldPasswordEye] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordEye, setPasswordEye] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false)
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorConfirmPasswordText, setErrorConfirmPasswordText] = useState("")
  const [errorOldPassword, setErrorOldPassword] = useState(false)
  const [errorOldpasswordText, setErrorOldPasswordText] = useState("")
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorPasswordText, setErrorPasswordText] = useState("")
  const [schedulingEnable, setSchedulingEnable] = useState()
  const [generalRemindersEnable, setGeneralRemindersEnable] = useState()
  const [profileVerifiedEnable, setProfileVerifiedEnable] = useState()
  const [profileApprovalEnable, setProfileApprovalEnable] = useState()
  const [reviewEnable, setReviewEnable] = useState()
  const [autoconfirmationenable, setAutoconfirmationEnable] = useState()
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
    api.getNotification().then((data) => {
      setGeneralRemindersEnable(!!data.settings_data.general_notificatin)
      setSchedulingEnable(!!data.settings_data.booking_notification)
      setAutoconfirmationEnable(!!data.settings_data.autoconfirmation)
      setProfileVerifiedEnable(!!data.settings_data.profile_verified)
      setProfileApprovalEnable(!!data.settings_data.profile_approval)
      setReviewEnable(!!data.settings_data.review)
    }).catch((err) => {
      console.log('err', err)
    })
  }, [])
  function onChangeNotification(e, type) {
    if (type == 'general_notificatin') {
      setGeneralRemindersEnable(e.target.checked)
    } else if (type == 'booking_notification') {
      setSchedulingEnable(e.target.checked)
    }
    api.changeNotificationSettings({ type: type, value: e.target.checked == true ? 1 : 0 }).then((data) => {
      if (data.status === false) {
        toast.current.show({ severity: "error", summary: "Error", detail: data.message })
      }
    }).catch((err) => {
      toast.current.show({ severity: "error", summary: "Error", detail: "Sorry, something went wrong" })
      console.log('err', err)
    })

  }
  function onChangeAutoonfirmationSettings(e) {
    setAutoconfirmationEnable(!autoconfirmationenable)
    api.changeNotificationSettings({ type: "autoconfirmation", value: e.target.defaultValue == 'auto' ? 1 : 0 }).then((data) => {
    }).catch((err) => {
      console.log('err', err)
    })

  }
  const [submitStatus, setSubmitStatus] = useState(false);
  const [passwordSetting, setPasswordSetting] = useState(false)
  const toast = useRef(null);
  const dispatch = useDispatch();

  const showPassword = (passwordType) => {
    if (passwordType === "normal") {
      let signUpPassword = document.getElementById("signUpPassword");
      if (signUpPassword.type === "password") {
        setPasswordEye(true)
        signUpPassword.type = "text";
      } else {
        setPasswordEye(false)
        signUpPassword.type = "password";
      }
    } else if (passwordType === "confirm") {
      let signUpConfirmPassword = document.getElementById("signUpConfirmPassword");
      if (signUpConfirmPassword.type === "password") {
        setConfirmPasswordEye(true)
        signUpConfirmPassword.type = "text";
      } else {
        setConfirmPasswordEye(false)
        signUpConfirmPassword.type = "password";
      }
    } else if (passwordType === "old") {
      let signUpOldPassword = document.getElementById("signUpOldPassword");
      if (signUpOldPassword.type === "password") {
        setOldPasswordEye(true)
        signUpOldPassword.type = "text";
      } else {
        setOldPasswordEye(false)
        signUpOldPassword.type = "password";
      }
    }
  };

  const checkPassword = (value, type) => {
    if (type === "normal") {
      console.log("value", value.length)
      if (value.length < 8) {
        setErrorPassword(true)
        setErrorPasswordText("Minimum 8 characters required")
      }
      if (confirmPassword) {
        if (confirmPassword !== value) {
          setErrorConfirmPassword(true)
          setErrorConfirmPasswordText("Password and Confirm Password does not match")
        } else {
          setErrorConfirmPassword(false)
        }
      }
      if (oldPassword) {
        if (oldPassword === value) {
          setErrorOldPassword(true)
          setErrorOldPasswordText("Password and old password is matching")
        } else {
          setErrorOldPassword(false)
        }
      }
    } else if (type === "confirm") {
      if (password) {
        if (password !== value) {
          setErrorConfirmPassword(true)
          setErrorConfirmPasswordText("Password and Confirm Password does not match")
        } else {
          setErrorConfirmPassword(false)
        }
      } else {
        setErrorPassword(true)
        setErrorPasswordText("Password is required")
      }
    }
    if (!value) {
      setErrorOldPassword(false)
      setErrorPassword(false)
      setErrorConfirmPassword(false)
    }
  }

  const passwordReset = (e) => {
    e.preventDefault();
    if (oldPassword === "") {
      setErrorOldPassword(true);
      setErrorOldPasswordText("Old password is required");
    }
    if (password === "") {
      setErrorPassword(true)
      setErrorPasswordText("Password is required");
    } else if (password.length < 8) {
      setErrorPassword(true)
      setErrorPasswordText("Minimum 8 characters required")
    }
    if (confirmPassword === "") {
      setErrorConfirmPassword(true);
      setErrorConfirmPasswordText("Confirm password is required");
    }
    if (oldPassword !== "" && password !== "" && confirmPassword !== "" && password.length >= 8 && oldPassword !== password && password === confirmPassword) {
      setSubmitStatus(true)
      api_forget
        .resetPassword({ old_password: oldPassword, new_password: password, new_password_confirmation: confirmPassword })
        .then( async (data) => {
          if (data.status == true) {
            // await api.userLogout().then(data => {
            //   if (data.status) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
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
                    })
                  })
    
                }, 1000)
            //   } else {
            //     toast.current.show({ severity: 'error', summary: 'Error', detail: data.message });
            //     setTimeout(() => {
            //       setSubmitStatus(false)
            //     }, 1000)
            //   }
            // }).catch(err => {
            //   console.log("api error  response", err)
            // })

          } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: data.message });
          }
        })
        .catch((err) => {
          console.log("api error  response", err);
        });
    }
  }

  const handlePasswordSetting = () => {
    setPasswordSetting(false)
  }

  return (
    <>
      <Toast ref={toast}></Toast>
      {profileDetails?.socialLogin === false && (
        <div className="box__wrap w-full">
          <div className=" w-full flex justify-between">
            <div className="flex items-start w-full">
              {passwordSetting ? (<div className="w-full flex justify-between items-center">
                <div className="pt-1 flex">
                  <BsCheckCircleFill size={26} color="green" className="" />
                  <h2 className="text-lg font-semibold pl-2">Password has been set</h2>
                </div>

                <div className="flex-none border-2 cursor-pointer border-gray-800 rounded-full h-8 w-8 flex justify-center items-center">
                  <MdEdit onClick={() => handlePasswordSetting()} />
                </div>
              </div>) : (<div className="w-full"><h2 className="title">Password</h2> <div className="w-full">
                <div className="form-group  w-full">
                  <label htmlFor="">Old Password <span className="text-red-500">*</span></label>
                  <input
                    id="signUpOldPassword"
                    type="password"
                    className="form-control form-control-settings"
                    placeholder="Old Password"
                    onChange={(e) => {
                      setErrorOldPassword(false);
                      setOldPassword(e.target.value);
                      checkPassword(e.target.value, "old");
                    }}
                  />
                  <i
                    className={`far ${oldPasswordEye ? "fa-eye" : "fa-eye-slash"}`}
                    id="togglePassword"
                    style={{ marginLeft: "-30px", cursor: "pointer" }}
                    onClick={() => showPassword("old")}
                  ></i>
                  {errorOldPassword ? (
                    <p className="text-red-500 text-sm">
                      {errorOldpasswordText}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-start w-full gap-2">
                  <div className="form-group w-full">
                    <label htmlFor="">New Password <span className="text-red-500">*</span></label>
                    <input
                      id="signUpPassword"
                      type="password"
                      className="form-control form-control-settings"
                      placeholder="New Password"
                      onChange={(e) => {
                        setErrorPassword(false);
                        setPassword(e.target.value);
                        checkPassword(e.target.value, "normal");
                      }}
                    />
                    <i
                      className={`far ${passwordEye ? "fa-eye" : "fa-eye-slash"}`}
                      id="togglePassword"
                      style={{ marginLeft: "-30px", cursor: "pointer" }}
                      onClick={() => showPassword("normal")}
                    ></i>
                    {errorPassword ? (
                      <p className="text-red-500 text-sm">
                        {errorPasswordText}
                      </p>
                    ) : null}
                  </div>
                  <div className="form-group w-full">
                    <label htmlFor="">Confirm Password <span className="text-red-500">*</span></label>
                    <input
                      id="signUpConfirmPassword"
                      type="password"
                      className="form-control form-control-settings"
                      placeholder="Confirm Password"
                      onChange={(e) => {
                        setErrorConfirmPassword(false);
                        setConfirmPassword(e.target.value);
                        checkPassword(e.target.value, "confirm");
                      }}
                    />
                    <i
                      className={`far ${confirmPasswordEye ? "fa-eye" : "fa-eye-slash"}`}
                      id="toggleConfirmPassword"
                      style={{ marginLeft: "-30px", cursor: "pointer" }}
                      onClick={() => showPassword("confirm")}
                    ></i>
                    {errorConfirmPassword ? (
                      <p className="text-red-500 text-sm">
                        {errorConfirmPasswordText}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex w-28 justify-end">
                  {submitStatus ? (
                    <ProcessingButton />
                  ) : <button className="btn_primary bg_primary rounded-sm mt-3 py-3 text-white" onClick={(e) => passwordReset(e)}>
                    Submit
                  </button>}
                </div>
              </div>
              </div>)}
            </div>
          </div>
        </div>
      )}

      <div className="box__wrap w-full mt-3">
        <h2 className="title">Notification</h2>
        <h3 className="text-gray-600 pb-4">Email Notification</h3>

        <div className="flex justify-between items-center border-b-2 pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">Scheduling</h2>
            <p>Alert about new sessions and schedule changes</p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" onClick={(e) => onChangeNotification(e, "booking_notification")} defaultChecked={schedulingEnable} />
          </span>

        </div>

        <div className="flex justify-between items-center border-b-2 pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">General reminders</h2>
            <p>Notification about sessions, professional messages</p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" onClick={(e) => onChangeNotification(e, "general_notificatin")} defaultChecked={generalRemindersEnable} />
          </span>
        </div>
        <div className="flex justify-between items-center border-b-2 pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">Profile Verified</h2>
            <p>Alert when the profile is verified</p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" onClick={(e) => onChangeNotification(e, "profile_verified")} defaultChecked={profileVerifiedEnable} />
          </span>
        </div>
        <div className="flex justify-between items-center border-b-2 pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">Profile Approval</h2>
            <p>Show notification when profile is approval</p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" onClick={(e) => onChangeNotification(e, "profile_approval")} defaultChecked={profileApprovalEnable} />
          </span>
        </div>
        <div className="flex justify-between items-center border-b-2 pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">Review</h2>
            <p>Show notifications for every user review added</p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" onClick={(e) => onChangeNotification(e, "review")} defaultChecked={reviewEnable} />
          </span>
        </div>
        {/* <div className="flex justify-between items-center border-b-2 pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">Updates , tips and offers</h2>
            <p>
              Stay connect with product updates, helpful tips and special offers
            </p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" height="" />
          </span>
        </div> */}
        {/* <div className="flex justify-between items-center border-b-2 pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">Meet UR Dream Blog</h2>
            <p>occasional newsletter with the latest posts</p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" />
          </span>
        </div> */}
        {/* <div className="flex justify-between items-center pb-3 mb-3">
          <div className="">
            <h2 className="text-md font-semibold">Q&A section</h2>
            <p>Receive professional replies to your question</p>
          </div>
          <span>
            <input type="checkbox" className="h-6 w-6" />
          </span>
        </div> */}
      </div>

      <div className="box__wrap w-full mt-3">
        <h2 className="title">Autoconfirmation</h2>
        <p className="indent-8">
          All sessions will be confirmed automatically 2 hours after the
          scheduled end time unless you report an issue. Choose automatic
          confirmation if you trust your tutors and there are no issues with
          scheduling sessions through the Meet UR Dream Calendar.
        </p>
        <div className="flex items-center gap-2 py-5">
          <input type="radio" className="h-6 w-6" name="autoconfirmation" onChange={(e) => onChangeAutoonfirmationSettings(e)} value="manual" defaultChecked={!autoconfirmationenable} checked={autoconfirmationenable == false} />
          <p>I want to confirm each sessions manually </p>
        </div>
        <div className="flex items-center gap-2 pb-5">
          <input type="radio" className="h-6 w-6" name="autoconfirmation" onChange={(e) => onChangeAutoonfirmationSettings(e)} value="auto" defaultChecked={autoconfirmationenable} checked={autoconfirmationenable == true} />
          <p>I want to confirm each sessions automatically </p>
        </div>
        <p className="indent-8">
          Autoconfirmation for sessions in the Meet UR Dream Space Autoconfirm tracks
          the time you spend connected with your tutor in the Meet UR Dream Space. 15
          minutes after a sessions is completed, it is confirmed automatically
          and we release your tutor's payment. If there are any issues, please
          contact us right after the sessions and we'll help you find a
          solution.
        </p>
      </div>
    </>
  );
};

export default Settings;
