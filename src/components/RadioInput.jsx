import React from "react";

let RadioInput = ({ id, value,setReason, name, setIsOther, setIsDisable }) => {
  let UpdateStatus = (val) => {
    setReason(value)
    if (val == "Other") {
      setIsOther(true);
      setIsDisable(true);
    } else {
      setIsOther(false);
      setIsDisable(false);
    }
  };
  return (
    <div className="flex mb-4" onClick={() => UpdateStatus(value)}>
      <input
        id={id}
        type="radio"
        value={value}
        name={name}
        className="w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
      />
      <label className="ml-2 text-md font-medium text-[#000] cursor-pointer" htmlFor={id}>
        {value}
      </label>
    </div>
  );
};

export default RadioInput;
