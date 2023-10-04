import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import api from "../../../Api/GeneralApi";

const AddCertificationModal = ({ title, modalData, setModal, setProfileDetails }) => {
  const toast = useRef(null);
  const [certificationName, setCertificateName] = useState(modalData?.certification_name);
  const [certificateNameError, setCertificateNameError] = useState("");
  const [certificationAuthority, setCertificationAuthority] = useState(modalData?.certification_authority);
  const [certificationAuthorityError, setCertificationAuthorityError] = useState("");
  const [certificationNumber, setCertificationNumber] = useState(modalData?.certification_number);
  const [certificationNumberError, setCertificationNumberError] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentError, setAttachmentError] = useState("");

  useEffect(() => {
    if (attachment === "Edit Certification") {
      submitCertification();
    }
  }, [attachment]);

  const submitCertification = async () => {
    if (!certificationName) {
      setCertificateNameError(true);
    }
    if (!certificationAuthority) {
      setCertificationAuthorityError(true);
    }
    if (!certificationNumber) {
      setCertificationNumberError(true);
    }
    if (title === "Add Certification" && !attachment) {
      if (!attachment) {
        setAttachmentError(true);
      }
    }
    if (certificationName !== "" && certificationAuthority !== "" && certificationNumber !== "" && attachment !== "") {
      let submitData = new FormData();
      if (title === "Edit Certification") {
        submitData.append("certificate_id", modalData.id)
      }
      submitData.append("certification_name", certificationName);
      submitData.append("certification_authority", certificationAuthority);
      submitData.append("certification_number", certificationNumber);
      if (attachment !== "" && attachment !== "Edit Certification") {
        submitData.append("uploaded_certificate", attachment);
      }
      await api.updateProfessionalCertification(submitData).then(({ data }) => {
        if (data.status === true) {
          toast.current.show({severity: "success", summary: "Success", detail: data.message, life: 3000 });
          api.getMyProfile().then((data) => {
            let profileData = data.data;
            setProfileDetails((prevValue) => ({
              ...prevValue,
              certificates: profileData.certification_certificates,
            }));
          });
          setTimeout(() => {
            setModal(false);
          }, 1000);
        } else {
          toast.current.show({severity: "error", summary: "Error", detail: data.message, life: 3000});
        }
      });
    }
  };
  return (
    <>
      <Toast ref={toast} />
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
                <div className="form-group">
                  <label className="font-semibold">Certification Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="form-control-stroke"
                    defaultValue={certificationName}
                    name="name"
                    onChange={(e) => {
                      setCertificateName(e.target.value);
                      if (e.target.value) {
                        setCertificateNameError(false);
                      } else {
                        setCertificateNameError(true);
                      }
                    }}
                  />
                  {certificateNameError ? (
                    <p className="text-red-500 text-sm">
                      Certification Name is required
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label className="font-semibold">
                    Certification Authority <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control-stroke"
                    defaultValue={certificationAuthority}
                    name="name"
                    onChange={(e) => {
                      setCertificationAuthority(e.target.value);
                      if (e.target.value) {
                        setCertificationAuthorityError(false);
                      } else {
                        setCertificationAuthorityError(true);
                      }
                    }}
                  />
                  {certificationAuthorityError ? (
                    <p className="text-red-500 text-sm">
                      Certification Authority is required
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label className="font-semibold">Certification Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="form-control-stroke"
                    defaultValue={certificationNumber}
                    name="name"
                    onChange={(e) => {
                      setCertificationNumber(e.target.value);
                      if (e.target.value) {
                        setCertificationNumberError(false);
                      } else {
                        setCertificationNumberError(true);
                      }
                    }}
                  />
                  {certificationNumberError ? (
                    <p className="text-red-500 text-sm">
                      Certification Number is required
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <h2 className="font-semibold my-3">Attachment {title === "Add Certification" && <span className="text-red-500">*</span>}</h2>
                <input
                  type="file"
                  className="attachment"
                  // accept="application/pdf"
                  onChange={(e) => {
                    setAttachment(e.target.files[0]);
                    if (e.target.files) {
                      setAttachmentError(false);
                    } else {
                      setAttachmentError(true);
                    }
                  }}
                  accept="image/*"
                />
                <p className="pt-2 text-sm text-gray-500">
                JPG or PNG Format Maximum 2 MB
                </p>
                {title === "Edit Certification" ? (
                  <p className="pt-1 text-sm text-gray-500">
                    Please avoid this field, if you don't need update this.{" "}
                    <span className="text-red-500">*</span>
                  </p>
                ) : (
                  ""
                )}
                {attachmentError ? (
                  <p className="text-red-500 text-sm">Attachment is required</p>
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
                onClick={() => {
                  if (title === "Edit Certification" && attachment === "") {
                    setAttachment("Edit Certification");
                  } else {
                    submitCertification();
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

export default AddCertificationModal;
