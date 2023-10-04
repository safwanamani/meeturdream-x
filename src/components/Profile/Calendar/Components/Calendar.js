import React from "react";
import CalendarWeekRow from "./CalendarWeekRow.js";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const Calendar = (props) => {
  const { year, month, events, selectedDate, setSelectedDate } = props;
  const weeks = [];
  const firstDayInMonth = new Date(year, month - 1, 1),
    lastDayInMonth = new Date(year, month, 0),
    firstDayInCalendar = new Date(
      year,
      month - 1,
      1 - firstDayInMonth.getDay()
    ),
    lastDayInCalendar = new Date(
      year,
      month - 1,
      lastDayInMonth.getDate() + 6 - lastDayInMonth.getDay()
    );

  let currentDate = firstDayInCalendar;
  while (currentDate <= lastDayInCalendar) {
    if (currentDate.getDay() === 0) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(new Date(currentDate));
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>
          {monthNames[month - 1]} {year}
        </h1>
      </div>
      <div className="calendar-row-counter">
        {weeks.map((dates, i) =>
        (
          <CalendarWeekRow
            year={year}
            month={month}
            dates={dates}
            events={events}
            key={i}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        ))}
      </div>
    </div>
  );
};
export default Calendar;
