import React from "react";
import styled from "styled-components";

const Label = styled.span`
  grid-column: ${(props) => props.col} / span ${(props) => props.colSpan};
`;

const CalendarEvent = (props) => {
  const { title,  onClick } = props;

  return (
    <span
      className="calendar-event-label"
      
      onClick={onClick}
    >
      {title}
    </span>
  );
};

export default CalendarEvent;
