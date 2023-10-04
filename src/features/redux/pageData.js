import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    professionalSignUpViewIndex:0,
  }

export const pageSlice = createSlice({
  name: 'pageData',
  initialState,
  reducers: {
    setProfessionalSignUpViewIndex: (state, action) => {
      state.professionalSignUpViewIndex= action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setProfessionalSignUpViewIndex } = pageSlice.actions
export const selectProfessionalSignUpViewIndex = (state) => state.pageData.professionalSignUpViewIndex;
export default pageSlice.reducer