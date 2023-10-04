import React, { useEffect, useState, useRef } from "react";
import logo from '../assets/logo.png';
import { AiOutlineClose } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';
import { useParams } from "react-router-dom";
import api from "../Api/GeneralApi";
import useDebounce from "../components/Hooks/useDebounce";
import ReferalLinkSucess from "./ReferalLinkSucess";
import { Toast } from "primereact/toast";

const Referal = () => {
    const toast = useRef(null)
    const { referral_code } = useParams()
    const [searchTerm, setSearchTerm] = useState("")
    const [referral, setReferral] = useState({
        status: false,
        name: "",
        referral_code: ""
    })
    const [user, setUser] = useState({
        name: "",
        email: "",
        cost_per_min: ""
    })
    const [submitStatus, setSubmitStatus] = useState(false)
    const [userStatus, setUserStatus] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    useEffect(() => {
        setSearchTerm(referral_code)
    },[])
    useEffect(() => {
        if (searchTerm.length > 0) {
            verifyReferral(debouncedSearchTerm)
        }
    },[debouncedSearchTerm])

    const verifyReferral = (code) => {
        api.verifyReferralCode({refer_code: code}).then(({data}) => {
            if (data.status === true) {
                setReferral({
                    status: true,
                    name: data?.refer_data?.name,
                    referral_code: data?.refer_data?.reference_code
                })
            } else {
                setReferral({
                    status: false,
                    name: "",
                    referral_code: searchTerm
                })
            }
        })
    }
    const setUserData = (value, type) => {
        setUser(prev => ({
            ...prev,
            [type]: value
        }))
    }
    const acceptReferral = (status) => {
        let payload = {
            refer_code: referral.referral_code,
            name: user.name,
            email: user.email,
            rate_per_minute: user.cost_per_min,
            status: status
        }
        api.acceptReferralCode(payload).then(({data}) => {
            if (data.status) {
                setUserStatus(status)
                setSubmitStatus(true)
                if (status === "approve") {
                    toast.current.show({severity: "success", summary: "Success", detail: data.message, life:3000})
                } else {
                    toast.current.show({severity: "error", summary: "Success", detail: data.message, life:3000})
                }
            } else {
                toast.current.show({severity: "error", summary: "Error", detail: data.message, life: 3000})
            }
        })
    }
    return (
        <div>
            <Toast ref={toast}/>
            <div className="h-[17px] bg-[#153d57] w-full" ></div>
            <div className="max-w-[500px] pt-5 mx-auto">
                <div className="m-2 px-5 py-10 border text-center rounded-lg">
                    {submitStatus ? (
                        <ReferalLinkSucess status={userStatus} />
                    ): (
                        <>
                            <img src={logo} width="80" className="mx-auto pb-3" alt="" />
                            <h2 className="text-2xl font-black capitalize">Welcome to Meet Ur Dream</h2>
                            <p className="text-[16px]">Earn daily money by refereeing yourself</p>
                            <div className="my-5">
                                <input type="text" className="bg-[#eeeeee] h-[45px] border p-4 rounded-full" placeholder="Enter referral code" value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                }}/>
                            </div>
                            {referral?.status === true ? 
                            <>
                                <div className="text-left">
                                    <p className="text-[14px] text-center">Mr <span className="capitalize">{referral?.name}</span> has referred you to install the application</p>
                                    <div className="pb-5 p-4 bg-[#f7f7f7] mt-5 rounded-lg">
                                        <div className="text-center">
                                            <h3 className="mb-2">Enter your details</h3>
                                        </div>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" className="border p-2 rounded-md w-full" 
                                            value={user.name}
                                            onChange={(e) => setUserData(e.target.value, "name")} />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="border p-2 rounded-md w-full"
                                            value={user.email}
                                            onChange={(e) => setUserData(e.target.value, "email")} />
                                        </div>
                                        <div className="form-group">
                                            <label>Cost Per Min</label>
                                            <input type="number" min={0} className="border p-2 rounded-md w-full"
                                            value={user.cost_per_min}
                                            onChange={(e) => {
                                                var t = e.target.value;
                                                e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
                                                setUserData(e.target.value, "cost_per_min")}
                                            } />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-5 justify-center">
                                    <button className="py-2 rounded-full px-5 text-white bg-red-800 flex items-center gap-1 hover:bg-red-900 transition-all"
                                        onClick={() => acceptReferral("reject")}>
                                            <AiOutlineClose />Reject
                                    </button>
                                    <button className="py-2 rounded-full px-5 text-white bg-green-800 flex items-center gap-1 hover:bg-green-900 transition-all"
                                        onClick={() => acceptReferral("approve")}>
                                            <MdDone />Accept
                                    </button>
                                </div>
                            </> : null
                            }
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Referal;