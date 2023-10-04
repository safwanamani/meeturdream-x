import React, { useState, useRef } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { GrDocumentPdf } from "react-icons/gr";
import AddEducationModal from "../Modals/My-Resume/AddEducationModal";
import AddCertificationModal from "../Modals/My-Resume/AddCertificationModal";
import AddExperience from "../Modals/My-Resume/AddExperience";
import SmallCommonModal from "../Modals/SmallCommonModal";
import api from "../../Api/GeneralApi";
import { Toast } from "primereact/toast";

const MyProfile = ({
  setSettingSelected,
  profileDetails,
  setProfileDetails,
}) => {
  const toast = useRef(null);
  const [showModal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState("");
  const setShowModal = (type) => {
    setModal(true);
    setModalType(type);
  };
  const editModal = (type, data) => {
    if (type === "education") {
      setShowModal("Edit Education");
      setModalData(data);
    } else if (type === "certificate") {
      setShowModal("Edit Certificate");
      setModalData(data)
    }
  };
  const deleteModal = (type, data_id) => {
    if (type === "education") {
      setShowModal("Delete Education");
      setModalData(data_id);
    } else if (type === "certificate") {
      setShowModal("Delete Certificate");
      setModalData(data_id)
    }
  };
  const submitDelete = async (type) => {
    if (type === "education") {
      await api
      .deleteProfessionalEducation({
        professional_id: profileDetails.professional_id,
        professional_education_id: modalData,
      })
      .then((data) => {
        if (data.status === true) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          let education = profileDetails.educations.filter(
            (educat) => educat.id !== modalData
          );
          setProfileDetails((prevValue) => ({
            ...prevValue,
            educations: education,
          }));
          setTimeout(() => {
            setModal(false);
            setModalData("");
          }, 1000);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message,
            life: 3000,
          });
        }
      });
    } else if (type === "certificate") {
      await api
      .deleteProfessionalCertificate({
        professional_id: profileDetails.professional_id,
        professional_certification_id: modalData,
      })
      .then((data) => {
        if (data.status === true) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          let certificates = profileDetails.certificates.filter(
            (certificat) => certificat.id !== modalData
          );
          setProfileDetails((prevValue) => ({
            ...prevValue,
            certificates: certificates,
          }));
          setTimeout(() => {
            setModal(false);
            setModalData("");
          }, 1000);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message,
            life: 3000,
          });
        }
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="box__wrap w-full">
        <div className="pb-5">
          <h2 className="title">My Profile</h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative rounded-full w-[100px] h-[100px]">
                <img
                  src={profileDetails.image_url}
                  className="rounded-full img-responsive object-cover"
                  alt="img12"
                  onError={(e) => {
                    e.target.src = "/assets/NoneProfile.png";
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold inline-flex items-center">
                  {profileDetails.name}
                </h2>
                <p>{profileDetails.category}</p>
                <span>{profileDetails.subCategory}</span>
              </div>
            </div>
            <div>
              <button
                className="border-2 rounded-full w-[130px] text-gray-800 text-md py-3 px-3 mb-2 mr-3"
                onClick={() => setSettingSelected("Edit Profile")}
              >
                Edit
              </button>

              <button className="bg_primary  rounded-full w-[130px] text-white text-md py-3 px-3 mb-2">
                My Resume
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="py-4">
          <h2 className="mb-3 text-lg font-semibold">Base hourly rate</h2>
          <p>{profileDetails.base_rate} AED / Minute</p>
        </div>
        <hr />
        <div className="py-4">
          <h2 className="mb-3 text-lg font-semibold">Work Experience</h2>
          <p>
            {profileDetails.work_experience === null
              ? 0
              : profileDetails.work_experience}{" "}
            Years
          </p>
        </div>
        <hr />
        <div className="py-4">
          <h2 className="mb-3 text-lg font-semibold">About Me</h2>
          <p>{profileDetails.description} </p>
        </div>

        <hr />
        <div className="py-4">
          <h2 className="mb-3 text-lg font-semibold">Language</h2>
          <div className="">
            {profileDetails.language_list.map((language, key) => {
              return (
                <p
                  key={key}
                  className="font-bold text-md pb-3  flex items-center gap-2"
                >
                  <BsCheckCircleFill color="green" /> {language.language}{" "}
                  <span className="bg-green-200 text-sm text-green-800 font-medium px-4 py-1 rounded-full ml-2">
                    {language.proficiency}
                  </span>{" "}
                </p>
              );
            })}
          </div>
        </div>
        <hr />
        <div className="py-4">
          <h2 className="mb-3 text-lg font-semibold">Video Introduction</h2>
          <video
            width="320"
            height="240"
            src={profileDetails.intro_video}
            controls
            autoPlay
            muted
          ></video>
        </div>
      </div>

      <h2 className="text-xl py-4 font-bold">My Resume</h2>
      <div className="box__wrap w-full mb-3">
        <div className="pb-5">
          <div className="title flex justify-between">
            <h2 className="title">Education</h2>
            <span
              className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
              onClick={() => setShowModal("Add Education")}
            >
              <AiOutlinePlus />
            </span>
          </div>
          {profileDetails.educations.map((education, key) => {
            return (
              <div key={key} className="pb-3">
                <div className="flex justify-between mb-2">
                  <h2 className="text-lg font-semibold flex gap-2 items-center">
                    {education.degree_name}{" "}
                    <span
                      className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
                      onClick={() => editModal("education", education)}
                    >
                      <MdEdit />
                    </span>
                    <span
                      className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
                      onClick={() => deleteModal("education", education.id)}
                    >
                      <RiDeleteBin5Fill />
                    </span>
                  </h2>
                </div>
                <p>
                  {education.from_year} - {education.to_year},{" "}
                  {education.university_name}{" "}
                </p>
                {education.uploaded_certificate ? <a className="text-sm text-blue-600 cursor-pointer font-medium" href={education.uploaded_certificate}>View</a> : null}
              </div>
            );
          })}
        </div>
      </div>
      <div className="box__wrap w-full  mb-3">
        <div className="pb-5">
          <div className="title flex justify-between">
            <h2 className="title">Certification</h2>
            <span
              className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
              onClick={() => setShowModal("Add Certification")}
            >
              {" "}
              <AiOutlinePlus />
            </span>
          </div>
          {profileDetails.certificates.map((certificate, key) => {
            return (
              <div key={key} className="pb-3">
                <div className="flex justify-between mb-2">
                  <h2 className="text-lg font-semibold flex gap-2 items-center">
                    {certificate.certification_name}{" "}
                    <span className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
                    onClick={() => editModal("certificate", certificate)}>
                      <MdEdit />
                    </span>{" "}
                    <span
                      className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
                      onClick={() => deleteModal("certificate", certificate.id)}
                    >
                      <RiDeleteBin5Fill />
                    </span>
                  </h2>
                </div>
                <p>{certificate.certification_authority}</p>
                {certificate.uploaded_certificate ? <a className="text-sm text-blue-600 cursor-pointer font-medium" href={certificate.uploaded_certificate}>View</a> : null}
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="box__wrap w-full">
        <div className="pb-5">
          <div className="title flex justify-between">
            <h2 className="title">Experiences</h2>
            <span
              className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
              onClick={() => setShowModal("Add Experience")}
            >
              {" "}
              <AiOutlinePlus />
            </span>
          </div>
          <div className="pb-3">
            <div className="flex justify-between mb-2">
              <h2 className="text-lg font-semibold flex gap-2 items-center">
                Temple University{" "}
                <span className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer">
                  <MdEdit />
                </span>{" "}
                <span
                  className="round_border hover:bg-[#153D57] hover:text-white cursor-pointer"
                  onClick={() => setShowModal("Delete Modal")}
                >
                  <RiDeleteBin5Fill />
                </span>
              </h2>
            </div>
            <p>2001 - 2005, Bachelor of Medicine and Bachelor of Surgery </p>
          </div>
        </div>
      </div> */}
      {showModal ? (
        modalType === "Add Education" ? (
          <AddEducationModal
            title="Add Education"
            setModal={setModal}
            profileDetails={profileDetails}
            setProfileDetails={setProfileDetails}
          />
        ) : modalType === "Add Certification" ? (
          <AddCertificationModal
            title="Add Certification"
            setModal={setModal}
            profileDetails={profileDetails}
            setProfileDetails={setProfileDetails}
          />
        ) : modalType === "Add Experience" ? (
          <AddExperience setModal={setModal} />
        ) : modalType === "Edit Education" ? (
          <AddEducationModal
            title="Edit Education"
            setModal={setModal}
            profileDetails={profileDetails}
            setProfileDetails={setProfileDetails}
            modalData={modalData}
            setEditModalData={setModalData}
          />
        ) : modalType === "Edit Certificate" ? (
          <AddCertificationModal
            title="Edit Certification"
            setModal={setModal}
            profileDetails={profileDetails}
            setProfileDetails={setProfileDetails}
            modalData={modalData}
            setEditModalData={setModalData}
          />
        ) : modalType === "Delete Education" ? (
          <SmallCommonModal
            setModal={setModal}
            bodyText="Are you sure you want to delete this ?"
            submitFunction={() => submitDelete("education")}
          />
        ) : modalType === "Delete Certificate" ? (
          <SmallCommonModal
            setModal={setModal}
            bodyText="Are you sure you want to delete this ?"
            submitFunction={() => submitDelete("certificate")}
          />
        ) : null
      ) : null}
    </>
  );
};

export default MyProfile;
