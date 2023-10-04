import React from "react";
import "./404.css";
import { ReactComponent as ErrorEmoji } from "../../assets/errorEmoji.svg"
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
    const navigate = useNavigate()
    return (
        <div className="bg-gray-100 h-screen justify-center flex">
            <div className="my-auto">
                <center className="m-auto">
                    <ErrorEmoji />
                    <div className=" tracking-widest mt-4">
                        <span className="text-gray-500 text-6xl block"><span>4  0  4</span></span>
                        <span className="text-gray-500 text-xl">Sorry, We couldn't find what you are looking for!</span>

                    </div>
                </center>
                <center className="mt-6">
                    <a onClick={() => navigate(-1)} className="text-gray-500 cursor-pointer font-mono text-xl bg-gray-200 p-3 rounded-md hover:shadow-md">Go back </a>
                </center>
            </div>
        </div>
    )
}

export default ErrorPage;