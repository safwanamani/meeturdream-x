import React from "react";
import { useState } from "react";
import { DatePicker } from "../../components/Calendar/DatePicker";
import api from '../../Api/GeneralApi'
import ScheduleList from "./ScheduleList";
import { useSelector } from "react-redux";
import { getUserDetails, selectIsLoggedIn } from "../../features/redux/auth";
import { useEffect } from "react";
import moment from "moment";
const ScheduleSection = ({professionalDetails,selectedDate,setSelectedDate,isCalendarVisible, setIsCalendarVisible}) => {
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const userDetails = useSelector(getUserDetails);
    const [scheduleListData,setScheduleListData]=useState({})
    const [timeZone, setTimeZone] = useState(moment.tz.guess())
    useEffect(() => {
        if (isLoggedIn) {
            setTimeZone(userDetails?.time_zone)
        } else {
            setTimeZone(moment.tz.guess())
        }
    },[])
    const getDateInDashFormat=(date)=>{
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0!
        let dd = date.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedDate = dd + '-' + mm + '-' + yyyy;
        return formattedDate
    }
    const selectedDay = (val) =>{
        setSelectedDate(val)
        var options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        var prnDt =val.toLocaleTimeString('en-us', options).split(',')
        showScheduledSlots(getDateInDashFormat(val),prnDt[0])
    };
    const showScheduledSlots=(formattedDate,day)=>{
        const professionalDetails=JSON.parse(localStorage.getItem('professionalsDetails'))
        let dateArr=formattedDate.split('-')
        let date=dateArr[0]
        let month=dateArr[1]
        let year=dateArr[2]
        api.getSchedule({professional_id:professionalDetails.id,day:day,date:`${year}-${month}-${date}`,time_zone:timeZone}).then((data)=>{
            if(data.status){
                setScheduleListData(data.slots_data)
            }
        }).catch((err)=>{
            console.log('err',err)
        })
    }
    return (
        <>
            <div className="detail_box">
                <div className="head_wrap">
                    <h2 className="title">Schedule</h2>
                    <p className="text-sm pt-1">Choose the time for your first Session. The timings are displayed in {timeZone} (GMT {moment.tz(timeZone).format("Z")}) timezone.</p>
                </div>
                <hr />
                
                <div className="p-5">
                <DatePicker getSelectedDay={selectedDay}
                  endDate={100}
                  selectDate={new Date(moment.tz(timeZone).format("YYYY-MM-DD h:mm:ss a"))}
                  labelFormat={"MMMM"}
                  color={"#374e8c"}
                  marked={[
                      {
                          date: new Date(2021, 9, 3),
                          marked: true,
                          style: {
                              color: "#ff0000",
                              padding: "2px",
                              fontSize: 12,
                          },
                          text: "1x",
                      },
                      {
                          date: new Date(2021, 9, 4),
                          marked: true,
                          text: "5x"
                      },
                  ]}
                  isCalendarVisible={isCalendarVisible}
                  setIsCalendarVisible={setIsCalendarVisible}
                  />
                </div>
                {scheduleListData!={}&&<ScheduleList professionalDetails={professionalDetails} selectedDate={selectedDate} data={scheduleListData} />}
            </div>
        </>
    )
}
export default ScheduleSection;