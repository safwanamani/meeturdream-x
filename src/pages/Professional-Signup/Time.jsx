import React, { useState } from "react";

const Time = ({
  id,
  index,
  start_time,
  end_time,
  slotObj,
  slotArray,
  setSlotArray
}) => {
  const [isActive, setIsActive] = useState(false);
  const handleClick = (type, value) => {
    if (isActive === false) {
      slotObj[type] = [...slotObj[type], value];
    } else {
      slotObj[type] = slotObj[type].filter((slot) => slot !== value);
    }
    setSlotArray(
      slotArray.map((item, i) => {
        if (index === i) {
          return { ...item, slotObj };
        }
        return item;
      })
    );
    return setIsActive(!isActive);
  };

  const convertTime = (time) => {
    if (time) {
      time = time.slice(0, 5);
      let hour = time.slice(0, 2);

      if (hour <= 12) {
        if (hour == 12) return time + "PM";
        return time + "AM";
      } else {
        let minute = time.slice(2);
        hour = parseFloat(hour) - 12;

        if (hour < 10) {
          hour = "0" + hour;
        }
        return hour + minute + "PM";
      }
    }
  };

  let converted_start_time = convertTime(start_time);
  let converted_end_time = convertTime(end_time);

  return (
    <li
      className="inline-block mr-2 mb-2 cursor-pointer"
      onClick={() => handleClick("fixedSlots", id)}
    >
      <div
        className={`border-2 px-5 py-2 rounded ${
          isActive || slotObj["fixedSlots"].includes(id) ? "active-slot" : ""
        }`}
      >
        {start_time.slice(0, 5)} - {end_time.slice(0, 5)}
      </div>
    </li>
  );
};

export default Time;
