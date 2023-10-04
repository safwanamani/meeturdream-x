import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
const ProcessingButton = ({button}) => {
  return (
    <button id="processing-button"
      className={button === "checkoutButton" ? `mt-2 rounded-sm text-gray-600 bg_primary text-2xl py-3 px-3 mb-2 w-full items-center opacity-75` : button === "requestButton" ? `btn_primary w-full bg_primary rounded-full mb-3 py-3 text-white opacity-75` : `btn_primary w-full bg_primary rounded-sm mt-3 py-3 text-white opacity-75`}
      disabled
    >
      <div className="flex justify-center">
        <div className="my-auto pt-[2px]">
          <LoadingSpinner />
        </div>
        <span>Processing...</span>
      </div>
    </button>
  );
};

export default ProcessingButton;
