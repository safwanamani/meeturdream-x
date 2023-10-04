import React,{useState} from "react";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { useDispatch } from 'react-redux'
import {setProfessionalSignUpViewIndex}  from '../../features/redux/pageData'
import CertificationForm from "./CertificationForm";

const Certification = ({values}) => {
    const dispatch=useDispatch()
    let [certificationData,setCertificationData]=useState([{
        certificationName:'',
        certificationNumber:'',
        certificationAuthority:'',
        attachement:''
      }])
    const incrementCertificationForm = () => {
        let emptyObj={
            certificationName:'',
            certificationNumber:'',
            certificationAuthority:'',
            attachement:''
          }
        setCertificationData(current => [...current, emptyObj]);
        values.certificationData.push(emptyObj)
    }
    const deleteCertification = (index) => {
        if (certificationData.length === 1 && index === 0) {
            let emptyObj={
                certificationName:'',
                certificationNumber:'',
                certificationAuthority:'',
                attachement:''
            }
            setCertificationData([emptyObj])
            values.certificationData = [emptyObj]
        } else {
            let currentCertificationData = certificationData.slice()
            currentCertificationData.splice(index, 1)
            let valuesCertificationData = values.certificationData.slice()
            valuesCertificationData.splice(index, 1)
            setCertificationData(currentCertificationData)
            values.certificationData = valuesCertificationData
        }
    }
    const changeFormStep=(e,step)=>{
        e.preventDefault()
        dispatch(setProfessionalSignUpViewIndex(step))
    }
    return (
        <>
            <div className='p-4 md:p-8 bg-white'>
                <div className='header flex justify-between pb-8'>
                    <h2 className='text-xl font-bold'>Certification <span className="text-sm"> (Optional)</span></h2>
                    <span className='py-1 px-3 bg-[#eeb738af] rounded-lg text-sm'>Step <b className='text-md'>3/6</b></span>
                </div>
                <form action="">
                     {values.certificationData.map((certificationObj,index)=>
                        <CertificationForm key={index} index={index} certificationData={certificationData} setCertificationData={setCertificationData} certificationObj={certificationObj} deleteCertification={deleteCertification} />)}
                    <div className="flex gap-4">
                        <p className="font-bold text-ld text-[#153D57] flex items-center gap-1 py-3"  onClick={() => incrementCertificationForm()} style={{ cursor: 'pointer' }}>
                        <AiOutlinePlus size={22} /> Add Another Certification
                    </p>
                    </div>
                    
                    <div className="justify-end flex gap-3">
                    <button onClick={(e)=>{changeFormStep(e,1)}} className="font-semibold text-md py-3 px-6 text-black rounded-md border-1 hover:bg-gray-100">Back</button>
                        <button className="bg_primary font-semibold text-md py-3 px-6 text-white rounded-md" onClick={(e)=>{changeFormStep(e,3)}}>Next</button>
                    </div>
                </form>

            </div>
        </>
    )
}
export default Certification