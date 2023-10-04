import React from "react";
import CalendarDay from "./CalendarDay";

const CalendarWeekRow = (props) => {
  const { year, month, dates, events, selectedDate, setSelectedDate } = props;
  const getMySessions = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="calendar-week-row-container">
      {dates.map((date) => (
        <CalendarDay
          key={date}
          date={date}
          month={month}
          year={year}
          events={events}
          selectedDate={selectedDate}
          getMySessions={getMySessions}
        />
      ))}
      {/*  */}
    </div>
  );
};

export default CalendarWeekRow;
