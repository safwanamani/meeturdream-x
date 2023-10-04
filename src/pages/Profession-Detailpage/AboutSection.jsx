import React from "react";

const AboutSection = ({about}) => {
    return (
        <>
            <div className="detail_box">
                <div className="head_wrap">
                    <h2 className="title">About</h2>
                </div>
                <hr />
                <div className="p-4">
                    <p className="leading-8">{about}</p>
                </div>
            </div></>
    )
}
export default AboutSection;