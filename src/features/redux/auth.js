import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userDetails:localStorage.getItem('userDetails')!=undefined?JSON.parse(localStorage.getItem('userDetails')):{},
  isLoggedIn:JSON.parse(localStorage.getItem('isLoggedIn'))||false,
  registeredEmailAddress:''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedInValue: (state, action) => {
      state.isLoggedIn=action.payload
      localStorage.setItem('isLoggedIn',action.payload)
    },
    userDetailsFetch: (state, action) => {
      state.userDetails= action.payload
      localStorage.setItem('userDetails',JSON.stringify(action.payload))
    },
    setRegisteredMailAddress: (state, action) => {
      state.registeredEmailAddress= action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoggedInValue,userDetailsFetch,setRegisteredMailAddress } = authSlice.actions
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const getRegisteredMailAddress=(state)=>state.auth.registeredEmailAddress
export const getUserDetails=(state)=>state.auth.userDetails
export default authSlice.reducer