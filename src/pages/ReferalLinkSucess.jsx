import React from "react";
import succcess from '../assets/success.gif';
import error from "../assets/error.gif"
import { useEffect } from "react";

const ReferalLinkSucess = ({status}) => {
    useEffect(() => {
        if (status === "approve")
            setTimeout(() => {
                let mobileStatus = navigator?.userAgentData?.mobile
                let platform = navigator?.userAgentData?.platform
                let baseUrl = "https://play.google.com/store/apurdream"
                let iosUrl = "https://apps.apple.com/in/eam5162"
                let otherUrl = "https://play.google.com/store/apps/detdream"
                if (mobileStatus) {
                    if (platform === "Android") {
                        baseUrl = otherUrl
                    } else if (platform === "iPhone" || navigator?.platform === "MacIntel" || navigator?.platform === "iPhone") {
                        baseUrl = iosUrl
                    } else {
                        baseUrl = otherUrl
                    }
                } else {
                    if (platform === "macOS" || navigator?.platform === "MacIntel" || navigator?.platform === "iPhone") {
                        baseUrl = iosUrl
                    } else {
                        baseUrl = otherUrl
                    }
                }
                window.location.href = baseUrl
            }, 1500);
        },[])
    return (
        <div>
            <img src={status === "approve" ? succcess : error} width="300" className="mx-auto" alt="" />
            <h2 className="py-4 text-xl text-bold">{status === "approve" ? "Approved" : "Rejected"}</h2>
        </div>
    )
}

export default ReferalLinkSucess;