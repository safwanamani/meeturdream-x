import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { Toast } from "primereact/toast";

const Time = ({ id, start_time, end_time, slotObj, setNewSlots, setSubmitButtonStatus, slotObjArray, setSlotObjArray }) => {
  const toast = useRef(null)
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (slotObj["fixedSlots"].includes(id)) {
      setIsActive(true)
    }
  },[])
  const handleClick = async (type, value) => {
    let obj = {
      fromTime: start_time,
      toTime: end_time,
    }
    if (isActive === false) {
      let timeStatus = false
      let startTime = moment(obj.fromTime, "HH:mm:ss")
      let endTime = moment(obj.toTime, "HH:mm:ss")
      await slotObjArray.forEach(slot => {
        var beforeNewTimeStatus = moment(moment(slot.fromTime, "HH:mm:ss")).isBetween(startTime, endTime)
        var afterNewTimeStatus = moment(moment(slot.toTime, "HH:mm:ss")).isBetween(startTime, endTime)
        var beforeTimeStatus = moment(moment(startTime, "HH:mm:ss")).isBetween(slot.fromTime, slot.toTime)
        var afterTimeStatus = moment(moment(endTime, "HH:mm:ss")).isBetween(slot.fromTime, slot.toTime)
        if (beforeNewTimeStatus || afterNewTimeStatus || beforeTimeStatus || afterTimeStatus) {
          return timeStatus = true
        }
      })
      if (timeStatus) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Slot is already added",
          life: 3000
        })
      } else {
        slotObj[type] = [...slotObj[type], value];
        setSlotObjArray([...slotObjArray, obj])
        setSubmitButtonStatus(true)
        setNewSlots(slotObj);
        return setIsActive(!isActive);
      }
    } else {
      slotObj[type] = slotObj[type].filter((slot) => slot !== value);
      setSlotObjArray(slotObjArray.filter((slot) => slot !== obj));
      if (slotObj.fixedSlots.length === 0) {
        setSubmitButtonStatus(false)
      }
      setNewSlots(slotObj);
      return setIsActive(!isActive);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <li
        className="inline-block mr-2 mb-2 cursor-pointer"
        onClick={() => handleClick("fixedSlots", id)}
      >
        <div
          className={`border-2 px-5 py-2 rounded ${isActive || slotObj["fixedSlots"].includes(id) ? "active-slot" : ""
            }`}
        >
          {moment(start_time, ["h:mm:ss"]).format("HH:mm")} -{" "}
          {moment(end_time, ["h:mm:ss"]).format("HH:mm")}
        </div>
      </li>
    </>
  );
};

export default Time;
