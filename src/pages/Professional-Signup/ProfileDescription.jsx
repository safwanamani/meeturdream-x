import React from "react";
import { useState } from "react";
import { AiTwotoneCheckCircle, AiTwotoneDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setProfessionalSignUpViewIndex } from "../../features/redux/pageData";

const ProfileDescription = ({ values, handleChange }) => {
  const dispatch = useDispatch();
  const maxDescriptionLength = 300
  const [descriptionLength, setDescriptionLength] = useState(0)
  const [descriptionError, setDescriptionError] = useState(false)
  const [videoErrorStatus, setVideoErrorStatus] = useState(false)
  const [errorVideo, setErrorVideo] = useState(false);
  const [errorVideoType, setErrorVideoType] = useState(false)
  const attachResumeFile = (e) => {
    if (e.target.files[0].size > 10000000) {
      setErrorVideo(true);
    } else {
      console.log("res", e.target.files[0])
      var fileType = e.target.files[0].type.split("/")[1]
      if (fileType === "mp4") {
        setErrorVideo(false);
        setErrorVideoType(false)
        handleChange("resumeFile", e.target.files[0]);
      } else {
        setErrorVideo(false)
        setErrorVideoType(true)
      }
    }
  };
  const removeResumeFile = () => {
    setErrorVideo(false);
    handleChange("resumeFile", "");
  };
  const changeFormStep = (e, step) => {
    e.preventDefault();
    if (values.introduceYourself === "") {
      setDescriptionError(true)
    }
    if (!values.resumeFileObj || values.resumeFileObj === undefined) {
      setVideoErrorStatus(true)
    }
    if (values.introduceYourself !== "" && values.resumeFileObj && values.resumeFileObj !== undefined && errorVideoType === false) {
      setDescriptionError(false)
      setVideoErrorStatus(false)
      dispatch(setProfessionalSignUpViewIndex(step));
    }
  }
  const SetupIntroduction = (e) => {
    e.preventDefault()
    let value = e.target.value
    if (value.length <= maxDescriptionLength) {
      setDescriptionLength(value.length)
      handleChange("introduceYourself", e.target.value)
    }
  }
  return (
    <>
      <div className="p-4 md:p-8 bg-white">
        <div className="header flex justify-between pb-8">
          <h2 className="text-xl font-bold">Profile Description</h2>
          <span className="py-1 px-3 bg-[#eeb738af] rounded-lg text-sm">
            Step <b className="text-md">4/6</b>
          </span>
        </div>
        <form action="">
          <div className="form-group">
            <label className="font-semibold">Introduce yourself <span class="text-red-500">*</span></label>
            <textarea
              value={values.introduceYourself}
              onChange={(e) => {
                SetupIntroduction(e)
                if (e.target.value) {
                  setDescriptionError(false)
                } else {
                  setDescriptionError(true)
                }
              }
              }
              name=""
              id=""
              cols=""
              rows=""
              className="form-control-stroke"
            ></textarea>
            <div className={descriptionError ? `flex justify-between` : `text-right`}>
              {descriptionError ? (
                <p className="text-red-500 text-sm">Profile description is required</p>
              ) : ""}
              <p className="text-sm">{descriptionLength}/{maxDescriptionLength}</p>
            </div>
          </div>
          <h2 className="font-medium my-3 text-[#545454]">
            Introduction video <span class="text-red-500">*</span>
          </h2>
          {values.resumeFileObj ? (
            <div className="flex gap-1 items-center">
              <AiTwotoneCheckCircle />
              {values.resumeFileObj.name}
              <AiTwotoneDelete
                className="cursor-pointer"
                onClick={removeResumeFile}
              />
            </div>
          ) : (
            <>
              <input
                type="file"
                value=""
                accept="video/mp4"
                className="attachment"
                onChange={(e) => {
                  attachResumeFile(e)
                  if (e.target.value) {
                    setVideoErrorStatus(false)
                  }
                }}
              />
            </>
          )}

          <p className="pt-2 text-sm text-gray-500">Maximum size of 10MB</p>
          {errorVideo ? (
            <p className="text-sm text-red-500">File size is too much</p>
          ) : (
            videoErrorStatus ? (
              <p className="text-sm text-red-500">Introduction video is required</p>
            ) : (
              errorVideoType ? (
                <p className="text-sm text-red-500">Invalid video type</p>
              ) : ""
            )
          )}
          <div className="header justify-between pt-6 pb-4">
            <h2 className="text-xl font-bold">Work Experience</h2>
          </div>
          <div className="form-group">
            <h2 className="font-medium text-[#545454] my-2">
              Add your experience
              {/* <span class="text-red-500">*</span> */}
            </h2>
            <input type="number" min="0" className="border-2 p-2 rounded-md border-gray-300 h-[50px] w-[200]"
              defaultValue={Number(values.workExperience)}
              onChange={(e) => {
                var t = e.target.value;
                e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
                handleChange("workExperience", e.target.value)
              }} />
          </div>
          <div className="justify-end flex gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(setProfessionalSignUpViewIndex(2));
              }}
              className="font-semibold text-md py-3 px-6 text-black rounded-md border-1 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={(e) => {
                changeFormStep(e, 4)
              }}
              className="bg_primary font-semibold text-md py-3 px-6 text-white rounded-md"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default ProfileDescription;
