import React, { useRef, useState, useEffect } from "react";
import api from "../../Api/AuthApi";
import OTPInput, { ResendOTP } from "otp-input-react";
import { useNavigate } from "react-router-dom";
import {
  setLoggedInValue,
  userDetailsFetch,
  getRegisteredMailAddress,
} from "../../features/redux/auth";
import { useSelector, useDispatch } from "react-redux";
import ProcessingButton from "../Settings/components/ProcessingButton";
import { Toast } from "primereact/toast";
const Otp = ({ minute, seconds, otpShowTime, setOtpTime,setTimer,setRunTimer ,runTimer, buttonSubmit}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [OTP, setOTP] = React.useState("");
  const registeredMailAddress = useSelector(getRegisteredMailAddress);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(false);
  const clearZendeskHistory = () => {
    const e = ["clientId", "appUserId", "sessionToken"];
    Object.keys(localStorage).filter(t=>e.includes((e=>e.split(".")[1])(t))).forEach(e=>localStorage.removeItem(e))
  }
  const optIntoUncachedConfigEndpoint = () => {
    window.zESettings = {
      ...window.zESettings,
      preview: !0
    }
  }
  const checkOtp = () => {
    setSubmitStatus(true)
    let device_token = localStorage.getItem("fcmToken")
    api
      .verifyOtp({ otp: OTP, email: registeredMailAddress, device_token })
      .then(({ data }) => {
        if (data.status == true) {
          toast.current.show({ severity: 'success', summary: 'Success', detail: data.response, life: 3000 });
          setTimeout(() => {
            if (clearZendeskHistory()) {
              optIntoUncachedConfigEndpoint()
            }
            dispatch(setLoggedInValue(true));
            dispatch(userDetailsFetch(data.data));
            navigate("/");
          }, 2000)
        } else {
          toast.current.show({ severity: 'error', summary: 'Error', detail: data.response, life: 3000 });
          setTimeout(() => {
            setSubmitStatus(false)
          }, 2000)
        }
      })
      .catch((err) => {
        console.log("api error  response", err);
      });
  };
  const setButtonDisableStatus = (value) => {
    if (value) {
      if (value.length == 5) {
        setButtonDisable(false);
      } else {
        setButtonDisable(true);
      }
    } else {
      setButtonDisable(true);
    }
  };
  const getResendOtp = async () => {
    const userOTP = localStorage.getItem("userOTP")
    await api.resendOtp(userOTP).then((data) => {
      if (data.data.status) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: data.data.message, life: 1000 });
        // setOtpTime();
        setRunTimer((t) => !t)
      }
    })
  }
  useEffect(() => {
    buttonSubmit(false)
  }, [])


  return (
    <section className="bg_gray">
      <Toast ref={toast} />
      <div className="max-w-lg mx-auto py-20">
        <div className="bg-white rounded-sm">
          <div className=" py-8 px-8">
            <h2 className="text-2xl pb-2 text-center font-bold">OTP</h2>
            <p className="text-center pb-3 text-gray-800">
              Enter the 5-digit that we have sent via <br></br> Email
            </p>

            <div className="form-group flex justify-center px-4 ">
              <OTPInput
                value={OTP}
                onChange={(e) => {
                  setOTP(e);
                  setButtonDisableStatus(e);
                }}
                className=""
                autoFocus
                OTPLength={5}
                otpType="number"
                inputStyles={{
                  backgroundColor: "#ebe9e9",
                  width: "50px",
                  height: "50px",
                  borderRadius: "5px",
                  fontSize: "22px",
                }}
                disabled={false}
              />
            </div>
            {submitStatus ? (
              <ProcessingButton />
            ) : (
              <button
                className={`btn_primary w-full bg_primary rounded-sm mt-3 py-3 text-white ${buttonDisable ? "opacity-60 hover:opacity-60 hover:bg-[#153D57]" : ""
                  }`}
                onClick={checkOtp}
                disabled={buttonDisable}
              >
                Submit
              </button>
            )}
            {!runTimer ? (<p className="text-center pt-5 text-gray-500">
              Didn’t get the code ?{" "}
              <span onClick={() => getResendOtp()} className="text-gray-900 font-bold cursor-pointer">
                Resend
              </span>{" "}
            </p>) : (<p className="text-center pt-5 text-gray-500">
              OTP will expire in{" "}
              <span className="text-gray-900 font-bold cursor-pointer">
                {minute}:{seconds}
              </span>{" "}
            </p>)}
          </div>
          <p
            className="pb-8 text-center cursor-pointer font-semibold"
            onClick={() => {
              setTimer(false)
            }}
          >
            Back
          </p>
        </div>
      </div>
      <p className="text-center pb-5">
        © {new Date().getFullYear()} MeetUrDreems Inc. All Rights Reserved
      </p>
    </section>
  );
};

export default Otp;
