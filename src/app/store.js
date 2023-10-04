import { configureStore } from '@reduxjs/toolkit'
import  authReducer  from '../features/redux/auth'
import pageData from '../features/redux/pageData'
import professionalsData from '../features/redux/professionalsData'
import slotListData from '../features/redux/slotListData'
import professionFilter from '../features/redux/professionFilter'
import chatData from '../features/redux/chatData'
export const store = configureStore({
  reducer: {
    auth:authReducer,
    pageData:pageData,
    professionalsData:professionalsData,
    slotListData:slotListData,
    professionFilter:professionFilter,
    chatData:chatData
  },
})