import React, { useEffect, useRef, useState } from "react";
import api from "../../Api/AuthApi";
import { useNavigate } from "react-router-dom";
import {
  setLoggedInValue,
  userDetailsFetch,
  getRegisteredMailAddress,
  selectIsLoggedIn,
} from "../../features/redux/auth";
import { useSelector, useDispatch } from "react-redux";
import ProcessingButton from "../Settings/components/ProcessingButton";
import { Toast } from "primereact/toast";

const ConfirmPassword = () => {
  const toast = useRef(null);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordEye, setNewPasswordEye] = useState(false);
  const [errorNewPasswordText, setErrorNewPasswordText] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false);
  const registeredMailAddress = useSelector(getRegisteredMailAddress);
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorConfirmPasswordText, setErrorConfirmPasswordText] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn)
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  },[])
  const showPassword = (elementId) => {
    let elementIdData = document.getElementById(elementId);
    if (elementIdData.type === "password") {
      if (elementId === "newPassword") {
        setNewPasswordEye(true);
      } else if (elementId === "confirmPassword") {
        setConfirmPasswordEye(true);
      }
      elementIdData.type = "text";
    } else {
      if (elementId === "newPassword") {
        setNewPasswordEye(false);
      } else if (elementId === "confirmPassword") {
        setConfirmPasswordEye(false);
      }
      elementIdData.type = "password";
    }
  };
  const checkPassword = (value, type) => {
    if (type === "normal") {
      if (value.length < 8) {
        setErrorNewPassword(true);
        setErrorNewPasswordText("Minimum 8 characters required");
      }
      if (confirmPassword) {
        if (confirmPassword !== value) {
          setErrorConfirmPassword(true);
          setErrorConfirmPasswordText(
            "Password and confirm password does not match"
          );
        } else {
          setErrorConfirmPassword(false);
        }
      }
    } else if (type === "confirm") {
      if (newPassword) {
        if (newPassword !== value) {
          setErrorConfirmPassword(true);
          setErrorConfirmPasswordText(
            "Password and confirm password does not match"
          );
        } else {
          setErrorConfirmPassword(false);
        }
      } else {
        setErrorNewPassword(true);
        setErrorNewPasswordText("Password is required");
      }
    }
    if (!value) {
      setErrorNewPassword(false);
      setErrorConfirmPassword(false);
    }
  };
  const submitForgetPassword = (e) => {
    e.preventDefault();
    if (newPassword == "" && confirmPassword == "") {
      setErrorNewPassword(true);
      setErrorNewPasswordText("Password is required");
      setErrorConfirmPassword(true);
      setErrorConfirmPasswordText("Confirm password is required");
    } else if (newPassword != "" && confirmPassword == "") {
      setErrorNewPassword(false);
      setErrorConfirmPassword(true);
      setErrorConfirmPasswordText("Confirm password is required");
    } else if (newPassword == "" && confirmPassword != "") {
      setErrorNewPassword(true);
      setErrorNewPasswordText("Password is required");
      setErrorConfirmPassword(false);
    } else {
      setSubmitStatus(true);
      const resetCode = localStorage.getItem("reset_code");
      api
        .setNewpasswordAfterForget({
          reset_code: resetCode,
          new_password: newPassword,
          confirm_password: confirmPassword,
          email: registeredMailAddress,
        })
        .then(({ data }) => {
          if (data.status == true) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: data.message,
            });
            setTimeout(() => {
              localStorage.removeItem("reset_code");
              navigate("/sign_in");
            }, 1000);
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: data.message,
            });
            setSubmitStatus(false);
          }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    }
  };
  return (
    <section className="bg_gray">
      <Toast ref={toast}></Toast>
      <div className="max-w-lg mx-auto pt-20 pb-10 px-2 lg:px-0">
        <div className="bg-white rounded-sm">
          <div className=" py-8 px-8">
            <h2 className="head_2 text-center uppercase mb-5">
              Confirm Password
            </h2>

            <form>
              <div className="w-full">
                <div className="form-group pb-4">
                  <label htmlFor="" className="text-sm">
                    Enter New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    onChange={(e) => {
                      setErrorNewPassword(false);
                      setNewPassword(e.target.value);
                      checkPassword(e.target.value, "normal");
                    }}
                    className="form-control"
                    placeholder=""
                  />
                  <i
                    className={`far ${
                      newPasswordEye ? "fa-eye" : "fa-eye-slash"
                    }`}
                    id="togglePassword"
                    style={{ marginLeft: "-30px", cursor: "pointer" }}
                    onClick={() => showPassword("newPassword")}
                  ></i>
                  {errorNewPassword ? (
                    <p className="text-red-500 text-sm">
                      {errorNewPasswordText}
                    </p>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="" className="text-sm">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    onChange={(e) => {
                      setErrorConfirmPassword(false);
                      setConfirmPassword(e.target.value);
                      checkPassword(e.target.value, "confirm");
                    }}
                    className="form-control"
                    placeholder=""
                  />
                  <i
                    className={`far ${
                      confirmPasswordEye ? "fa-eye" : "fa-eye-slash"
                    }`}
                    id="togglePassword"
                    style={{ marginLeft: "-30px", cursor: "pointer" }}
                    onClick={() => showPassword("confirmPassword")}
                  ></i>
                  {errorConfirmPassword ? (
                    <p className="text-red-500 text-sm">
                      {errorConfirmPasswordText}
                    </p>
                  ) : null}
                </div>
                {submitStatus ? (
                  <ProcessingButton />
                ) : (
                  <button
                    onClick={(e) => submitForgetPassword(e)}
                    className="w-full btn_primary bt bg_primary rounded-sm mt-3 py-3 text-white"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
            <p
              className="text-center pt-5 font-bold cursor-pointer"
              onClick={() => navigate("/sign_in")}
            >
              Cancel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmPassword;
