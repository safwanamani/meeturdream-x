/* eslint-disable react-hooks/exhaustive-deps */
import { addDays } from "date-fns";
import React, { useState } from "react";
import hexToRgb from "./global/helpers/hexToRgb";
import styles from "./DatePicker.module.css"
import { DateView } from "./DateView";
import { MonthView } from './MonthView';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { AiOutlineCalendar } from 'react-icons/ai';
import { Calendar } from "primereact/calendar";
import moment from "moment/moment";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../features/redux/auth";
const DatePicker = (props) => {
    useEffect(() => {
        console.log("fdfaffd", props)
    },[])
    let userDetails = useSelector(getUserDetails)
    let today = new Date(moment.tz(userDetails?.time_zone).format("YYYY-MM-DD h:mm:ss a"));
    let day = today.getDate()
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevDay = (day === 30) ? day - 1 : day - 1;
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    const [date, setDate] = useState(new Date(moment.tz(userDetails?.time_zone).format("YYYY-MM-DD h:mm:ss a")));
    const handleVisibility = (e) => {
        props.setIsCalendarVisible(!props.isCalendarVisible)
    };

    const handleVisibleChange = (e) => {
    };
    let minDate = new Date(moment.tz(userDetails?.time_zone).format("YYYY-MM-DD h:mm:ss a"));
    minDate.setDate(prevDay);
    minDate.setMonth(month);
    minDate.setFullYear(prevYear);

    let invalidDates = [minDate];

    const next = (event) => {
        event.preventDefault();
        const e = document.getElementById('container');
        const width = e ? e.getBoundingClientRect().width : null;
        e.scrollLeft += width - 100;
    };

    const prev = (event) => {
        event.preventDefault();
        const e = document.getElementById('container');
        const width = e ? e.getBoundingClientRect().width : null;
        e.scrollLeft -= width - 100;
    };

    const primaryColor = props.color ? (props.color.indexOf("rgb") > 0 ? props.color : hexToRgb(props.color)) : 'rgb(54, 105, 238)';

    const startDate = props.startDate || new Date(moment.tz(userDetails?.time_zone).format("YYYY-MM-DD h:mm:ss a"));
    const lastDate = addDays(startDate, props.days || 90);

    let buttonzIndex = { zIndex: 2 };
    let buttonStyle = { background: 'white', border: '1px solid #C1C1C1' };
    // border: 5px solid red;
    let Component = DateView;

    if (props.type === "month") {
        buttonzIndex = { zIndex: 5 };
        Component = MonthView;
        buttonStyle = { background: primaryColor, marginBottom: "5px" };
    }

    return (
        <>
            <div>
                <div className="flex items-center">
                    <div className={styles.container}>
                        <div className={styles.buttonWrapper} style={buttonzIndex}>
                            <button className={styles.button} style={buttonStyle} onClick={prev}>&lt;</button>
                        </div>
                        <div className={styles.buttonWrapper} style={buttonzIndex}>
                            <button className={styles.button} style={buttonStyle} onClick={next}>&gt;</button>
                        </div>
                    </div>
                    {/* <Calendar
                        id="icon" minDate={new Date()}
                        value={date}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                            let diff = moment().diff(e.value)
                            let checkSameDay = moment(e.value).isSame(moment(), 'day')
                            if (diff<=0 || checkSameDay === true) {
                                setDate(e.value)
                                props.getSelectedDay(e.value)
                            }
                         }}
                        showOnFocus={true}
                        visible={props.isCalendarVisible}
                        onVisibleChange={handleVisibleChange}
                    /> */}
                    {/* <span className="bg-[#F5F1F1] p-2 cursor-pointer" onClick={handleVisibility} >   <AiOutlineCalendar size={26} /></span> */}


                </div>
                <Component {...props} primaryColor={primaryColor} startDate={startDate} lastDate={lastDate} date={date} setDate={setDate} />
            </div>

        </>

    )
}

export { DatePicker }