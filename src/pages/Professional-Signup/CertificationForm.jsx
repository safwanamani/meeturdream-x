import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { AiTwotoneCheckCircle, AiTwotoneDelete } from "react-icons/ai";
function CertificationForm({
  index,
  certificationData,
  setCertificationData,
  certificationObj,
  deleteCertification
}) {
  const [errorCertification, setErrorCertification] = useState(false);
  const [errorCertificationType, setErrorCertificationType] = useState(false);
  const setCertificationDetailsObj = (type, value) => {
    certificationObj[type] = value;
    setCertificationData(
      certificationData.map((item, i) => {
        if (index === i) {
          return { ...item, certificationObj };
        }
        return item;
      })
    );
  };
  const onAttachmentAdd = (e) => {
    if (e.target.files[0].size > 2000000) {
      setErrorCertification(true);
    } else {
      var imageType = e.target.files[0].type.split("/")[1]
      if (imageType === "jpeg" || imageType === "png" || imageType === "jpg") {
        setErrorCertification(false);
        const [file] = e.target.files;
        const formData = new FormData();
        formData.append("File", file);
        setCertificationDetailsObj("attachemnt", e.target.files[0]);
        setCertificationDetailsObj("attachemntName", file);
      } else {
        setErrorCertificationType(true)
        setErrorCertification(false)
      }
    }
    // handleChange('attachment',URL.createObjectURL(file))
  };
  const onAttachmentRemove = () => {
    setErrorCertification(false)
    setErrorCertificationType(false)
    setCertificationDetailsObj("attachemnt", "");
    setCertificationDetailsObj("attachemntName", "");
  };
  return (
    <>
      <div className="form-group">
        <div className="flex justify-between">
          <label className="font-semibold">Certification Name</label>
          <p className="font-bold text-ld text-[#153D57] flex items-center gap-1 cursor-pointer"
            onClick={() => deleteCertification(index)}>
            <AiOutlineDelete size={22} />Delete
          </p>
        </div>
        <input
          value={certificationObj.certificationName}
          onChange={(e) =>
            setCertificationDetailsObj("certificationName", e.target.value)
          }
          type="text"
          className="form-control-stroke"
          name="name"
        />
      </div>
      <div className="form-group">
        <label className="font-semibold">Certification Authority</label>
        <input
          value={certificationObj.certificationAuthority}
          onChange={(e) =>
            setCertificationDetailsObj("certificationAuthority", e.target.value)
          }
          type="text"
          className="form-control-stroke"
          name="name"
        />
      </div>
      <div className="form-group">
        <label className="font-semibold">Certification Number</label>
        <input
          value={certificationObj.certificationNumber}
          onChange={(e) =>
            setCertificationDetailsObj("certificationNumber", e.target.value)
          }
          type="text"
          className="form-control-stroke"
          name="name"
        />
      </div>
      <h2 className="font-semibold my-3">Attachment</h2>
      {certificationObj.attachemntName ? (
        <div className="flex gap-1 items-center">
          <AiTwotoneCheckCircle />
          {certificationObj.attachemntName.name}
          <AiTwotoneDelete
            className="cursor-pointer"
            onClick={onAttachmentRemove}
          />
        </div>
      ) : (
        <input
          type="file"
          className="attachment"
          onChange={onAttachmentAdd}
          // accept="application/pdf"
          accept="image/*"
        />
      )}
      {errorCertification ? (
        <p className="text-sm text-red-500">File size is too much</p>
      ) : (
        errorCertificationType ? (
          <p className="text-sm text-red-500">Invalid image type</p>
        ) : ""
      )}
      <p className="pt-2 text-sm text-gray-500 mb-5">
        JPG or PNG Format Maximum 2 MB
      </p>
    </>
  );
}

export default CertificationForm;
