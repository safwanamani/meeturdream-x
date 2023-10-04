import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name:'',
    email:'',
    area:'',
    specializedArea:'',
    languageLevel:[{
      languageSpoken:'',
      level:''
    }],
    countryOfOrigin:'',
    profileImage:'',
    education:[{
      university:'',
      degree:'',
      fromYear:'',
      toYear:'',
      attachment:''
    }],
    certification:[{
      certificateName:'',
      certificateAuthority:'',
      certificateNumber:'',
      attachment:''
    }],
    bio:'',
    resume:'',
    selfVideo:'',
    base:'',
    ratePerHour:'',
    baseRate:'',
    availablity:'',
    referralCode:'',
    isProfessionalBlocked:false
  }

export const professionalsDataSlice = createSlice({
  name: 'professionalsData',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name=action.payload
    },
    setEmail: (state, action) => {
      state.email=action.payload
    },
    setArea: (state, action) => {
      state.area=action.payload
    },
    setSpecializedArea: (state, action) => {
      state.specializedArea=action.payload
    },
    setLanguageLevel: (state, action) => {
      state.languageLevel.push(action.payload)
    },
    setCountryOfOrigin: (state, action) => {
      state.countryOfOrigin=action.payload
    },
    setProfileImage: (state, action) => {
      state.profileImage=action.payload
    },
    setIsProfessionalBlocked:(state, action)=> {
      state.isProfessionalBlocked=action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setName,setEmail,setArea,setSpecializedArea,setLanguageLevel,setCountryOfOrigin,setProfileImage,setIsProfessionalBlocked } = professionalsDataSlice.actions
export const selectProfessionalsData = (state) => state.professionalsData;
export default professionalsDataSlice.reducer