import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import facebook from "../../assets/facebook.png";
import api from "../../Api/AuthApi";
import { useNavigate } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { gapi } from "gapi-script";
import { Toast } from "primereact/toast"
import {
  setRegisteredMailAddress,
  userDetailsFetch,
  setLoggedInValue,
  selectIsLoggedIn,
} from "../../features/redux/auth";

import { useDispatch, useSelector } from "react-redux";
import ProcessingButton from "../Settings/components/ProcessingButton";
import Otp from "../otp/otp";
import { useGoogleLogin } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import { getMessaging, getToken } from "firebase/messaging";
import moment from "moment-timezone";
// import { useHistory } from "react-router-dom";
const Sign__up = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const toast = useRef(null)
  const [googleSignToken, setGoogleSignToken] = useState()
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordEye, setPasswordEye] = useState(false);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false)
  const [email, setEmail] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorPasswordText, setErrorPasswordText] = useState("")
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorConfirmPasswordText, setErrorConfirmPasswordText] = useState("")
  const [errorEmail, setErrorEmail] = useState(false);
  const [termsOfServiceSelected, setTermsOfServiceSelected] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [timer, setTimer] = useState(false);
  const [timerOld, setTimerOld] = useState(0);
  const [otpShowTime, setOtpShowTime] = useState(false)
  const [fcmToken, setFCMToken] = useState("");
  const [runTimer, setRunTimer] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [timeZone, setTimeZone] = useState("")
  const seconds = String(countDown % 60).padStart(2, 0);
  const minute = String(Math.floor(countDown / 60)).padStart(2, 0);
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
  const getLocation = () => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude)
      })
    }
    let time_zone = moment.tz.guess();
    setTimeZone(time_zone)
  }
  useEffect(() => {
    getLocation()
    const messaging = getMessaging();
    getToken(messaging, {
      vapidKey: "BgmlR"
    }).then((currentToken) => {
      if (currentToken) {
        setFCMToken(currentToken)
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    }).catch((err) => {
      console.log("An error occurred while retrieving token. ", err)
    })
  }, [])
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
    }
  };
  const checkPassword = (value, type) => {
    if (type === "normal") {
      if (value.length < 8) {
        setErrorPassword(true)
        setErrorPasswordText("Minimum 8 characters required")
      }
      if (confirmPassword) {
        if (confirmPassword !== value) {
          setErrorConfirmPassword(true)
          setErrorConfirmPasswordText("Password and confirm password does not match")
        } else {
          setErrorConfirmPassword(false)
        }
      }
    } else if (type === "confirm") {
      if (password) {
        if (password !== value) {
          setErrorConfirmPassword(true)
          setErrorConfirmPasswordText("Password and confirm password does not match")
        } else {
          setErrorConfirmPassword(false)
        }
      } else {
        setErrorPassword(true)
        setErrorPasswordText("Password is required")
      }
    }
    if (!value) {
      setErrorPassword(false)
      setErrorConfirmPassword(false)
    }
  }
  const testApi = () => {
    window.FB.api('/me', function (response) {
      console.log('Successful login for: ', response);
    });
  }
  const statusChangeCallback = (response) => {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for window.FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged  into your app and Facebook.
      testApi()
    } else if (response.status === '') {
      // The person is logged into Facebook, but not your app.
      console.log('Please log into this app.not_authorized')
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.log('Please log into this app.')
    }
  }
  const checkLoginState = () => {
    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }
  useEffect(() => {
    if (googleSignToken) {
      api.getGoogleSignProfile(googleSignToken).then((data) => {
        socialLogin(data, "google_id")
      }).catch(err => {
        console.log("err", err)
      })
    }
  }, [googleSignToken])
  const GoogleLoginFunction = useGoogleLogin(
    {
      onSuccess: (response) => {
        setGoogleSignToken(response)
      },
      onError: (error) => console.log('Login Failed:', error)
    }
  )
  const socialLogin = (loginObject, type) => {
    let profileObj = {}
    let social_id, name
    if (type == "google_id") {
      social_id = loginObject.id
      name = loginObject.name
      profileObj.givenName = loginObject.given_name
      profileObj.email = loginObject.email
    } else if (type == "facebook_id") {
      social_id = loginObject.id
      name = loginObject.name
      profileObj.email = loginObject.email
    }
    profileObj.name = name
    profileObj.id = social_id
    api
      .socialLogin({
        email: profileObj.email,
        name: profileObj.givenName == undefined ? profileObj.name : profileObj.givenName,
        type: type,
        social_id: profileObj.googleId == undefined ? profileObj.id : profileObj.googleId,
        fcm_token: fcmToken,
        device_token: fcmToken,
        latitude: lat,
        longitude: lng,
        time_zone: timeZone
      })
      .then((data) => {
        if (data.status) {
          toast.current.show({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
          setTimeout(() => {
            if (clearZendeskHistory()) {
              optIntoUncachedConfigEndpoint()
            }
            dispatch(userDetailsFetch(data.data));
            dispatch(setLoggedInValue(true));
            localStorage.setItem("fcmToken", fcmToken)
            navigate("/");
          }, 2000)
        } else {
          toast.current.show({ severity: 'error', summary: 'Error Message', detail: data.message, life: 3000 });
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  function userRegister(e) {
    e.preventDefault();
    if (name === "") {
      setErrorName(true)
    }
    if (email === "") {
      setErrorEmail(true)
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
    if (name !== "" && email !== "" && password !== "" && confirmPassword !== "" && password.length >= 8 && password === confirmPassword) {
      if (termsOfServiceSelected) {
        setSubmitStatus(true)
        api
          .userRegistration({ name: name, password: password, email: email, latitude: lat, longitude: lng, time_zone: timeZone, device_token: fcmToken, fcm_token: fcmToken,device_type:'web' })
          .then(({ data }) => {
            if (data.status == true) {
              toast.current.show({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
              let userObj = { name: name, password: password, email: email }
              localStorage.setItem("userOTP", JSON.stringify(userObj))
              localStorage.setItem("fcmToken", fcmToken)
              setTimeout(() => {
                dispatch(setRegisteredMailAddress(email));
                // navigate("/otp");
                // setOtpTime();
                setRunTimer((t) => !t)
                setTimer(true)
              }, 1000)
            } else {
              toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
              setTimeout(() => {
                setSubmitStatus(false)
              }, 1000)
            }
          })
          .catch((err) => {
            console.log("api error  response", err);
          });
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please agree to the Terms and Conditions' });
      }
    }
  }

  useEffect(() => {
    let timerId;

    if (runTimer) {
      setCountDown(60 * 1);
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [runTimer])
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, [])
  useEffect(() => {
    if (countDown < 0 && runTimer) {
      console.log("expired");
      setRunTimer(false);
      // setOtpShowTime(true)
      setCountDown(0);
    }
  }, [countDown, runTimer])
  //apple login response
  const appleResponse = response => {
    if (!response.error) {
      api.appleSignin({ 
        id_token: response.authorization.id_token,
        fcm_token: fcmToken,
        latitude: lat,
        longitude: lng,
        time_zone: timeZone,
        device_token: fcmToken
      }).then((data) => {
        if (data.status == true) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000
          })
          setTimeout(() => {
            if (clearZendeskHistory()) {
              optIntoUncachedConfigEndpoint()
            }
            dispatch(userDetailsFetch(data.data))
            dispatch(setLoggedInValue(true))
            localStorage.setItem("fcmToken", fcmToken)
            navigate(-1)
          }, 1000)
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message,
          });
          setTimeout(() => {
            setSubmitStatus(false);
          }, 1000);
        }
      }).catch((err) => {
        console.log("api error response", err)
      })

    } else {
      console.log("response err", response)
    }
  };

  return (
    <>

      <Toast ref={toast}></Toast>
      <Header screen="" />
      {timer ? (<Otp minute={minute} seconds={seconds} setRunTimer={setRunTimer} runTimer={runTimer} setTimer={setTimer} buttonSubmit={setSubmitStatus} />) :

        /* {timer ? (<Otp minute={minute} seconds={seconds} otpShowTime={otpShowTime} setOtpTime={setOtpTime} setTimer={setTimer} setSubmitStatus={setSubmitStatus}/>) : */
        (<section className="bg_gray">
          <div className="max-w-lg mx-auto lg:py-8 py-4">
            <div className="bg-white rounded-sm">
              <div className=" lg:py-8 py-5 lg:px-8 px-5">
                <h2 className="head_2 text-center uppercase">Sign Up</h2>
                <p className="text-center text-gray-700 lg:pb-2">
                  Beautifully designed, expertly crafted
                </p>
                <div className="flex mt-4 justify-between font-semibold">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => GoogleLoginFunction()}
                    className="flex bg_gray lg:px-5 px-2 py-2 w-full rounded-sm mr-3 justify-center items-center hover:shadow-md"
                  >
                    <img src={google} alt="" className="lg:pr-2 pr-2 " />
                    <p>Google </p>
                  </span>
                  <FacebookLogin
                    appId="555"
                    autoLoad={false}
                    fields="name,email"
                    callback={(resp) => {
                      if (resp.status !== "unknown") {
                        socialLogin(resp, "facebook_id")
                      }
                    }}
                    render={renderProps => (
                      <button
                        style={{ cursor: "pointer" }}
                        onClick={renderProps.onClick}
                        className="flex bg_gray lg:px-5 px-2 py-2 w-full rounded-sm mr-3 justify-center items-center hover:shadow-md"
                      >
                        <img src={facebook} alt="" className="lg:pr-2 pr-2" />
                        Facebook
                      </button>
                    )}
                  />
                  <AppleLogin
                    clientId="com.meeturdream.auth"
                    redirectURI="/sign_up"
                    usePopup={true}
                    callback={appleResponse} // Catch the response
                    scope="email name"
                    responseMode="query"
                    render={renderProps => (  //Custom Apple Sign in Button
                      <button
                        onClick={renderProps.onClick}
                        style={{ cursor: "pointer" }}
                        className="flex bg_gray lg:px-5 px-2 py-2 w-full rounded-sm mr-3 justify-center items-center hover:shadow-md"
                      >
                        <img src={apple} alt="" className="lg:pr-2 pr-2" />
                        Apple
                      </button>
                    )}
                  />
                </div>
                <div className="text-center mb-2 mt-3 font-bold text-sm">OR</div>
                <form>
                  <div className="w-full">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name *"
                        onChange={(e) => {
                          setErrorName(false);
                          setName(e.target.value);
                        }}
                      />
                      {errorName ? (
                        <p className="text-red-500 text-sm">Name is required</p>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email *"
                        onChange={(e) => {
                          setErrorEmail(false);
                          setEmail(e.target.value);
                        }}
                      />
                      {errorEmail ? (
                        <p className="text-red-500 text-sm">Email is required</p>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <input
                        id="signUpPassword"
                        type="password"
                        className="form-control"
                        placeholder="Password *"
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
                    <div className="form-group">
                      <input
                        id="signUpConfirmPassword"
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password *"
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
                    <div className="flex justify-between py-2">
                      <span className="">
                        <input
                          type="checkbox"
                          className="mr-1"
                          onChange={() =>
                            setTermsOfServiceSelected(!termsOfServiceSelected)
                          }
                        />{" "}
                        By continuing, you agree to our{" "}
                        <a style={{ color: "#487CFE" }}
                          className="font-bold cursor-pointer" onClick={() => { navigate("/Terms-and-service") }}>Terms of Service</a>
                        {" "}
                        Terms of Service and
                        <a style={{ color: "#487CFE" }}
                          className="font-bold cursor-pointer" onClick={() => { navigate("/privacy") }}> {" "}
                          Privacy Policy.</a>
                      </span>
                    </div>
                    {submitStatus ? (
                      <ProcessingButton />
                    ) : (
                      <button
                        onClick={(e) => userRegister(e)}
                        className="w-full btn_primary bg_primary rounded-sm mt-3 py-3 text-white"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </form>

                <p className="text-center pt-5 text-gray-500">
                  Already Have an account ?{" "}
                  <Link
                    to="/sign_in"
                    className="font-bold text-gray-900 hover:text-[#153D57]"
                  >
                    Sign In
                  </Link>{" "}
                </p>
              </div>
            </div>
          </div>
        </section>)
      }
    </>
  );
};

export default Sign__up;
