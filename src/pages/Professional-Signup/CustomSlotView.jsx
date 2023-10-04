import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import moment from "moment";
function CustomSlotView({
  slot,
  index,
  slotObjFromValues,
  customSlotArray,
  setCustomSlotArray,
  values,
  handleChange,
  errorCustomSlot,
  setErrorCustomSlot,
  errorCustomSlots,
  setErrorCustomSlots,
}) {
  const [errorStatus, setErrorStatus] = useState({
    status:false,
    message: ""
  });
  useEffect(() => {
    let errorIndex = errorCustomSlots.findIndex((data) => data.index == index);
    if (errorIndex > -1) {
      let message = errorCustomSlots.find(data => data.index === index)
      setErrorStatus({
        status: true,
        message: message.message
      });
    } else {
      setErrorStatus({
        status: false,
        message: ""
      });
    }
  }, [errorCustomSlots]);
  const incrementCustomSlotInputs = async () => {
    if (errorCustomSlot.status === false && errorCustomSlots.length === 0) {
      let emptyObject = { fromTime: "00:00:00", toTime: "00:00:00" };
      let duplicateFlag = false;
      await customSlotArray.forEach((slot) => {
        slot.fromTime === emptyObject.fromTime &&
          slot.toTime === emptyObject.toTime &&
          (duplicateFlag = true);
      });
      if (duplicateFlag === false) {
        setErrorCustomSlot((prev) => ({
          ...prev,
          status: false,
        }));
        setCustomSlotArray((current) => [...current, emptyObject]);
        slotObjFromValues.customSlots.push(emptyObject);
      } else {
        setErrorCustomSlot({
          status: true,
          slotIndex: index,
        });
      }
    }
  };
  const setScheduleTimings = (type, value) => {
    setErrorCustomSlot((prev) => ({
      ...prev,
      status: false,
    }));
    let currentObj = { ...customSlotArray[index] };
    let invalidSlot = false
    let startTime = ""
    let endTime = ""
    if (type === "fromTime") {
      startTime = moment(value+":00", 'HH:mm:ss');
      endTime = moment(currentObj["toTime"], 'HH:mm:ss');
    } else if (type === "toTime") {
      startTime = moment(currentObj["fromTime"], 'HH:mm:ss');
      endTime = moment(value+":00", 'HH:mm:ss');
    }
    let duration = moment.duration(endTime.diff(startTime))
    if (duration._milliseconds <= 0) {
      invalidSlot = true
    } else {
      invalidSlot = false
    }
    currentObj[type] = value + ":00";
    let findErrorIndex = errorCustomSlots.findIndex(
      (errorId) => errorId.index === index
    );
    if (invalidSlot === true) {
      if (findErrorIndex > -1) {
        let errorArray = [...errorCustomSlots]
        errorArray.forEach(data => {
          if (data.index === index) {
            data.message = "Slot is invalid"
          }
        })
        setErrorCustomSlots(errorArray)
      } else {
        setErrorCustomSlots([
          ...errorCustomSlots,
          {
            index: index,
            message: "Slot is invalid"
          }
        ])
      }
    } else {
      if (
        JSON.stringify(currentObj) !==
        JSON.stringify(customSlotArray[index])
      ) {
        let foundDuplObjIndex = customSlotArray.findIndex(
          (obj) => JSON.stringify(obj) === JSON.stringify(currentObj)
        );
        if (foundDuplObjIndex > -1) {
          if (findErrorIndex < 0) {
            var obj =  {
              index: index,
              message: "Slot is already added"
            }
            setErrorCustomSlots([...errorCustomSlots, obj]);
          } else {
            let errorArray = [...errorCustomSlots]
            errorArray.forEach(data => {
              if (data.index === index) {
                data.message = "Slot is already added"
              }
            })
            setErrorCustomSlots(errorArray)
          }
        } else {
          let checkBetween = (time) => {
            let timeStatus =  false
            customSlotArray.forEach((slot) => {
              if (JSON.stringify(customSlotArray[index]) !== JSON.stringify(slot)) {
                var beforeTime = moment(slot.fromTime, "HH:mm:ss")
                var afterTime = moment(slot.toTime, "HH:mm:ss")
  
                if (moment(time).isBetween(beforeTime, afterTime) === true) {
                  return timeStatus = true
                }
              }
            })
            return timeStatus
          }
          let checkBetweenAlreadyAdded = () => {
            let timeStatus = false
            customSlotArray.forEach(slot => {
              if (JSON.stringify(customSlotArray[index]) !== JSON.stringify(slot)) {
                var beforeTimeStatus = moment(moment(slot.fromTime, "HH:mm:ss")).isBetween(startTime, endTime)
                var afterTimeStatus = moment(moment(slot.toTime, "HH:mm:ss")).isBetween(startTime, endTime)
                if (beforeTimeStatus === true || afterTimeStatus === true) {
                  return timeStatus = true
                }
              }
            })
            return timeStatus
          }
          let current = moment(value+":00", 'HH:mm:ss');
          let otherTime = ""
          if (type === "fromTime") {
            otherTime = moment(currentObj["toTime"], 'HH:mm:ss');
          } else if (type === "toTime") {
            otherTime = moment(currentObj["fromTime"], 'HH:mm:ss');
          }
          let betweenErrorStatus = checkBetween(current)
          let otherErrorStatus = checkBetween(otherTime)
          let checkBetweenAlreadyAddedStatus = checkBetweenAlreadyAdded()
          if (betweenErrorStatus === true || otherErrorStatus === true || checkBetweenAlreadyAddedStatus === true) {
            if (findErrorIndex > -1) {
              let errorArray = [...errorCustomSlots]
              errorArray.forEach(data => {
                if (data.index === index) {
                  data.message = "Slot is already added"
                }
              })
              setErrorCustomSlots(errorArray)
            } else {
              setErrorCustomSlots([
                ...errorCustomSlots,
                {
                  index: index,
                  message: "Slot is already added"
                }
              ])
            }
          } else {
            if (findErrorIndex > -1) {
              setErrorCustomSlots(
                errorCustomSlots.filter((errorId) => errorId.index !== index)
              );
            } 
          }
        }
      } else {
        let countOfDupli = customSlotArray.filter(
          (obj) => JSON.stringify(obj) === JSON.stringify(currentObj)
        ).length;
        if (countOfDupli > 1) {
          if (findErrorIndex < 0) {
            var obj =  {
              index: index,
              message: "Slot is already added"
            }
            setErrorCustomSlots([...errorCustomSlots, obj]);
          } else {
            let errorArray = [...errorCustomSlots]
            errorArray.forEach(data => {
              if (data.index === index) {
                data.message = "Slot is already added"
              }
            })
            setErrorCustomSlots(errorArray)
          }
        } else {
          if (findErrorIndex > -1) {
            setErrorCustomSlots(
              errorCustomSlots.filter((errorId) => errorId.index !== index)
            );
          }
        }
      }
    }
    slotObjFromValues.customSlots[index] = currentObj;
    setCustomSlotArray(
      customSlotArray.map((item, i) => {
        if (index === i) {
          return currentObj ;
        }
        return item;
      })
    );
  };
  const handleDeleteSlot = () => {
    let newErrorArray = [...errorCustomSlots];
    if (errorCustomSlot.slotIndex > index) {
      setErrorCustomSlot((prev) => ({
        ...prev,
        slotIndex: errorCustomSlot.slotIndex - 1,
      }));
    }
    let customObj = customSlotArray[index];
    let countOfDupli = customSlotArray.filter(
      (slot) => JSON.stringify(slot) === JSON.stringify(customObj)
    ).length;
    if (countOfDupli === 2) {
      let duplicateIndex = customSlotArray.findIndex(
        (obj, key) => {
          if (key !== index) {
            return JSON.stringify(obj) === JSON.stringify(customObj);
          }
        }
      );
      newErrorArray = newErrorArray.filter(
        (errorId) => errorId.index !== duplicateIndex
      );
    }
    newErrorArray = newErrorArray.filter((errorId) => errorId.index !== index);
    let newErrors = newErrorArray.map((errorId) => {
      if (errorId.index > index) {
        errorId.index = errorId.index - 1;
      }
      return errorId;
    });
    setErrorCustomSlots(newErrors);
    const newCustomSlotArray = [...customSlotArray];
    newCustomSlotArray.splice(index, 1);

    setCustomSlotArray(newCustomSlotArray);
    slotObjFromValues?.customSlots.splice(index, 1);
  };
  return (
    <>
      <div className="flex my-2 items-center gap-2 ">
        <input
          value={slotObjFromValues?.customSlots[index].fromTime}
          onChange={(e) => setScheduleTimings("fromTime", e.target.value)}
          type="time"
          className="border-2 h-[50px] rounded-md p-2"
        />{" "}
        To
        <input
          value={slotObjFromValues?.customSlots[index].toTime}
          onChange={(e) => setScheduleTimings("toTime", e.target.value)}
          type="time"
          className="border-2 h-[50px] rounded-md p-2"
        />
        {customSlotArray.length === index+1 && <AiOutlinePlusCircle
          size={26}
          onClick={incrementCustomSlotInputs}
          style={{ cursor: "pointer" }}
        />}
        {slotObjFromValues.customSlots.length > 1 && (
          <RiDeleteBin5Fill
            size={23}
            onClick={handleDeleteSlot}
            className="border-2  border-black flex items-center p-[2px] rounded-full cursor-pointer"
          />
        )}
      </div>
      {errorStatus.status ? (
        <p className="text-red-500 text-sm">{errorStatus.message}</p>
      ) : null}
      {errorCustomSlot.slotIndex === index && errorCustomSlot.status ? (
        <p className="text-red-500 text-sm">Slot is invalid</p>
      ) : null}
    </>
  );
}

export default CustomSlotView;
