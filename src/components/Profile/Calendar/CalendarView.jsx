import React, { useState, useEffect } from "react";
import "./calendarStyles.css";
import Calendar from "./Components/Calendar.js";
import api from '../../../Api/GeneralApi'
import { useLocation, useNavigate } from "react-router-dom";
import BookingsView from "../../../pages/My-sessions/BookingsView";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../../features/redux/auth";
const CalendarView = () => {
  const userDetails = useSelector(getUserDetails)
  const navigate = useNavigate()
  const location = useLocation()
  const [year, setYear] = useState(Number(moment.tz(userDetails.time_zone).format("YYYY")));
  const [month, setMonth] = useState(Number(moment.tz(userDetails?.time_zone).format("M")));
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("")
  const [mySessions, setMySessions] = useState({})

  const loadPrevMonth = () => {
    let prevMonth = month - 1;
    if (prevMonth < 1) {
      setYear(year - 1);
      prevMonth = 12;
    }
    setMonth(prevMonth);
  };

  const loadNextMonth = () => {
    let nextMonth = month + 1;
    if (nextMonth > 12) {
      setYear(year + 1);
      nextMonth = 1;
    }
    setMonth(nextMonth);
  };
  const getUserEvents=()=>{
    api.getUserEvents()
            .then((data) => {
                if (data.status == true) { 
                    let eventsData=data.events_dates
                    setEvents(eventsData)
                }
            }).catch((err) => {
                console.log('API error', err)
            })
  }
  useEffect(() => {
    getUserEvents()
  }, []);
  useEffect(() => {
    if (location.hash === "#calendar-sessions" && selectedDate !== "") {
      let elem = document.getElementById(location.hash.slice(1))
      elem.scrollIntoView({ behavior: "smooth"})
    }
  },[location])
  useEffect(() => {
    let selected = moment(selectedDate).format("YYYY-MM-DD")
    let obj = {
      date: selected,
      day: moment(selectedDate).format("dddd"),
      time_zone: userDetails?.time_zone
    }
    api.getMySessions(obj).then((data) => {
      if (data.status === true) {
        setMySessions(data.booking_data)
      } else {
        setMySessions([])
      }
      navigate("#calendar-sessions")
    })
  },[selectedDate])

  return (
    <div>
      <div className="app-container border rounded-sm pt-5 px-1 pb-2 sm:px-5">
        <div className="app-controls">
          <button className="next-prev-button" onClick={loadPrevMonth}>
            &laquo; Prev Month
          </button>
          <button className="next-prev-button" onClick={loadNextMonth}>
            Next Month &raquo;
          </button>
        </div>
        <Calendar year={year} month={month} events={events} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
      {selectedDate !== "" && (
      <div id="calendar-sessions">
        <h2 className="title">My Sessions</h2>
        <BookingsView professionalBookingsData={mySessions.professional_bookings} userBookingsData={mySessions.user_bookings} setData={setMySessions} typeOfFilter="All"/>
      </div>
      )}
    </div>
  );
};

export default CalendarView;