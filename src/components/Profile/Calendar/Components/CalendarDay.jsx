import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../../../features/redux/auth";

const CalendarDay = ({date, selectedDate, month, year, getMySessions, events}) => {
    const userDetails = useSelector(getUserDetails)
    const [selected, setSelected] = useState(false)
    const [isEventDay, setIsEventDay] = useState(false)
    const [today, setToday] = useState(false)
    const [todayDate, setTodayDate] = useState(new Date(moment(date).tz(userDetails?.time_zone).format("YYYY-MM-DD HH:mm:ss")))
    useEffect(() => {
        events.map((event) => {
            if (moment(date).isSame(event) === true) {
                return setIsEventDay(true)
            }
        })
    },[events])
    useEffect(() => {
        setTodayDate(new Date(moment(date).tz(userDetails?.time_zone).format("YYYY-MM-DD HH:mm:ss")))
        if (moment(new Date(moment(date).tz(userDetails?.time_zone).format("YYYY-MM-DD HH:mm:ss"))).isSame(selectedDate)) {
            setSelected(true)
        } else {
            setSelected(false)
        }
    },[selectedDate])
    useEffect(() => {
        let today = new Date(moment.tz(userDetails?.time_zone).format("YYYY-MM-DD HH:mm:ss"))
        let slotDate = new Date(moment(date).tz(userDetails?.time_zone).format("YYYY-MM-DD HH:mm:ss"))
        if (moment(today).isSame(slotDate, 'day')) {
            setToday(true)
        } else {
            setToday(false)
        }
    }, [])
    return (
        <>
            <div className={`border calendar-week-row-day-header relative text-center 
                ${todayDate.getFullYear() !== year || todayDate.getMonth() !== month - 1 ? 'text-[#bbb] font-normal' : 
                selected ? 'text-white font-semibold bg-[#153D57] cursor-pointer' : `text-[#000] font-semibold hover:bg-gray-200 cursor-pointer ${today && 'border-[#153D57] border-[2px]'}`}`}
                onClick={() => {
                if (!(todayDate.getFullYear() !== year || todayDate.getMonth() !== month - 1)) {
                    getMySessions(todayDate)
                }
                }}
            >
                <span className="text-xs sm:text-md md:text-base mx-auto">{todayDate.getDate()}</span>
                {todayDate.getFullYear() !== year || todayDate.getMonth() !== month - 1 ? "" : 
                    isEventDay ? 
                    <div className={`h-1 sm:h-1.5 w-1 sm:w-1.5 absolute right-1 sm:right-2 bottom-2 ${selected ? "bg-[#F4B41A]" : "bg-green-500"}`}></div> : 
                    <div className={`h-1 sm:h-1.5 w-1 sm:w-1.5 absolute right-1 sm:right-2 bottom-2 ${selected ? "bg-[#F4B41A]" : "bg-red-500"}`}></div>
                }
            </div>
        </>
    )
}

export default CalendarDay;