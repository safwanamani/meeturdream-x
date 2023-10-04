import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import api from "../../../Api/GeneralApi";
import { Toast } from "primereact/toast";

const AddEducationModal = ({title, modalData, setModal, setProfileDetails }) => {
  const toast = useRef(null)
  const [universityName, setUniversityName] = useState(modalData?.university_name);
  const [universityNameError, setUniversityNameError] = useState(false);
  const [degreeName, setDegreeName] = useState(modalData?.degree_name);
  const [degreeNameError, setDegreeNameError] = useState(false);
  const [fromYear, setFromYear] = useState(parseInt(modalData?.from_year));
  const [selectYearError, setSelectYearError] = useState({
    statuts: false,
    message: "",
  });
  const [toYear, setToYear] = useState(parseInt(modalData?.to_year));
  const [certificate, setCertificate] = useState("");
  const [certificateError, setCertificateError] = useState(false);

  useEffect(()=> {
      if(certificate === 'Edit Education'){
        submitEducation();
      }
  }, [certificate])

  const generateArrayOfYears = (yearType) => {
    var max = new Date().getFullYear();
    var min = max - 100;
    var years = [];
    if (yearType === "from") {
      if (toYear) {
        max = toYear;
      }
    } else if (yearType === "to") {
      if (fromYear) {
        min = fromYear;
      }
    }
    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  };
  const FromYears = generateArrayOfYears("from");
  const ToYears = generateArrayOfYears("to");
  const submitEducation = async () => {
    if (!degreeName) {
      setDegreeNameError(true);
    }
    if (!universityName) {
      setUniversityNameError(true);
    }
    if (!fromYear && !toYear) {
      setSelectYearError({
        statuts: true,
        message: "Year of study is required",
      });
    } else if (!fromYear && toYear) {
      setSelectYearError({
        statuts: true,
        message: "From Year is required",
      });
    } else if (fromYear && !toYear) {
      setSelectYearError({
        statuts: true,
        message: "To Year is required",
      });
    }
    if (title === "Add Education") {
      if (!certificate) {
        setCertificateError(true);
      }
    }
    if (universityName !== "" && degreeName !== "" && fromYear !== "" && toYear !== "" && certificate !== "") {
      let submitData = new FormData();
      submitData.append("university_name", universityName)
      submitData.append("degree_name", degreeName)
      submitData.append("from_year", fromYear)
      submitData.append("to_year", toYear)
      if (certificate !== "" && certificate !== "Edit Education") {
        submitData.append("uploaded_certificate", certificate)
      }
      if (title === "Edit Education") {
        submitData.append("education_id", modalData.id)
      }
      await api.updateProfessionalEducation(submitData).then(({data}) => {
        if (data.status === true) {
          toast.current.show({ severity: "success", summary: "Success", detail: data.message, life: 3000})
          api.getMyProfile().then(data => {
            let profileData = data.data;
            setProfileDetails((prevValue) => ({
              ...prevValue,
              educations: profileData.education_certificates
            }))
          })
          setTimeout(() => {
            setModal(false)
          }, 1000)
        } else {
          toast.current.show({ severity: "error", summary: "Error", detail: data.message, life: 3000 })
        }
      })
    }
  };
  return (
    <>
      <Toast ref={toast} ></Toast>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto min-w-[300px] md:min-w-[600px]">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setModal(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <>
                <div className="form-group mt-2">
                  <label className="font-semibold">University <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="form-control-stroke"
                    defaultValue={modalData?.university_name}
                    onChange={(e) => {
                      setUniversityName(e.target.value);
                      if (e.target.value) {
                        setUniversityNameError(false);
                      } else {
                        setUniversityNameError(true);
                      }
                    }}
                  />
                  {universityNameError ? (
                    <p className="text-red-500 text-sm">
                      University is required
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label className="font-semibold">Degree <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="form-control-stroke"
                    defaultValue={modalData?.degree_name}
                    onChange={(e) => {
                      setDegreeName(e.target.value);
                      if (e.target.value) {
                        setDegreeNameError(false);
                      } else {
                        setDegreeNameError(true);
                      }
                    }}
                  />
                  {degreeNameError ? (
                    <p className="text-red-500 text-sm">Degree is required</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="">
                  <h2 className="font-semibold mb-3">Year of study <span className="text-red-500">*</span></h2>

                  <Dropdown
                    className="mr-2"
                    value={{ name: fromYear }}
                    options={FromYears.map((year) => {
                      return { name: year };
                    })}
                    onChange={(e) => {
                      setFromYear(e.target.value.name);
                      if (e.target.value) {
                        if (toYear) {
                          setSelectYearError({
                            statuts: false,
                            message: "",
                          });
                        } else {
                          setSelectYearError({
                            statuts: true,
                            message: "To Year is required",
                          });
                        }
                      }
                    }}
                    filter
                    optionLabel="name"
                    placeholder="Select"
                  />
                  <Dropdown
                    className=""
                    value={{ name: toYear }}
                    options={ToYears.map((year) => {
                      return { name: year };
                    })}
                    onChange={(e) => {
                      setToYear(e.target.value.name);
                      if (e.target.value) {
                        if (fromYear) {
                          setSelectYearError({
                            statuts: false,
                            message: "",
                          });
                        } else {
                          setSelectYearError({
                            statuts: true,
                            message: "From Year is required",
                          });
                        }
                      }
                    }}
                    filter
                    optionLabel="name"
                    placeholder="Select"
                  />
                  {selectYearError.statuts ? (
                    <p className="text-red-500 text-sm">
                      {selectYearError.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <h2 className="font-semibold my-3">Attachment {title === "Add Education" && <span className="text-red-500">*</span>}</h2>
                <input
                  type="file"
                  className="attachement"
                  onChange={(e) => {
                    setCertificate(e.target.files[0]);
                    setCertificateError(false);
                  }}
                  accept="image/*"
                />
                <p className=" text-sm text-gray-500">
                JPG or PNG Format Maximum 2 MB
                </p>
                {title === "Edit Education" ? <p className="pt-1 text-sm text-gray-500">Please avoid this field, if you don't need update this. <span className="text-red-500">*</span></p> : ""}
                {certificateError ? (
                  <p className="text-red-500 text-sm">Attchment is required</p>
                ) : (
                  ""
                )}
              </>
            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                className="bg_primary text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={async() => {
                  if (title === "Edit Education" && certificate === "") {
                    setCertificate("Edit Education")
                  } else {
                    submitEducation()
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default AddEducationModal;
