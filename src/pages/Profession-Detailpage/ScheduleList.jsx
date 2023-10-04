
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSlotList, setshowBookButton, selectSlotList } from '../../features/redux/slotListData'
import { useNavigate } from "react-router-dom"
import { getUserDetails, selectIsLoggedIn } from '../../features/redux/auth'
import moment from 'moment'
function ScheduleList({ professionalDetails, selectedDate, data }) {
  const slotObject = useSelector(selectSlotList)
  const userDetails = useSelector(getUserDetails)
  const slotShowButton = useSelector(setshowBookButton)
  const slotShow = slotShowButton.payload.slotListData.setshowBookButton
  const [scheduleSlots, setScheduleSlots] = useState([])
  const [selectedSlotObj, setSelectedSlotObj] = useState(null)
  const [showButton, setShowButton] = useState(false);
  const [timeZone, setTimeZone] = useState(moment.tz.guess())
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const navigate = useNavigate()
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate('/')
  //   }
  // }, [isLoggedIn])
  const dispatch = useDispatch()
  useEffect(() => {
    if (data.prefered_slots != undefined && data.professional_custom_slot != undefined) {
      let mergedArray = data.prefered_slots.concat(data.professional_custom_slot)
      let sortedArray = mergedArray.sort((firstObj, secondObj) => {
        const momentFirst = moment(firstObj.end_time, "YYYY-MM-DD h:mm:ss a")
        const momentSecond = moment(secondObj.end_time, "YYYY-MM-DD h:mm:ss a")
        return momentFirst.diff(momentSecond);
      });
      setScheduleSlots(sortedArray)
    }
  }, [data])
  useEffect(() => {
    if (isLoggedIn) {
      setTimeZone(userDetails?.time_zone)
    } else {
      setTimeZone(moment.tz.guess())
    }
  },[])
  function onSelectSlot(slotObj) {
    if (slotObj.enable_status == true) {
      setSelectedSlotObj(slotObj)
      let bookedSlot = slotObj
      bookedSlot.bookedDateObj = selectedDate
      bookedSlot.professionalBooked = professionalDetails
      dispatch(setSlotList(bookedSlot))
      if (slotShow) {       
        setShowButton(true)
      }
    } else {
      setSelectedSlotObj(null)
      dispatch(setSlotList({}))
    }
  }
  function getTimeInCorrectFormat(utcDateTimeString) {
    // var localTime = moment.utc(utcDateTimeString).local().format('HH:mm')
    var localTime = moment(utcDateTimeString).format('HH:mm')
    return localTime;
  }
  const showBackgoundColorOnSlot=(slotObj)=>{
    if(selectedSlotObj?.id == slotObj?.id&&slotObj?.enable_status==true){
      return 'bg-[#7fffd4]'
    }else if(selectedSlotObj?.id != slotObj?.id&&slotObj?.enable_status==true){
      return 'bg-[#FCE9BA]'
    }else if(slotObj?.enable_status==false){
      return 'bg-[#A9A9A9] text-white'
    }
  }
  const checkIsSlotStartTimeHasExpired=(slotObj)=>{
   
    // const startTimeInLocalTime= moment.utc(slotObj.end_time).format('YYYY-MM-DD HH:mm:ss');
    const startTimeInLocalTime= moment(slotObj.end_time).format('YYYY-MM-DD HH:mm:ss');
    // const currentTimeInLocalTime=moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const currentTimeInLocalTime=moment.tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    return startTimeInLocalTime<currentTimeInLocalTime || slotObj.enable_status==false
  }
  return (
    <>
      <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
        {scheduleSlots.length > 0 ? scheduleSlots.map((slotObj, i) =>
          <>
           {checkIsSlotStartTimeHasExpired(slotObj)? <li
            key={i}
            className="inline-block cursor-pointer"
            
          >
            <div className={`bg-[#afafaf] text-gray-500 px-1 py-3 text-[13px] rounded-md text-center font-bold cursor-pointer`}>
              {getTimeInCorrectFormat(slotObj?.start_time) + '-' + getTimeInCorrectFormat(slotObj?.end_time)}</div>
          </li>:<li
            key={i}
            className="inline-block cursor-pointer"
            onClick={() => onSelectSlot(slotObj)}
          >
            <div className={`${showBackgoundColorOnSlot(slotObj)} px-1 py-3 text-[13px] rounded-md text-center font-bold cursor-pointer`}>
              {getTimeInCorrectFormat(slotObj?.start_time) + '-' + getTimeInCorrectFormat(slotObj?.end_time)}</div>
          </li>}
          </>
        ) : <div>No Slots Available</div>}


      </div>

      {showButton ? (
            <div className='flex justify-end mr-2'>
              <button
                className="bg_primary rounded-full text-white w-[170px] h-[45px] block mb-3"
                onClick={() => { navigate("/checkout"); dispatch(setshowBookButton(false)) }}
              >
                Go to checkout
              </button></div>
      ) : null}
    </>
  )
}

export default ScheduleList