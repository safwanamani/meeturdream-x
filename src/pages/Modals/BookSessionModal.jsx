import React from "react";
import { useState } from "react";
import { useDispatch,useSelector  } from 'react-redux'
import ScheduleSection from "../Profession-Detailpage/ScheduleSection";
import {setshowBookButton} from '../../features/redux/slotListData'
import { selectIsLoggedIn } from "../../features/redux/auth";
import {selectSlotList} from '../../features/redux/slotListData'
import { setSlotList } from '../../features/redux/slotListData'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookSessionModal = ({ setModal,professionalDetails }) => {
  const slotObj=useSelector(selectSlotList)
  const [selectedDate,setSelectedDate]=useState(null)
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const isLoggedIn=useSelector(selectIsLoggedIn)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
useEffect(()=>{
  if(!isLoggedIn){
    navigate('/sign_in')
  }
  console.log("professionalDetails",professionalDetails)
},[])
  const closeBooksession =()=>{
    setModal(false); 
    dispatch(setshowBookButton(false))
    if(slotObj){  
      dispatch(setSlotList({}))
    }

  }
  return (

    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" onClick={() => { if (isCalendarVisible) { setIsCalendarVisible(false) }}}>
        <div className="w-full h-full">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">Schedule</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {closeBooksession()}}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <ScheduleSection professionalDetails={professionalDetails} selectedDate={selectedDate} setSelectedDate={setSelectedDate} isCalendarVisible={isCalendarVisible} setIsCalendarVisible={setIsCalendarVisible} />
            </div>
            {/*footer*/}
          </div>
        </div>
        </div>  
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
    
  );
};

export default BookSessionModal;
