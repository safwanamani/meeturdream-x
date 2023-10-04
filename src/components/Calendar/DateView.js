/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import styles from "./DatePicker.module.css"
import {
    addDays,
    addMonths,
    differenceInMonths,
    format,
    isSameDay,
    lastDayOfMonth,
    startOfMonth
} from "date-fns";


const DateView = ({startDate, lastDate, selectDate, getSelectedDay, primaryColor, labelFormat, marked, date, setDate}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    console.log("startDate", startDate);
    console.log("lastDate", lastDate);
    const firstSection = {marginLeft: '40px'};
    const selectedStyle = {fontWeight:"bold",width:"52px",height:"52px",background:`${primaryColor}`,border:`2px solid ${primaryColor}`,borderRadius:"20%",color:'white'};
    // 
    const labelColor = {color: '#000000'};
    const markedStyle = {color: "#8c3737", padding: "2px", fontSize: 12};

    const getStyles = (day) => {
        return isSameDay(day, date)?selectedStyle:null;
    };

    const getId = (day) => {
        return isSameDay(day, date)?'selected':"";
    };

    const getMarked = (day) => {
        let markedRes = marked?.find(i => isSameDay(i.date, day));
        if (markedRes) {
            if (!markedRes?.marked) {
                return;
            }

            return <div style={{ ...markedRes?.style ?? markedStyle }} className={styles.markedLabel}>
                {markedRes.text}
            </div>;
        }

        return "";
    };
    const showDate=(month,date)=>{
        if(date!=null){
            if(date.getMonth()==month.getMonth()){
                return `${date.getDate()} , ${date.getFullYear()}`
            }
        }
    }
    const renderDays = () => {
        const dayFormat = "E";
        const dateFormat = "d";

        const months = [];
        let days = [];

        // const styleItemMarked = marked ? styles.dateDayItemMarked : styles.dateDayItem;

        for (let i = 0; i <= differenceInMonths(lastDate, startDate); i++) {
            let start, end;
            const month = startOfMonth(addMonths(startDate, i));

            start = i === 0 ? Number(format(startDate, dateFormat)) - 1 : 0;
            end = i === differenceInMonths(lastDate, startDate) ? Number(format(lastDate, "d")) : Number(format(lastDayOfMonth(month), "d"));

            for (let j = start; j < end; j++) {
                let currentDay = addDays(month, j);

                days.push(
                    <div id={`${getId(currentDay)}`}
                         className={marked ? styles.dateDayItemMarked : styles.dateDayItem}
                         style={getStyles(currentDay)}
                         key={currentDay}
                         onClick={() => onDateClick(currentDay)}
                    >
                        <div className={styles.dayLabel}>{format(currentDay, dayFormat)}</div>
                        <div className={styles.dateLabel}>{format(currentDay, dateFormat)}</div>
                        {getMarked(currentDay)}
                    </div>
                );
            }
            months.push(
                <div className={styles.monthContainer}
                     key={month}
                >
                    {showDate(month,date)!=undefined?<span className={styles.monthYearLabel} style={labelColor}>
                        {format(month, labelFormat || "MMMM yyyy")+' '+showDate(month,date)}
                    </span>:<span className={styles.monthYearLabel} style={labelColor}>
                        {format(month, labelFormat || "MMMM yyyy")}
                    </span>}
                    <div className={styles.daysContainer} style={i===0?firstSection:null}>
                        {days}
                    </div>
                </div>
            );
            days = [];

        }

        return <div id={"container"} className={styles.dateListScrollable}>{months}</div>;
    }

    const onDateClick = day => {
        setDate(day);
        if (getSelectedDay) {
            getSelectedDay(day);
        }
    };

    useEffect(() => {
        if (getSelectedDay) {
            if (selectDate) {
                getSelectedDay(selectDate);
            } else {
                getSelectedDay(startDate);
            }
        }
    }, []);

    // useEffect(() => {
    //     if (selectDate) {
    //         if (!isSameDay(selectedDate, selectDate)) {
    //             setSelectedDate(selectDate);
    //             setTimeout(() => {
    //                 let view = document.getElementById('selected');
    //                 if (view) {
    //                     view.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"});
    //                 }
    //             }, 20);
    //         }
    //     }
    // }, [selectDate]);

    return <React.Fragment>{renderDays()}</React.Fragment>
}




export { DateView }
