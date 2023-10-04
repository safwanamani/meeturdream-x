import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../Api/GeneralApi";

const ContactUsModal = ({setModal}) => {
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [message, setMessage] = useState("")
    const submitContact = () => {
        setLoading(true)
        let contact = {
            name,
            email,
            address,
            message
        }
        api.contactUs(contact).then(({data}) => {
            setLoading(false)
            if (data.status === true) {
                toast.current.show({ severity: "success", summary: "Success", detail: data.message, life:3000})
                setTimeout(() => {
                    setModal(false)
                }, 2000)
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: data.message, life:3000})
            }
        }).catch((err) => {
            toast.current.show({ severity: "error", summary: "Error", detail: "Internal server error", life:3000})
        })
    }
    return (
        <>
        <Toast ref={toast} />
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto min-w-[300px] md:min-w-[600px]">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold">Contact Our Team</h3>
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
                    <div className="form-group">
                        <label className="font-semibold">Name <span className="text-red-500">*</span></label>
                        <input
                        type="text"
                        value={name}
                        className="form-control-stroke"
                        placeholder="Enter your name"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="font-semibold">Email <span className="text-red-500">*</span></label>
                        <input
                        type="email"
                        value={email}
                        className="form-control-stroke"
                        placeholder="Enter your email"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                        <input
                        type="text"
                        value={address}
                        className="form-control-stroke"
                        placeholder="Enter your address"
                        onChange={(e) => {
                            setAddress(e.target.value)
                        }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="font-semibold">Message <span className="text-red-500">*</span></label>
                        <textarea value={message} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."
                        onChange={(e) => {
                            setMessage(e.target.value)
                        }}></textarea>
                    </div>
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
                    className={`bg_primary text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${loading ? "" : "uppercase"}`}
                    type="button"
                    onClick={submitContact}
                  >
                    {loading ? 
                      <div className="flex justify-center">
                        <div className="my-auto pt-[2px]">
                          <LoadingSpinner />
                        </div>
                        <span>Processing...</span>
                      </div>
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default ContactUsModal;