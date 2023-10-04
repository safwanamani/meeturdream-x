import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { AiTwotoneCheckCircle, AiTwotoneDelete } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
function EducationForm({
  index,
  educationDetails,
  setEducationDetails,
  educationObj,
  deleteEducation,
  handleChange,
}) {
  const [errorEducation, setErrorEducation] = useState(false);
  const [errorEducationType, setErrorEducationType] = useState(false);
  function generateArrayOfYears(yearType) {
    var max = new Date().getFullYear();
    var min = max - 100;
    var years = [];
    if (yearType == "from") {
      if (educationObj.toYear) {
        max = educationObj.toYear;
      }
    } else if (yearType == "to") {
      if (educationObj.fromYear) {
        min = educationObj.fromYear;
      }
    }
    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  }
  const FromYears = generateArrayOfYears("from");
  const ToYears = generateArrayOfYears("to");
  const [toYear, setToYear] = useState(null);
  const [fromYear, setFromYear] = useState(null);
  const setEducationDetailsObj = (type, value) => {
    educationObj[type] = value;
    setEducationDetails(
      educationDetails.map((item, i) => {
        if (index === i) {
          return { ...item, educationObj };
        }
        return item;
      })
    );
  };
  const onSortChange = (value, type) => {
    if (type == "toYear") {
      setToYear(value);
      setEducationDetailsObj("toYear", value);
    } else if (type == "fromYear") {
      setFromYear(value);
      setEducationDetailsObj("fromYear", value);
    }
  };
  const onAttachmentAdd = (e) => {
    if (e.target.files[0].size > 2000000) {
      setErrorEducation(true);
    } else {
      var imageType = e.target.files[0].type.split("/")[1]
      if (imageType === "jpeg" || imageType === "png" || imageType === "jpg") {
        setErrorEducation(false);
        setErrorEducationType(false)
        const [file] = e.target.files;
        const formData = new FormData();
        formData.append("File", file);
        setEducationDetailsObj("attachemnt", e.target.files[0]);
        setEducationDetailsObj("attachemntName", file);
      } else {
        setErrorEducationType(true)
        setErrorEducation(false)
      }
    }
  };
  const onAttachmentRemove = () => {
    setErrorEducation(false);
    setErrorEducationType(false)
    setEducationDetailsObj("attachemnt", "");
    setEducationDetailsObj("attachemntName", "");
  };
  return (
    <>
      <div className="form-group mt-2">
        <div className="flex justify-between">
          <label className="font-semibold">University</label>
          <p className="font-bold text-ld text-[#153D57] flex items-center gap-1 cursor-pointer"
            onClick={() => deleteEducation(index)}>
            <AiOutlineDelete size={22} />Delete
          </p>
        </div>
        <input
          type="text"
          value={educationObj.university}
          onChange={(e) => setEducationDetailsObj("university", e.target.value)}
          className="form-control-stroke"
          name="name"
        />
      </div>
      <div className="form-group">
        <label className="font-semibold">Degree</label>
        <input
          type="text"
          value={educationObj.degree}
          onChange={(e) => setEducationDetailsObj("degree", e.target.value)}
          className="form-control-stroke"
          name="name"
        />
      </div>
      <div className="">
        <h2 className="font-semibold mb-3">Year of study</h2>
        <Dropdown
          className="mr-2"
          value={{ name: educationObj.fromYear }}
          options={FromYears.map((year) => {
            return { name: year };
          })}
          onChange={(e) => onSortChange(e.value.name, "fromYear")}
          optionLabel="name"
          placeholder="From"
          filter
        />
        <Dropdown
          className=""
          value={{ name: educationObj.toYear }}
          options={ToYears.map((year) => {
            return { name: year };
          })}
          onChange={(e) => onSortChange(e.value.name, "toYear")}
          optionLabel="name"
          placeholder="To"
          filter
        />
      </div>
      <h2 className="font-semibold my-3">Attachment</h2>
      {educationObj.attachemntName ? (
        <div className="flex gap-1 items-center">
          <AiTwotoneCheckCircle />
          {educationObj.attachemntName.name}
          <AiTwotoneDelete
            className="cursor-pointer"
            onClick={onAttachmentRemove}
          />
        </div>
      ) : (
        <input
          type="file"
          className="attachement"
          onChange={onAttachmentAdd}
          // accept="application/pdf"
          accept="image/*"
        />
      )}
      {errorEducation ? (
        <p className="text-sm text-red-500">File size is too much</p>
      ) : errorEducationType ? (
        <p className="text-sm text-red-500">Invalid image type</p>
      ) : (
        ""
      )}
      <p className="pt-2 text-sm text-gray-500 mb-5">
        JPG or PNG Format Maximum 2 MB
      </p>
    </>
  );
}
export default EducationForm;
