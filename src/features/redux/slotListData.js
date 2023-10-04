import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    // professionalSignUpViewIndex:0,
    slotList:{},
    setshowBookButton:false
  }

export const slotSlice = createSlice({
  name: 'slotListData',
  initialState,
  reducers: {
    setSlotList: (state, action) => {
      state.slotList= action.payload
    },
    setshowBookButton :(state, action)=>{
      state.setshowBookButton = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSlotList, setshowBookButton } = slotSlice.actions
export const selectSlotList = (state) => state.slotListData.slotList;
export default slotSlice.reducer