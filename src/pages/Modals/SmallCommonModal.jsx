import React from "react";

const SmallCommonModal = ({setModal, submitFunction, bodyText}) => {
    const setSubmit = () => {
        setModal(false)
        submitFunction()
    }
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                {bodyText}
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
              <button
                className="font-bold uppercase text-sm px-6  mr-1 mb-1 text-black py-2"
                type="button"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button
                className="font-bold uppercase text-sm px-6  mr-1 mb-1 text-black"
                type="button"
                onClick={() => setSubmit()}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default SmallCommonModal;