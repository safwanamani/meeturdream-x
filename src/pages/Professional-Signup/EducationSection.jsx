import React from "react";
import { useState,useEffect } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import {  useDispatch } from 'react-redux'
import { setProfessionalSignUpViewIndex } from '../../features/redux/pageData'
import EducationForm from "./EducationForm";
const Education = ({values,handleChange}) => {
    let [educationDetails,setEducationDetails]=useState([{university:'',degree:'',fromYear:'',toYear:'',attachment:''}])
    useEffect(()=>{
        let educationDetailsArray=educationDetails.map((educationDetailObj)=>{
            if(educationDetailObj?.educationObj){
                educationDetailObj=educationDetailObj.educationObj
               
            }
             return educationDetailObj
        })
        educationDetails=educationDetailsArray
      },[educationDetails])
    const incrementEducationForm = () => {
        let emptyObj={university:'',degree:'',fromYear:'',toYear:'',attachment:''}
        setEducationDetails(current => [...current, emptyObj]);
      values.educationData.push(emptyObj)
    }
    const deleteEducation = (index) => {
        if (educationDetails.length === 1 && index === 0) {
            let emptyObj={university:'',degree:'',fromYear:'',toYear:'',attachment:''}
            setEducationDetails([emptyObj]);
            values.educationData = [emptyObj]
        } else {
            educationDetails.splice(index, 1)
            let valuesEducationData = values.educationData
            valuesEducationData.splice(index, 1)
            setEducationDetails(educationDetails)
            values.educationData = valuesEducationData
        }
    }
    const dispatch = useDispatch()
    const changeFormStep=(e,step)=>{
        e.preventDefault()
        dispatch(setProfessionalSignUpViewIndex(step))
    }

    return (
        <>
            <div className='p-4 md:p-8 bg-white'>
                <div className='header flex justify-between pb-8'>
                    <h2 className='text-xl font-bold'>Education <span className="text-sm"> (Optional)</span></h2>
                    <span className='py-1 px-3 bg-[#eeb738af] rounded-lg text-sm'>Step <b className='text-md'>2/6</b></span>
                </div>

                <form action="">
                    {
                        values.educationData.map((educationObj,index)=>
                        <EducationForm key={index} index={index} educationDetails={educationDetails} setEducationDetails={setEducationDetails} educationObj={educationObj} handleChange={handleChange} deleteEducation={deleteEducation} />)
                    }
                    <div className="flex gap-2">
                        <p className="font-bold text-ld text-[#153D57] flex items-center gap-1 py-3 cursor-pointer"  onClick={() => incrementEducationForm()} style={{ cursor: 'pointer' }}>
                            <AiOutlinePlus size={22} /> Add Another Education
                        </p>
                    </div>

                    <div className="justify-end flex gap-3">
                        <button onClick={(e) => {
                        changeFormStep(e,0)}} className="font-semibold text-md py-3 px-6 text-black rounded-md border-1 hover:bg-gray-100">Back</button>
                        <button onClick={(e) => { 
                        changeFormStep(e,2)}} className="bg_primary font-semibold text-md py-3 px-6 text-white rounded-md">Next</button>
                    </div>
                </form>

            </div>
        </>
    )
}
export default Education