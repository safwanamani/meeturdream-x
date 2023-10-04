import React from "react";
import {BsCheckCircleFill} from 'react-icons/bs'
const LanguageSection = ({languageArray}) => {
    return (
        <>
            <div className="detail_box">
                <div className="head_wrap">
                    <h2 className="title">Language</h2>
                </div>
                <hr />
                <div className="p-4">
                    {languageArray.map((langObj)=>
                        <p className="font-bold text-md pb-3  flex items-center gap-2">
                            <BsCheckCircleFill color="green"  /> 
                                {langObj?.language} 
                            <span className="bg-green-200 text-sm text-green-800 font-medium px-4 py-1 rounded-full ml-2">
                                {langObj.language.pivot.profeciency_level}
                            </span> 
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
export default LanguageSection;