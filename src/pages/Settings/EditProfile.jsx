import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import LanguageDropdowns from "../Professional-Signup/LanguageDropdowns";
import api from '../../Api/GeneralApi';
import { Toast } from "primereact/toast";

const EditProfile = ({ profileDetails, setProfileDetails, setSettingSelected }) => {
  const toast = useRef(null)
  const [baseRate, setBaseRate] = useState(profileDetails.base_rate)
  const [baseRateError, setBaseRateError] = useState(false)
  const [baseRateErrorMessage, setBaseRateErrorMessage] = useState("")
  const [workExperience, setWorkExperience] = useState(profileDetails.work_experience !== null ? profileDetails.work_experience : 0)
  const [workExperienceError, setWorkExperienceError] = useState(false)
  const [workExperienceErrorMessage, setWorkExperienceErrorMessage] = useState("")
  const [description, setDescription] = useState(profileDetails.description)
  const [descriptionError, setDescriptionError] = useState(false)
  const [introVideo, setIntroVideo] = useState("")
  const [introVideoURL, setIntroVideoURL] = useState(profileDetails.intro_video)
  const [languageLevel, setLanguageLevel] = useState([{
    languageSpoken: '',
    level: ''
  }])
  const [defaultLanguages, setDefaultLanguages] = useState([])
  const [languagesList, setLanguagesList] = useState([])
  const [languageArray, setLanguageArray] = useState(null);
  const [dropdownCount, setDropdownCount] = useState(0)
  const [errorLanguage, setErrorLanguage] = useState(false)
  const [videoErrorStatus, setVideoErrorStatus] = useState(false)
  const [errorVideo, setErrorVideo] = useState(false)
  const [errorVideoType, setErrorVideoType] = useState(false)
  const [dropErrorStatus, setDropErrorStatus] = useState({
    dropId: 0,
    languageSpokenStatus: false,
    levelStatus: false
  })
  const maxDescriptionLength = 300
  const [descriptionLength, setDescriptionLength] = useState(profileDetails.description.length)
  useEffect(() => {
    let checkLanguageArray = languageLevel.filter(lang => lang.languageSpoken === "" || lang.level === "")
    if (checkLanguageArray.length > 0) {
      setErrorLanguage(true)
    } else {
      setErrorLanguage(false)
    }
  }, [languageLevel])
  const incrementLanguagesDropdownCount = () => {
    if (languageLevel[languageLevel.length - 1].languageSpoken === "" && languageLevel[languageLevel.length - 1].level === "") {
      setDropErrorStatus({
        dropId: languageLevel.length - 1,
        languageSpokenStatus: true,
        levelStatus: true
      })
    } else if (languageLevel[languageLevel.length - 1].languageSpoken === "" && languageLevel[languageLevel.length - 1].level !== "") {
      setDropErrorStatus({
        dropId: languageLevel.length - 1,
        languageSpokenStatus: true,
        levelStatus: false
      })
    } else if (languageLevel[languageLevel.length - 1].languageSpoken !== "" && languageLevel[languageLevel.length - 1].level === "") {
      setDropErrorStatus({
        dropId: languageLevel.length - 1,
        languageSpokenStatus: false,
        levelStatus: true
      })
    } else {
      let emptyObj = {
        languageSpoken: "",
        level: ""
      }
      setDropdownCount(dropdownCount - 1)
      setLanguageLevel(prevValue => [...prevValue, emptyObj])
    }
  }
  const removeLanguage = (language) => {
    setLanguagesList(prevValue => [...prevValue, language])
    setDropdownCount(dropdownCount + 1)
    setLanguageLevel(languageLevel.filter(level => level.languageSpoken !== language))
  }
  useEffect(() => {
    api.getLanguages().then(data => {
      let languagesArr = data.data.data;
      let languages = languagesArr.filter(language => {
        return !profileDetails.language_list.some(language_list => {
          return language.language === language_list.language;
        })
      })
      setDefaultLanguages(languagesArr)
      setDropdownCount(languages.length)
      setLanguageArray(languages)
      setLanguagesList(languages.map(langObj => {
        return langObj.language;
      }))
      setLanguageLevel(profileDetails.language_list.map(item => {
        let obj = {
          languageSpoken: item.language,
          level: item.proficiency
        }
        languagesArr.forEach(array => {
          if (item.language === array.language) {
            return obj.langObject = array
          }
        })
        return obj;
      }))
    }).catch(() => {

    })
  }, [])
  const editProfile = async () => {
    if (!baseRate) {
      setBaseRateErrorMessage("Base rate is not valid")
      setBaseRateErrorMessage("Base rate is required")
      setBaseRateError(true)
    }
    if (baseRate < 0) {
      setBaseRateErrorMessage("Base rate is not valid")
      setBaseRateError(true)
    }
    if (!workExperience && workExperience !== 0) {
      setWorkExperienceErrorMessage("Work Experience is required")
      setWorkExperienceError(true)
    }
    if (workExperience < 0) {
      setWorkExperienceErrorMessage("Work Experience is not valid")
      setWorkExperienceError(true)
    }
    if (!description) {
      setDescriptionError(true)
    }
    let checkLanguageArray = languageLevel.filter(lang => lang.languageSpoken === "" || lang.level === "")
    if (checkLanguageArray.length > 0) {
      setErrorLanguage(true)
    }
    if (baseRate !== "" && baseRate >= 0 && workExperience !== "" && description !== "" && workExperience >= 0 && checkLanguageArray.length === 0 && videoErrorStatus === false && errorVideo === false && errorVideoType === false ) {
      let submitData = new FormData();
      submitData.append("base_rate", baseRate)
      submitData.append("work_experience", workExperience)
      submitData.append("description", description)
      if (introVideo !== "") {
        submitData.append(`intro_video`, introVideo)
      }
      let languages = []
      languageLevel.forEach((langObj, i) => {
        submitData.append(`professional_languages[${i}][language_id]`, langObj.langObject.id)
        submitData.append(`professional_languages[${i}][profeciency_level]`, langObj.level)
        let obj = {
          id: i + 1,
          language: langObj.langObject.language,
          proficiency: langObj.level
        }
        languages.push(obj)
      })
      await api.editProfessionalProfile(submitData).then(({ data }) => {
        if (data.status === true) {
          toast.current.show({ severity: "success", summary: "Success", detail: data.response, life: 3000 })
          setProfileDetails((prevValue) => ({
            ...prevValue,
            base_rate: baseRate,
            work_experience: workExperience,
            description: description,
            language_list: languages,
            intro_video: introVideoURL
          }))
          setTimeout(() => {
            setSettingSelected("My Profile")
          }, 1000)
        } else {
          toast.current.show({ severity: "error", summary: "Error", detail: data.message, life: 3000 })
        }
      })
    }
  }
  const SetupIntroduction = (e) => {
    e.preventDefault()
    let value = e.target.value;
    if (value.length <= maxDescriptionLength) {
      setDescriptionLength(value.length)
      setDescription(value)
    }
  }
  const attachVideoFile = (e) => {
    if (e.target.files[0].size > 10000000) {
      setErrorVideo(true)
    } else {
      var fileType = e.target.files[0].type.split("/")[1]
      if (fileType === "mp4") {
        setErrorVideo(false)
        setErrorVideoType(false)
        setIntroVideo(e.target.files[0])
        const file = e.target.files[0];
        setIntroVideoURL(URL.createObjectURL(file))
      } else {
        setErrorVideo(false)
        setErrorVideoType(true)
      }
    }
  }
  return (
    <div className="box__wrap w-full">
      <Toast ref={toast} ></Toast>
      <h2 className="title">Edit Profile</h2>

      <div className="py-4">
        <h2 className="mb-3 text-lg font-semibold">Base hourly rate <span className="text-red-500">*</span></h2>
        <div className="gap-4 flex items-center">
          <input
            type="number"
            min={0}
            className="border-2 p-2 rounded-md border-gray-300 h-[50px] w-[200]"
            defaultValue={profileDetails.base_rate}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => {
              var t = e.target.value;
              e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
              setBaseRate(e.target.value)
              if (e.target.value) {
                if (e.target.value < 0) {
                  setBaseRateErrorMessage("Base rate is not valid")
                  setBaseRateError(true)
                } else {
                  setBaseRateError(false)
                }
              } else {
                setBaseRateErrorMessage("Base rate is required")
                setBaseRateError(true)
              }
            }}
          />
          <span className="text-2xl fond-semibold">AED / Minute</span>
        </div>
        {baseRateError ? <p className='text-red-500 text-sm'>{baseRateErrorMessage}</p> : ""}
      </div>
      <hr />
      <div className="py-4">
        <h2 className="mb-3 text-lg font-semibold">Work Experience <span className="text-red-500">*</span></h2>
        <input
          type="number"
          min={0}
          className="border-2 w-full border-gray-300 h-[50px] p-2 rounded-md"
          defaultValue={profileDetails.work_experience === null ? 0 : profileDetails.work_experience}
          onWheel={(e) => e.target.blur()}
          onChange={e => {
            if (e.target.value) {
              setWorkExperienceError(false)
              setWorkExperience(e.target.value)
              if (e.target.value < 0) {
                setWorkExperienceErrorMessage("Work Experience is not valid")
                setWorkExperienceError(true)
              } else {
                setWorkExperienceError(false)
              }
            } else {
              setWorkExperienceErrorMessage("Work Experience is required")
              setWorkExperienceError(true)
            }
          }}
        />
        {workExperienceError ? <p className='text-red-500 text-sm'>{workExperienceErrorMessage}</p> : ""}
      </div>
      <hr />
      <div className="py-4">
        <h2 className="mb-3 text-lg font-semibold">Introduce yourself <span className="text-red-500">*</span></h2>
        <textarea
          className="border-2 w-full rounded-m p-2"
          value={description}
          onChange={(e) => {
            SetupIntroduction(e)
            if (e.target.value) {
              setDescriptionError(false)
            } else {
              setDescriptionError(true)
            }
          }}
        />
        <div className={descriptionError ? `flex justify-between` : `text-right`}>
          {descriptionError ? <p className='text-red-500 text-sm'>Introduction is required</p> : ""}
          <p className="text-sm">{descriptionLength}/{maxDescriptionLength}</p>
        </div>
      </div>
      <hr />
      <div className="py-4">
        <h2 className="mb-3 text-lg font-semibold">Introduction Video </h2>
        <video width="320" height="240" className="mb-3" src={introVideoURL} controls></video>
        <input
          type="file"
          className="w-full rounded-md border-2 h-[50px]"
          accept="video/*"
          onChange={(e) => {
            attachVideoFile(e)
            if (e.target.value) {
              setVideoErrorStatus(false)
            }
          }}
        />
        <p className="pt-2 text-sm text-gray-500">Please avoid this field, if you don't need update this. <span className="text-red-500">*</span></p>
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
      </div>
      <hr />
      <div className="py-4">
        <h2 className="mb-3 text-lg font-semibold">Language</h2>
        {languageLevel.map((lang, key) => {
          let current_list = []
          languagesList.map(this_lang => {
            current_list.push(this_lang)
          })
          if (lang.languageSpoken) {
            current_list.push(lang.languageSpoken)
          }
          return (
            <LanguageDropdowns
              key={key}
              index={key}
              languageLevel={languageLevel}
              setLanguageLevel={setLanguageLevel}
              languagesList={current_list}
              setLanguagesList={setLanguagesList}
              obj={lang}
              removeLanguage={removeLanguage}
              dropErrorStatus={dropErrorStatus}
              setDropErrorStatus={setDropErrorStatus}
              defaultLanguages={defaultLanguages}
            />
          )
        })}
        {errorLanguage ? <p className='text-red-500 text-sm'>Language is required</p> : ""}
        {
          dropdownCount !== 0 ? (
            <p
              className="font-bold text-ld text-[#153D57] flex items-center gap-1 py-2 cursor-pointer"
              onClick={() => { incrementLanguagesDropdownCount() }}>
              <AiOutlinePlus size={22} /> Add Language
            </p>
          ) : ""
        }
      </div>
      <div className="justify-end flex">
        <button
          className="btn_primary bg_primary  text-lg text-white rounded-md"
          onClick={editProfile}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
