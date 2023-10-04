import React from 'react'
import { useState } from 'react'
import Certification from './Certification'
import Education from './EducationSection'
import PricingAvail from './Pricing'
import ProfileDescription from './ProfileDescription'
import ProfileSection from './ProfileSection'
import Refferal from './ReferalCode'
import Submitted from './Submit'
import profilenone from "../../assets/NoneProfile.png";

function FormView({professionalSignUpViewIndex}) {
  const [name, setName] = useState("")
  const [area,setArea]=useState('')
  const [specializedArea,setSpecializedArea]=useState('')
  const [profileImage,setProfileImage]=useState(profilenone)
  const [countryOfOrigin,setCountryOfOrigin]=useState('')
  const [countryId,setCountryId]=useState(0)

  const [languageLevel,setLanguageLevel]=useState([{
    languageSpoken:'',
    level:''
  }])
  let [educationData,setEducationData]=useState([{
    university:'',
    degree:'',
    toYear:'',
    fromYear:'',
    attachement:''
  }])
  let [certificationData,setCertificationData]=useState([{
    certificationName:'',
    certificationNumber:'',
    certificationAuthority:'',
    attachement:''
  }])
  const [isProfileImageSelected,setIsProfileImageSelected]=useState(false)
  const [introduceYourself,setIntroduceYourself]=useState('')
  const [resumeFile,setResumeFile]=useState('')
  const [resumeFileObj,setResumeFileObj]=useState()
  const [baseHourlyPrice,setBaseHourlyPrice]=useState()
  const [timeZone,setTimeZone]=useState()
  const [slotAvailablity,setSlotAvailablity]=useState('')
  const [oneHourSlotArray,setOneHourSlotArray]=useState([])
  const [proImage,setProImage]=useState(profilenone)
  const [otherCategoryStatus, setOtherCategoryStatus] = useState(false)
  const [otherCategoryName, setOtherCategoryName] = useState('')
  const [workExperience, setWorkExperience] = useState(0)
  const [slotArray,setSlotArray]=useState([{day:'',slotType:'',fixedSlots:[],customSlots:[{fromTime:'00:00:00',toTime:'00:00:00'}]}])
    const handleChange=(type,value)=>{
      switch (type) {
        case 'name':
          setName(value)
          break;
        case 'area':
            setArea(value)
          break;
        case 'specializedArea':
          setSpecializedArea(value)
          break;
        case'profileImage':
          setProfileImage(value)
          setIsProfileImageSelected(true)
          break;
        case'countryOfOrigin':
          setCountryOfOrigin(value)
        break;
        case'countryid':
          setCountryId(value)
        break;
        case'languageLevel':
        value.forEach((obj)=>{
          setLanguageLevel(obj)
        })
        break;
        case 'educationDetails':
          setEducationData(value)
          break;
        case 'certificationDetails':
        setCertificationData(value)
        break;
        case 'introduceYourself':
          setIntroduceYourself(value)
          break;
        case 'resumeFile':
          setResumeFile(value)
          setResumeFileObj(value)
          values.resumeFileObj=value
          break;
        case 'baseHourlyPrice':
          setBaseHourlyPrice(value)
          break;
        case 'timeZone':
          setTimeZone(value)
          break;
        case 'slotAvailablity':
          setSlotAvailablity(value)
          break;
        case 'oneHourSlot':
          setOneHourSlotArray(value)
          break;
        case 'slot':
          setSlotArray(value)
          break;
        case 'proImage':
          setProImage(value)
          break;
        case 'otherCategoryStatus':
          setOtherCategoryStatus(value)
          break;
        case 'otherCategoryName':
          setOtherCategoryName(value)
          break;
        case 'workExperience': 
          setWorkExperience(value)
          break;
        default:
          console.log("break". type, value)
          break;
      }
    }
    const values={name,area,specializedArea,profileImage,isProfileImageSelected,countryOfOrigin,languageLevel,educationData,certificationData,introduceYourself,resumeFile,resumeFileObj,baseHourlyPrice,timeZone,slotAvailablity,oneHourSlotArray,slotArray,countryId,proImage, otherCategoryStatus, otherCategoryName, workExperience}
  return (
    <div className='container mx-auto max-w-[900px] py-5'>
          {professionalSignUpViewIndex===0&&<ProfileSection  values={values} handleChange={handleChange} languageLevel={languageLevel} setLanguageLevel={setLanguageLevel} />}
          {professionalSignUpViewIndex===1&& <Education values={values} handleChange={handleChange} />}
          {professionalSignUpViewIndex===2&&<Certification values={values} handleChange={handleChange}  />}
          {professionalSignUpViewIndex===3&&<ProfileDescription values={values} handleChange={handleChange} />}
          {professionalSignUpViewIndex===4&&<PricingAvail  values={values} handleChange={handleChange}/>}
          {professionalSignUpViewIndex===5&&<Refferal values={values} handleChange={handleChange} />}
          {professionalSignUpViewIndex===6&&<Submitted  /> }
          
    </div>
  )
}

export default FormView