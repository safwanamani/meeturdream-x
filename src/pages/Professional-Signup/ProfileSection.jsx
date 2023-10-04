import { Dropdown } from "primereact/dropdown";
import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setProfessionalSignUpViewIndex } from "../../features/redux/pageData";
import {
  setName,
  setEmail,
  setArea,
  setSpecializedArea,
  setLanguageLevel,
  setCountryOfOrigin,
  setProfileImage,
} from "../../features/redux/professionalsData";
import { getUserDetails } from "../../features/redux/auth";
import LanguageDropdowns from "./LanguageDropdowns";
import api from "../../Api/GeneralApi";
const ProfileSection = ({
  values,
  handleChange,
  languageLevel,
  setLanguageLevel,
}) => {
  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [img, setImg] = useState();
  const [countries, setCountries] = useState([]);
  const userDetails = useSelector(getUserDetails);
  const [area, setArea] = useState(null);
  const [errorName, setErrorName] = useState(false)
  const [areaList, setAreaList] = useState([]);
  const [specialisedAreaList, setSpecializedAreaList] = useState([]);
  const [specializedArea, setSpecializedArea] = useState(null);
  const [errorArea, setErrorArea] = useState(false);
  const [errorSpecializedArea, setErrorSpecializedArea] = useState(false);
  const [errorCountryOfOrigin, setErrorCountryOfOrigin] = useState(false);
  const [defaultLanguages, setDefaultLanguages] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [errorLanguage, setErrorLanguage] = useState(false)
  const [dropdownCount, setDropdownCount] = useState(0);
  const [dropErrorStatus, setDropErrorStatus] = useState({
    dropId: 0,
    languageSpokenStatus: false,
    levelStatus: false,
  });
  const [errorProfileImage, setErrorProfileImage] = useState(false);
  const [errorProfileImageStatus, setErrorProfileImageStatus] = useState(false)
  const [addCategoryError, setAddCategoryError] = useState(false)
  const changeFormStep = (e, step) => {
    e.preventDefault();
    if (values.name === "") {
      setErrorName(true)
    }
    if (values.area === "" || values.area === undefined) {
      setErrorArea(true);
    }
    if (specialisedAreaList.length > 0 && values.specializedArea === "" || values.specializedArea === undefined) {
      setErrorSpecializedArea(true)
    }
    if (values.otherCategoryStatus === true && values.otherCategoryName === "") {
      setAddCategoryError(true)
    }
    if (values.countryOfOrigin === "") {
      setErrorCountryOfOrigin(true);
    }
    let checkLanguageArray = languageLevel.filter(lang => lang.languageSpoken === "" || lang.level === "")
    if (checkLanguageArray.length > 0) {
      setErrorLanguage(true)
    }
    if (errorProfileImage === true) {
      setErrorProfileImage(true)
    }
    if (errorProfileImageStatus === true) {
      setErrorProfileImageStatus(true)
    }
    if (values.name !== "" && values.area !== "" && values.area !== undefined && values.countryOfOrigin !== "" && values.countryOfOrigin !== undefined && checkLanguageArray.length === 0 && errorProfileImage === false && errorProfileImageStatus === false) {
      if (values.otherCategoryStatus === true && values.otherCategoryName !== "") {
        setErrorName(false)
        setErrorArea(false)
        setErrorLanguage(false)
        setErrorSpecializedArea(false)
        setErrorCountryOfOrigin(false)
        setAddCategoryError(false)
        dispatch(setProfessionalSignUpViewIndex(step));
      }
      if (values.otherCategoryStatus === false) {
        if (specialisedAreaList.length > 0) {
          if (values.specializedArea !== "" && values.specializedArea !== undefined) {
            setErrorName(false)
            setErrorArea(false)
            setErrorLanguage(false)
            setErrorSpecializedArea(false)
            setErrorCountryOfOrigin(false)
            setAddCategoryError(false)
            dispatch(setProfessionalSignUpViewIndex(step));
          }
        } else {
          setErrorName(false)
          setErrorArea(false)
          setErrorSpecializedArea(false)
          setErrorCountryOfOrigin(false)
          setErrorLanguage(false)
          setAddCategoryError(false)
          setErrorProfileImage(false)
          setErrorProfileImageStatus(false)
          dispatch(setProfessionalSignUpViewIndex(step));
        }
      }

    }
  };
  useEffect(() => {
    api.getLanguages().then((data) => {
      let languagesArr = data.data.data;
      setDefaultLanguages(languagesArr);
      setDropdownCount(languagesArr.length - 1);
      setLanguagesList(
        languagesArr.map((langObj) => {
          return langObj.language;
        })
      );
    });
    if (values.name === "") {
      handleChange("name", userDetails.name)
    }
    var scrollTop = function () {
      window.scrollTo(0, 0);
    };
    scrollTop()
  }, []);
  useEffect(() => {
    let checkLanguageArray = languageLevel.filter(lang => lang.languageSpoken === "" || lang.level === "")
    if (checkLanguageArray.length > 0) {
      // setErrorLanguage(true)
    } else {
      setErrorLanguage(false)
    }
  }, [languageLevel])
  const incrementLanguagesDropdownCount = () => {
    if (
      languageLevel[languageLevel.length - 1].languageSpoken === "" &&
      languageLevel[languageLevel.length - 1].level === ""
    ) {
      setDropErrorStatus({
        dropId: languageLevel.length - 1,
        languageSpokenStatus: true,
        levelStatus: true,
      });
    } else if (
      languageLevel[languageLevel.length - 1].languageSpoken === "" &&
      languageLevel[languageLevel.length - 1].level !== ""
    ) {
      setDropErrorStatus({
        dropId: languageLevel.length - 1,
        languageSpokenStatus: true,
        levelStatus: false,
      });
    } else if (
      languageLevel[languageLevel.length - 1].languageSpoken !== "" &&
      languageLevel[languageLevel.length - 1].level === ""
    ) {
      setDropErrorStatus({
        dropId: languageLevel.length - 1,
        languageSpokenStatus: false,
        levelStatus: true,
      });
    } else {
      let emptyObj = {
        languageSpoken: "",
        level: "",
      };
      setDropdownCount(dropdownCount - 1);
      setLanguageLevel((prevValue) => [...prevValue, emptyObj]);
    }
  };
  const removeLanguage = (language) => {
    setLanguagesList((prevValue) => [...prevValue, language]);
    setDropdownCount(dropdownCount + 1);
    setLanguageLevel(
      languageLevel.filter((level) => level.languageSpoken !== language)
    );
  };
  const onImageChange = (e) => {
    if (e.target.files[0].size > 2000000) {
      setErrorProfileImage(true);
    } else {
      var imageType = e.target.files[0].type.split("/")[1]
      if (imageType === "jpeg" || imageType === "png" || imageType === "jpg") {
        setErrorProfileImage(false);
        setErrorProfileImageStatus(false)
        const [file] = e.target.files;
        setImg(e.target.files[0]);
        handleChange("proImage", URL.createObjectURL(file));
        handleChange("profileImage", e.target.files[0]);
      } else {
        setErrorProfileImageStatus(true)
      }
    }
  };
  const onCountryChange = (e) => {
    setSelectedCountry(e.value);
    handleChange("countryOfOrigin", e.value);
  };
  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="country-item country-item-value w-[120px]">
          <div>{option.name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };
  const countryOptionTemplate = (option) => {
    return (
      <div className="country-item ">
        <div>{option.name}</div>
      </div>
    );
  };
  const selectedAreaTemplate = (option, props) => {
    if (option) {
      return (
        <div className="country-item country-item-value w-[120px]">
          <div>{option.name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };
  const AreaOptionTemplate = (option) => {
    return (
      <div className="country-item ">
        <div>{option.name}</div>
      </div>
    );
  };
  const getArea = () => {
    api
      .getAreaOfDomainForProfessionals()
      .then((data) => {
        if (data.status) {
          let areaData = data.data;
          areaData.push({
            id: 0,
            name: "Others"
          })
          setAreaList(
            areaData.map((obj) => {
              return {
                name: obj.category_name,
                ...obj,
              };
            })
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const getSpecializedArea = (categoryId) => {
    api
      .getSpecializedAreaOfDomainForProfessionals(categoryId)
      .then((data) => {
        if (data.status) {
          let specializedAreaData = data.data;
          setSpecializedAreaList(
            specializedAreaData.map((obj) => {
              return {
                name: obj.sub_category_name,
                ...obj,
              };
            })
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const getCountryListData = () => {
    api
      .getCountryList()
      .then((data) => {
        let countriesData = data.data;
        setCountries(
          countriesData.map((countryObj) => {
            return {
              name: countryObj.country_name,
              ...countryObj,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getCountryListData();
    getArea();
    if (values.specializedArea !== "") {
      getSpecializedArea(values.area.id)
    }
  }, []);

  const onSortChange = (e, type) => {
    if (type == "area") {
      if (e.value) {
        getSpecializedArea(e.value.id);
      } else {
        setSpecializedAreaList([])
        handleChange("otherCategoryStatus", false)
      }
      setArea(e.value);
      handleChange("area", e.value);
      setSpecializedArea("");
      handleChange("specializedArea", "");
    } else if (type == "specializedArea") {
      setSpecializedArea(e.value);
      handleChange("specializedArea", e.value);
    }
  };
  return (
    <>
      <div className="p-4 md:p-8 bg-white">
        <div className="header flex justify-between pb-8">
          <h2 className="text-xl font-bold">Profile</h2>
          <span className="py-1 px-3 bg-[#eeb738af] rounded-lg text-sm">
            Step <b className="text-md">1/6</b>
          </span>
        </div>
        <form action="">
          <div className="form-group">
            <label className="font-semibold">Name <span class="text-red-500">*</span></label>
            <input
              type="text"
              defaultValue={values.name}
              className="form-control-stroke"
              name="name"
              onChange={(e) => {
                handleChange("name", e.target.value)
                if (e.target.value) {
                  setErrorName(false)
                } else {
                  setErrorName(true)
                }
              }}
            />
            {errorName ? (
              <p className="text-red-500 text-sm">Name is required</p>
            ) : ""}
          </div>
          {/* <div className='form-group'>
            <label className='font-semibold'>Last Name</label>
            <input value={""} type="text" className='form-control-stroke' name="name" />
          </div>
          <div className='form-group'>
            <label className='font-semibold'>Email</label>
            <input type="text" value={userDetails.email} className='form-control-stroke' name="name" />
          </div> */}

          <div className="md:flex gap-4 mb-4">
            <div className={`mb-2 md:mb-0 ${values.otherCategoryStatus === false ? values.specializedArea !== "" ? "md:w-1/2" : specialisedAreaList.length > 0 ? "md:w-1/2" : "md:w-full" : 'md:w-1/2'}`}>
              <h2 className="font-semibold mb-3">
                Select Your Area <span class="text-red-500">*</span>
              </h2>
              <Dropdown
                className="w-full"
                required
                value={values.area}
                options={areaList}
                onChange={(e) => {
                  if (e.value) {
                    if (e.value.name === "Others") {
                      handleChange("otherCategoryStatus", true)
                      setSpecializedArea("")
                    } else {
                      handleChange("otherCategoryStatus", false)
                    }
                  } else {
                    setSpecializedArea("")
                  }
                  onSortChange(e, "area");
                  setErrorArea(false);
                }}
                optionLabel="name"
                placeholder="Select your area"
                filter
                showClear
                filterBy="name"
                valueTemplate={selectedAreaTemplate}
                itemTemplate={AreaOptionTemplate}
              />
              {errorArea ? (
                <p className="text-red-500 text-sm">Area is required</p>
              ) : (
                ""
              )}
            </div>
            <div className={`${values.otherCategoryStatus === false ? values.specializedArea !== "" ? "md:w-1/2" : specialisedAreaList.length > 0 ? "md:w-1/2" : "hidden" : 'md:w-1/2'}`}>
              {values.otherCategoryStatus ? (
                <>
                  <h2 className="font-semibold mb-3">
                    Add your category <span class="text-red-500">*</span>
                  </h2>
                  <input
                    value={values.otherCategoryName}
                    type="text"
                    className="form-control-stroke"
                    name="othersCategoryName"
                    onChange={(e) => {
                      handleChange("otherCategoryName", e.target.value)
                    }}
                  />
                  {addCategoryError ? (
                    <p className="text-red-500 text-sm">Category is required</p>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  {specialisedAreaList.length > 0 || values.specializedArea !== "" ? (
                    <>
                      <h2 className="font-semibold mb-3">
                        Select Your Specialized Area <span class="text-red-500">*</span>
                      </h2>
                      <Dropdown
                        className="w-full"
                        required
                        value={values.specializedArea}
                        options={specialisedAreaList}
                        onChange={(e) => {
                          onSortChange(e, "specializedArea");
                          setErrorSpecializedArea(false);
                        }}
                        optionLabel="name"
                        placeholder="Select your specialized area"
                        filter
                        showClear
                        filterBy="name"
                      />
                      {errorSpecializedArea ? (
                        <p className="text-red-500 text-sm">
                          Specialized Area is required
                        </p>
                      ) : (
                        ""
                      )}
                    </>
                  ) : ""}
                </>
              )}
            </div>
          </div>

          {languageLevel.map((lang, key) => {
            let current_list = [];
            languagesList.map((this_lang) => {
              current_list.push(this_lang);
            });
            if (lang.languageSpoken) {
              current_list.push(lang.languageSpoken);
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
            );
          })}
          {errorLanguage ?
            <p className="text-red-500 text-sm">
              Language is required
            </p> : ""
          }

          {dropdownCount !== 0 ? (
            <p
              className="font-bold text-ld text-[#153D57] flex items-center gap-1 py-2 cursor-pointer"
              onClick={() => {
                incrementLanguagesDropdownCount();
              }}
            >
              <AiOutlinePlus size={22} /> Add Language
            </p>
          ) : (
            ""
          )}

          <div className="form-group">
            <h2 className="font-semibold my-3">
              Country of origin <span class="text-red-500">*</span>
            </h2>
            <Dropdown
              className="w-full h-[50px]"
              value={values.countryOfOrigin}
              options={countries}
              onChange={(e) => {
                onCountryChange(e);
                if (e.value) {
                  setErrorCountryOfOrigin(false);
                } else {
                  setErrorCountryOfOrigin(true);
                }
              }}
              optionLabel="name"
              filter
              showClear
              filterBy="name"
              placeholder="Select a Country"
              valueTemplate={selectedCountryTemplate}
              itemTemplate={countryOptionTemplate}
            />
            {errorCountryOfOrigin ? (
              <p className="text-red-500 text-sm">Country is required</p>
            ) : (
              ""
            )}
          </div>
          <h2 className="text-lg pb-4 font-semibold">Profile image</h2>

          <div className="md:flex items-center gap-4">
            <div className="w-[80px] h-[80px] rounded-full mb-2 md:mb-0">
              <img
                src={values.proImage}
                alt=""
                className="rounded-full img-responsive object-cover"
              />
            </div>

            <div>
              <input
                width={100}
                type="file"
                onChange={onImageChange}
                accept="image/*"
              />
              {errorProfileImage ? (
                <p className="text-sm text-red-500">File size is too much</p>
              ) : (
                ""
              )}
              {
                errorProfileImageStatus ? (
                  <p className="text-sm text-red-500">Invalid image type</p>
                ) : (
                  ""
                )
              }
              <p className="pt-2 text-sm text-gray-500">
                JPG or PNG Format Maximum 2 MB
              </p>
            </div>
          </div>
          <div className="justify-end flex gap-3">
            <button
              className="bg_primary font-semibold text-md py-3 px-6 text-white rounded-md"
              onClick={(e) => changeFormStep(e, 1)}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileSection;
