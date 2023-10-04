import React,{useEffect,useState} from "react";
import ResumeEducationSection from "./ResumeEducationSection";
import api from "../../Api/GeneralApi"
import ResumeCertificationSection from "./ResumeCertificationSection";

const ResumeSection = ({professionalId}) => {
    const [resumeDetails,setResumeDetails]=useState([])
    useEffect(() => {
      getProfessionalResumeDetails()
    }, [])
    const getProfessionalResumeDetails=()=>{
        const userDetails=JSON.parse(localStorage.getItem('professionalsDetails'))
        api.getResumeDetails({professional_id:userDetails.id})
            .then((data)=>{
                if(data.status){
                    setResumeDetails(data?.resume)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }
    return (
        <>
            <div className="detail_box">
                <div className="p-5 head_wrap">
                    <h2 className="title">Resume</h2>
                </div>
                <hr />
                <div className="p-4">
                    <div className="pb-4">
                        <ResumeEducationSection educationDetails={resumeDetails?.educations}/>
                    </div>
                    <hr />
                    <div className="py-4">
                       <ResumeCertificationSection certificationDetails={resumeDetails?.certification}/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ResumeSection;