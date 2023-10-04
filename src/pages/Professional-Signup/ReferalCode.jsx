import React, { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpinner from "../../components/LoadingSpinner";
import { setProfessionalSignUpViewIndex } from '../../features/redux/pageData'
import api from '../../Api/AuthApi'
import { Toast } from "primereact/toast";
import { getUserDetails, userDetailsFetch } from "../../features/redux/auth";
const Refferal = ({values}) => {
    const dispatch = useDispatch()
    let userDetails = useSelector(getUserDetails)
    const toast = useRef(null)
    const [loading,setLoading]=useState(false)
    const uploadFile=(file)=>{
        if(file) {
            const reader = new FileReader();
            reader.onload = (e) =>{
              const res = e.target?.result;
            };
      
            return reader.readAsBinaryString(file);
          }
    }
    const getSlots=()=>{
        let professional_custom_slots=[]
        let professional_preferred_slots=[]
        values.slotArray.forEach((slotObj)=>{

              if(slotObj.type==="customSlot"){
                let customSlotArr=slotObj.customSlots.map((customSlotObj)=>{
                    return {
                        'start_time':customSlotObj.fromTime,
                        'end_time':customSlotObj.toTime
                    }
                })
                let obj={
                    'day':slotObj.day,
                    'slot':customSlotArr
                }
                professional_custom_slots.push(obj)
              }else if(slotObj.type==='oneHourSlot'){
                let obj={
                    'day':slotObj.day,
                    'slot':slotObj.fixedSlots
                }
                professional_preferred_slots.push(obj)
              }
        })
        return [professional_custom_slots,professional_preferred_slots]
    }
    const professionalSignUp =async()=>{
        setLoading(true)
        let submitData = new FormData();
        submitData.append("name", values.name)
        values.languageLevel.forEach((langobj, i)=>{
            submitData.append(`professional_languages[${i}][language_id]`,langobj.langObject.id)
            submitData.append(`professional_languages[${i}][profeciency_level]`, langobj.level)
        })
        submitData.append("country_id", values.countryOfOrigin.id)
        submitData.append("base_rate", values.baseHourlyPrice)
        if (values.timeZone === undefined) {
            values.timeZone = ""
        }
        submitData.append("time_zone", values.timeZone)
        if (values.otherCategoryStatus) {
            submitData.append("other", true)
            submitData.append("category_name", values.otherCategoryName)
        } else {
            submitData.append("sub_category_id", values.specializedArea.id)
            submitData.append("category_id", values.area.id)
        }
        submitData.append("profile_image", values.profileImage)
        submitData.append("work_experience", values.workExperience)
        values.educationData.forEach((edObj, i)=>{
            if (edObj.university !== "" || edObj.degree !== "" || edObj.fromYear !== "" || edObj.toYear !== "") {
                submitData.append(`professional_educations[${i}][university_name]`, edObj.university)
                submitData.append(`professional_educations[${i}][degree_name]`, edObj.degree)
                submitData.append(`professional_educations[${i}][from_year]`, edObj.fromYear)
                submitData.append(`professional_educations[${i}][to_year]`, edObj.toYear)
                if (edObj.attachemnt === undefined) {
                    edObj.attachemnt = ""
                }
                submitData.append(`professional_educations[${i}][uploaded_certificate]`, edObj.attachemnt)
            }     
        })
        values.certificationData.forEach((certObj, i)=>{
            if (certObj.certificationName !== "" || certObj.certificationAuthority !== "" || certObj.certificationNumber !== "") {
                submitData.append(`professional_certifications[${i}][certification_name]`, certObj.certificationName)
                submitData.append(`professional_certifications[${i}][certification_authority]`, certObj.certificationAuthority)
                submitData.append(`professional_certifications[${i}][certification_number]`, certObj.certificationNumber)
                if (certObj.attachemnt === undefined) {
                    certObj.attachemnt = ""
                }
                submitData.append(`professional_certifications[${i}][uploaded_certificate]`, certObj.attachemnt)
            }
        })
        submitData.append("description", values.introduceYourself)
        submitData.append("intro_video", values.resumeFile)
        let professional_custom_slots = getSlots()[0]
        professional_custom_slots.forEach((customSlot, i) => {
            submitData.append(`professional_custom_slots[${i}][day]`, customSlot.day)
            customSlot.slot.forEach((slot, index) => {
                submitData.append(`professional_custom_slots[${i}][slot][${index}][start_time]`, slot.start_time)
                submitData.append(`professional_custom_slots[${i}][slot][${index}][end_time]`, slot.end_time)
            })
        })
        let professional_predefind_slots = getSlots()[1]
        professional_predefind_slots.forEach((predefinedSlot, i) => {
            submitData.append(`professional_predefind_slots[${i}][day]`, predefinedSlot.day)
            predefinedSlot.slot.forEach((slot, index) => {
                submitData.append(`professional_predefind_slots[${i}][slot][${index}][predefined_slot_id]`, slot)
            })
        })
        if (values.referenceNumber !== undefined) {
            submitData.append("referance_code", values.referenceNumber)
        }
        //api calling
        await api.professionalSignUp(submitData).then(({data})=>{
            if(data.status===true){
                toast.current.show({severity: "success", summary: "Success", detail: data.message, life: 3000})
                setLoading(false)
                userDetails = {...userDetails, professional_status: true}
                dispatch(userDetailsFetch(userDetails))
                setTimeout(() => {
                    dispatch(setProfessionalSignUpViewIndex(6))
                }, 300)
            }else{
                toast.current.show({severity: "error", summary: "Error", detail: data.message, life: 3000})
                setLoading(false)
            }
        }).catch((err)=>{
            setLoading(false)
            toast.current.show({severity: "error", summary: "Error", detail: 'Internal server error', life: 3000})
            console.log('Internal Server',err)
        })
    }
    return (
        <>
        <Toast ref={toast} ></Toast>
            <div className='p-4 md:p-8 bg-white'>
                <div className='header flex justify-between pb-8'>
                    <h2 className='text-xl font-bold'>Referral Code</h2>
                    <span className='py-1 px-3 bg-[#eeb738af] rounded-lg text-sm'>Step <b className='text-md'>6/6</b></span>
                </div>

                <div className="text-center pb-28">
                    <h2 className="text-2xl font-black">Enter Referral Code</h2>
                    <input type="text" onChange={(e)=>values.referenceNumber=e.target.value} className="bg-gray-200 h-[50px] rounded-full mt-3 p-4" name="" id="" />
                </div>
                <div className="justify-end flex gap-3">
                  <div className=" flex gap-3 justify-end">
                    <button className="font-semibold text-md py-3 px-6 text-black rounded-md border-1 hover:bg-gray-100 border-2" onClick={(e)=>{
                        e.preventDefault()
                        dispatch(setProfessionalSignUpViewIndex(4))
                    }}>
                        Back
                    </button>
                    <button className="bg_primary font-semibold text-md py-3 px-6 text-white rounded-md" onClick={(e)=>{
                        e.preventDefault()
                        professionalSignUp()
                    }}> 
                        {loading?<LoadingSpinner />:"Done"}
                    </button>
                  </div>
                </div>
            </div>
        </>
    )
}
export default Refferal