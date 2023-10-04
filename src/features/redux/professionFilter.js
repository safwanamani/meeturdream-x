import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  professionList: {},
  directSearchProfession: false,
  directSearch:false,
  searchKeyWord:''
}

export const professorSlice = createSlice({
  name: 'professionListData',
  initialState,
  reducers: {
    setProfessionList: (state, action) => {
      state.professionList = action.payload
    },
    setDirectSearchProfession: (state, action) => {
      state.directSearchProfession = action.payload
    },
    setDirectSearch: (state, action) => {
      state.directSearch = action.payload
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyWord = action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const { setProfessionList, setDirectSearchProfession,setDirectSearch,setSearchKeyword } = professorSlice.actions
export const selectProfessionList = (state) => state.professionListData.professionList;
export const getDirectSearch = (state) => state.professionListData.searchKeyWord;

export default professorSlice.reducer