import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import facebook from "../../assets/facebook.png";
import Header from "../../components/Header";
import api from "../../Api/AuthApi";
import { useNavigate } from "react-router-dom";
import { selectIsLoggedIn, setLoggedInValue, userDetailsFetch } from "../../features/redux/auth";
import ProcessingButton from "../Settings/components/ProcessingButton";
import { Toast } from "primereact/toast";
import { getMessaging, getToken } from "firebase/messaging";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { gapi } from "gapi-script";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AppleLogin from "react-apple-login";
import moment from "moment-timezone";
const Sign__in = () => {
  let isLoggedIn = useSelector(selectIsLoggedIn)
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
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
      })
    }
    let time_zone = moment.tz.guess();
    setTimeZone(time_zone)
  }
  useEffect(() => {
    getLocation();
    var scrollTop = function () {
      window.scrollTo(0, 0);
    };
    scrollTop()
    if (isLoggedIn) {
      window.history.pushState(null, null, window.location.href);
      window.history.back();
      window.onpopstate = () => window.history.forward();
    }
  }, []);
  // useEffect(() => {
  //   function preventBack() {
  //     window.history.forward(); 
  // }
    
  // setTimeout(preventBack(), 0);
  // },[])
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("../firebase-messaging-sw.js")
        .then(function (registration) {
          // Successful registration
          console.log(
            "Hooray. Registration successful, scope is:",
            registration.scope,
            registration
          );
        })
        .catch(function (error) {
          // Failed registration, service worker won’t be installed
          console.log(
            "Whoops. Service worker registration failed, error:",
            error
          );
        });
    }
    const messaging = getMessaging();
    getToken(messaging, {
      vapidKey:
        "BBgm-S3hKn1xd",
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log("currentToken", currentToken);
          setFCMToken(currentToken);
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }, []);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordEye, setPasswordEye] = useState(false);
  const [submitStatus, setSubmit] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [fcmToken, setFCMToken] = useState("");
  const [googleSignToken, setGoogleSignToken] = useState()
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [timeZone, setTimeZone] = useState("")
  const dispatch = useDispatch();
  const showPassword = () => {
    let signInPassword = document.getElementById("signInPassword");
    if (signInPassword.type === "password") {
      setPasswordEye(true);
      signInPassword.type = "text";
    } else {
      setPasswordEye(false);
      signInPassword.type = "password";
    }
  };
  const logIn = (e) => {
    e.preventDefault();
    if (email == "" && password == "") {
      setErrorEmail(true);
      setErrorPassword(true);
    } else if (email == "") {
      setErrorEmail(true);
    } else if (password == "") {
      setErrorPassword(true);
    } else {
      setSubmit(true);
      api
        .login({ email: email, password: password, fcm_token: fcmToken, device_token: fcmToken,device_type:'web' })
        .then((data) => {
          if (data.status == true) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: data.response,
              life: 3000,
            });

            setTimeout(() => {
              if (clearZendeskHistory()) {
                optIntoUncachedConfigEndpoint()
              }
              dispatch(userDetailsFetch(data.data));
              dispatch(setLoggedInValue(true));
              localStorage.setItem("fcmToken", fcmToken)
              navigate(-1);
            }, 1000);
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: data.response,
            });
            setTimeout(() => {
              setSubmit(false);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log("api error response", err);
        });
    }
  };
  const testApi = () => {
    window.FB.api('/me', function (response) {
      console.log('Successful login for: ', response);
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
    } else if (response.status === 'l l  l                                                                                                                                                                                                                                                                                                                                                                                                                         ') {
      // The person is logged into Facebook, but not your app.
      console.log('Please log into this app.not_authorized')
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.log('Please log into this app.')
    }
  }

  //facebook
  const checkLoginState = () => {
    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }

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
        time_zone: timeZone,
        device_type:'web'
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
            navigate(-1);
          }, 2000)
        } else {
          toast.current.show({ severity: 'error', summary: 'Error Message', detail: data.message, life: 3000 });
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

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
  //apple login response
  const appleResponse = response => {
    if (!response.error) {
      api.appleSignin({
        id_token: response.authorization.id_token,
        fcm_token: fcmToken,
        device_token: fcmToken,
        latitude: lat,
        longitude: lng,
        time_zone: timeZone
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
            navigate(-1)
          }, 1000)
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message,
          });
          setTimeout(() => {
            setSubmit(false);
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
      <Toast ref={toast} />
      <Header screen="" />
      <section className="bg_gray">
        <div className="max-w-lg mx-auto lg:py-8 py-4">
          <div className="bg-white rounded-sm">
            <div className=" lg:py-8 py-5 lg:px-8 px-5">
              <h2 className="head_2 text-center uppercase">Sign In</h2>
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
                  appId="55859"
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
                  redirectURI="https://www.meeturdream.com/sign_up"
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
                      id="signInPassword"
                      type="password"
                      className="form-control"
                      placeholder="Password *"
                      onChange={(e) => {
                        setErrorPassword(false);
                        setPassword(e.target.value);
                      }}
                    />
                    <i
                      className={`far ${passwordEye ? "fa-eye" : "fa-eye-slash"
                        }`}
                      id="togglePassword"
                      style={{ marginLeft: "-30px", cursor: "pointer" }}
                      onClick={showPassword}
                    ></i>
                    {errorPassword ? (
                      <p className="text-red-500 text-sm">
                        Password is required
                      </p>
                    ) : null}
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="">
                      <input type="checkbox" className="" /> Remember me
                    </span>

                    <Link to="/forgot-password">
                      {" "}
                      <span className="font-semibold underline pb-3">
                        Forgot Password
                      </span>
                    </Link>
                  </div>
                  {submitStatus ? (
                    <ProcessingButton />
                  ) : (
                    <button
                      className="btn_primary w-full bg_primary rounded-sm mt-3 py-3 text-white"
                      onClick={(e) => logIn(e)}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
              <p className="text-center lg:pt-6 pt-4 text-gray-500">
                Don’t Have an account ?{" "}
                <Link
                  to="/sign_up"
                  className="font-bold text-gray-900 hover:text-[#153D57]"
                >
                  {" "}
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Sign__in;
