import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    chatItem:{},
  }

export const chatItem = createSlice({
  name: 'chatItem',
  initialState,
  reducers: {
    setChatItem: (state, action) => {
      state.chatItem= action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setChatItem } = chatItem.actions
export const selectChatItem = (state) => state.chatData.chatItem;
export default chatItem.reducer