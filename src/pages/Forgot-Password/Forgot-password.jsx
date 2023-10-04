import React, { useRef, useState, useEffect } from "react";
import api from "../../Api/AuthApi";
import  OTPInput, { ResendOTP } from "otp-input-react";
import { useNavigate } from "react-router-dom";
import { selectIsLoggedIn, setRegisteredMailAddress } from "../../features/redux/auth";

import { useSelector, useDispatch } from "react-redux";
import ProcessingButton from "../Settings/components/ProcessingButton";
import { Toast } from "primereact/toast";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [forgetPasswordEmail, setForgetPasswordEmail] = React.useState("");
  const [codeSent, setCodeSent] = React.useState(false);
  const [OTP, setOtp] = React.useState("");
  const [errorForgotInput, setErrorForgotInput] = useState(false);
  const [errorOtpInput, setErrorOtpInput] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [timerShow,setTimerShow] =useState(false)
  const [minute, setMinute] = useState(0);
  const [seconds, setSeconds] = useState(58);
  const [timerOld, setTimerOld] = useState(0);
  const [otpShowTime, setOtpShowTime] = useState(false)
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn)
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  },[])
  const setOtpTime = () => {
    var timeCount = 58;
    var minuteCount = 0
    var getTimer = timerOld
    if (getTimer) {
      clearInterval(getTimer);
    }
    var cntr = setInterval(() => {
      if (timeCount <= 1 && minuteCount == 0) {
        clearInterval(cntr);
        setOtpShowTime(true);
         setTimerShow(false)
      } else {
        setOtpShowTime(false);
      }
      if(timeCount == 59 || timeCount == 0){
        minuteCount = minuteCount-1
        setMinute(minuteCount)
        timeCount = 59
        setSeconds(timeCount)
      }
      timeCount =  timeCount  - 1;
      setTimerOld(cntr);
      setSeconds(timeCount);
      setMinute(minuteCount)

    }, 1000);
  };
const resentCode=()=>{
  api.forgetPasswordEmail({email:forgetPasswordEmail}).then((data)=>{
    console.log('userDetails',data)
    let dataa=data.data
    if (dataa.status == true) {
      
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: data.message,
      });
      
      setTimeout(() => {
        localStorage.setItem("reset_code", parseInt(OTP));
        dispatch(setRegisteredMailAddress(forgetPasswordEmail));
        setOtpTime(); 
  setTimerShow(true)
      }, 1000);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: data.response,
      });
      setSubmitStatus(false);
    }
  
  }).catch((err)=>{
    console.log('err',err)
  })
  
}
  const forgetPassword = (e) => {
    e.preventDefault();
    if (!codeSent) {
      if (forgetPasswordEmail == "") {
        setErrorForgotInput(true);
      } else {
        setSubmitStatus(true);
        api
          .forgetPasswordEmail({ email: forgetPasswordEmail })
          .then(({ data }) => {
            if (data.status == true) {
              toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: data.message,
              });
              setTimerShow(true)
              setOtpTime()
              setTimeout(() => {
                setCodeSent(data.status);
                setSubmitStatus(false);
                setButtonDisable(true);
              }, 1000);
            } else {
              toast.current.show({
                severity: "error",
                summary: "Error Message",
                detail: data.response,
              });
              setSubmitStatus(false);
            }
          })
          .catch((err) => {
            console.log("Error", err);
            setSubmitStatus(false);
          });
      }
    } else {
      if (OTP == "") {
        setErrorOtpInput(true);
      } else {
        setSubmitStatus(true);
        api
          .verifyOtpForForgetPassword({
            email: forgetPasswordEmail,
            reset_code: parseInt(OTP),
          })
          .then(({ data }) => {
            if (data.status == true) {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: data.response,
              });
              setTimeout(() => {
                localStorage.setItem("reset_code", parseInt(OTP));
                dispatch(setRegisteredMailAddress(forgetPasswordEmail));
                navigate("/confirm-password");
              }, 1000);
            } else {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: data.response,
              });
              setSubmitStatus(false);
            }
          })
          .catch((err) => {
            console.log("Error", err);
          });
      }
    }
  };


  const setButtonDisableStatus = (value, type) => {
    if (value) {
      if (type == "email") {
        setButtonDisable(false);
      } else if (type == "otp") {
        if (value.length == 5) {
          setButtonDisable(false);
        } else {
          setButtonDisable(true);
        }
      }
    } else {
      setButtonDisable(true);
    }
  };
  return (
    <section className="bg_gray">
      <Toast ref={toast} />
      <div className="max-w-lg mx-auto pt-20 pb-10 px-2 lg:px-0">
        <div className="bg-white rounded-sm">
          <div className=" py-8 px-8">
            <h2 className="head_2 text-center uppercase">Forgot Password</h2>
            {codeSent ? (
              <p className="text-center pb-3">
                Enter the 5-digit that we have sent via Email.
              </p>
            ) : (
              <p className="text-center pb-3">
              Enter your registered Email
            </p>
            )}
            <form>
              <div className="w-full">
                <div className="form-group">
                  <input
                    type="text"
                    onChange={(e) => {
                      setErrorForgotInput(false);
                      setForgetPasswordEmail(e.target.value);
                      setButtonDisableStatus(e.target.value, "email");
                    }}
                    className="form-control"
                    placeholder="Enter your E-Mail"
                    disabled={codeSent}
                  />
                  {errorForgotInput ? (
                    <p className="text-red-500 text-sm">E-Mail is required</p>
                  ) : null}
                </div>

                {codeSent && (
                  <>
                    <div
                      className="form-group pt-4"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <OTPInput
                        value={OTP}
                        onChange={(e) => {
                          setErrorOtpInput(false);
                          setOtp(e);
                          setButtonDisableStatus(e, "otp");
                        }}
                        autoFocus
                        OTPLength={5}
                        inputStyles={{
                          backgroundColor: "#ebe9e9",
                          width: "50px",
                          height: "50px",
                          borderRadius: "5px",
                          fontSize: "22px",
                        }}
                        otpType="number"
                        disabled={false}
                      />
                    </div>
                    {errorOtpInput ? (
                      <p className="text-red-500 text-sm text-center">
                        Otp is required
                      </p>
                    ) : null}
                  </>
                )}
                {submitStatus ? (
                  <ProcessingButton />
                ) : (
                  <button
                    className={`w-full btn_primary bt bg_primary rounded-sm mt-3 py-3 cursor-pointer text-white ${buttonDisable ? "opacity-75" : ""}`}
                    onClick={(e) => forgetPassword(e)}
                    disabled={buttonDisable}
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
            {timerShow ? (<p className="text-center pt-5 text-gray-500">
              Resent OTP in{" "}
              <span className="text-gray-900 font-bold cursor-pointer">
                {minute}:{seconds<9?`0${seconds}`:seconds}
              </span>{" "}
            </p>):('')}
            {otpShowTime ? (<p className="text-center pt-5 text-gray-500">
              Didn’t get the code ?{" "}
              <span onClick={()=>{resentCode()}} className="text-gray-900 font-bold cursor-pointer">
                Resend
              </span>{" "}
            </p>):('')}
            
            <p
              className="text-center pt-5 font-bold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/sign_in")}
            >
              Back
            </p>
          </div>
        </div>
      </div>
      <p className="text-center pb-28">© {new Date().getFullYear()} Meet UR Dream Inc. All Rights Reserved</p>
    </section>
  );
};

export default ForgotPassword;
