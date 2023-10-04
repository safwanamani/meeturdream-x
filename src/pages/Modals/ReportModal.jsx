import React, { useRef, useState } from "react";
import RadioInput from "../../components/RadioInput";
import api from '../../Api/GeneralApi';
import {Toast}  from "primereact/toast"
const ReportModal = ({ setModal,professionalId }) => {
  const toast = useRef(null)
  const [isOther, setIsOther] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [reason, setReason] = useState('');
  const reasons = [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    "Contrary to popular belief, Lorem Ipsum is not simply random text",
    "There are many variations of passages of Lorem Ipsum available",
    "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary",
  ];
  function reportProfessionalApiCall(){
    api.reportProfessional({"professional_id":professionalId,'message':reason}).then((data)=>{
      if(data.status==true){
        toast.current.show({severity: "success", summary: "Success", detail: data.message, life: 3000})
        setModal(false)
      } else {
        toast.current.show({severity: 'error', summary: "Error", detail: data.message})
      }
    }).catch((err)=>{
      console.log('err',err)
    })

  }
  return (
    <>
    <Toast ref={toast}></Toast>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Report</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {reasons.map((reason, key) => (
                <RadioInput
                  key={key}
                  id={key}
                  value={reason}
                  setReason={setReason}
                  name="report"
                  setIsOther={setIsOther}
                  setIsDisable={setIsDisable}
                />
              ))}
              <RadioInput
                value="Other"
                id="Other"
                setReason={setReason}
                name="report"
                setIsOther={setIsOther}
                setIsDisable={setIsDisable}
              />
              {isOther ? (
                <textarea
                  name="reason"
                  rows="3"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your reason..."
                  onChange={(e) => {
                    if (e.target.value) {
                      setReason(e.target.value)
                      setIsDisable(false);
                    } else {
                      setIsDisable(true);
                    }
                  }}
                ></textarea>
              ) : null}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                className={`bg_primary text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                  isDisable ? "opacity-75 active:bg-emerald-600" : ""
                }`}
                type="button"
                disabled={isDisable}
                onClick={()=>{
                  reportProfessionalApiCall()
                }}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ReportModal;
