import React, { useState } from "react";
import { useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import moment from "moment";

const CustomSlotView = ({
  index,
  slotObj,
  customSlots,
  setNewSlots,
  slotObjArray,
  setSlotObjArray,
  errorCustomSlots,
  setErrorCustomSlots,
  errorCustomSlot,
  setErrorCustomSlot,
}) => {
  const [errorStatus, setErrorStatus] = useState({
    status: false,
    message: ""
  });
  useEffect(() => {
    let errorIndex = errorCustomSlots.findIndex((errorId) => errorId.index === index);
    if (errorIndex > -1) {
      let message = errorCustomSlots.find(data => data.index === index)
      setErrorStatus({
        status: true,
        message: message.message
      })
    } else {
      setErrorStatus({
        status: false,
        message: ""
      });
    }
  }, [errorCustomSlots]);
  const incrementSlot = async () => {
    let emptyObj = { fromTime: "00:00:00", toTime: "00:00:00" };
    let duplicateFlag = false;
    await slotObjArray.forEach((slot) => {
      slot.fromTime === emptyObj.fromTime &&
        slot.toTime === emptyObj.toTime &&
        (duplicateFlag = true);
    });
    if (duplicateFlag === false) {
      setErrorCustomSlot((prev) => ({
        ...prev,
        status: false,
      }));
      setNewSlots((prevSlots) => ({
        ...prevSlots,
        customSlots: [...customSlots, emptyObj],
      }));
      setSlotObjArray([...slotObjArray, emptyObj]);
    } else {
      setErrorCustomSlot({
        status: true,
        slotIndex: index,
      });
    }
  };
  const deleteSlot = () => {
    let newErrorArray = [...errorCustomSlots];
    if (errorCustomSlot.slotIndex > index) {
      setErrorCustomSlot((prev) => ({
        ...prev,
        slotIndex: errorCustomSlot.slotIndex - 1,
      }));
    }
    let customObj = customSlots[index];
    let countOfDupli = customSlots.filter(
      (slot) => JSON.stringify(slot) === JSON.stringify(customObj)
    ).length;
    let countOfDupliObj = slotObjArray.filter(
      (obj) => JSON.stringify(obj) === JSON.stringify(customObj)
    ).length;
    if (countOfDupli === 2 && countOfDupliObj === 2) {
      let duplicateIndex = customSlots.findIndex((obj, key) => {
        if (key !== index) {
          return JSON.stringify(obj) === JSON.stringify(customObj);
        }
      });
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
    let obj = customSlots[index];
    setSlotObjArray(slotObjArray.filter((slot) => slot !== obj));
    customSlots.splice(index, 1);
    setNewSlots((prevSlots) => ({
      ...prevSlots,
      customSlots: customSlots,
    }));
  };
  const setSlotTime = (type, value) => {
    setErrorCustomSlot((prev) => ({
      ...prev,
      status: false,
    }));
    let currentObj = { ...customSlots[index] };
    let invalidSlot = false
    let startTime = ""
    let endTime = ""
    if (type === "fromTime") {
      startTime = moment(value + ":00", 'HH:mm:ss');
      endTime = moment(currentObj["toTime"], 'HH:mm:ss');
    } else if (type === "toTime") {
      startTime = moment(currentObj["fromTime"], 'HH:mm:ss');
      endTime = moment(value + ":00", 'HH:mm:ss');
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
      if (JSON.stringify(currentObj) !== JSON.stringify(customSlots[index])) {
        let foundDuplObjIndex = slotObjArray.findIndex(
          (obj) => JSON.stringify(obj) === JSON.stringify(currentObj)
        );
        if (foundDuplObjIndex > -1) {
          if (findErrorIndex < 0) {
            var obj = {
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
            let timeStatus = false
            slotObjArray.forEach((slot) => {
              if (JSON.stringify(customSlots[index]) !== JSON.stringify(slot)) {
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
            slotObjArray.forEach(slot => {
              if (JSON.stringify(customSlots[index]) !== JSON.stringify(slot)) {
                var beforeTimeStatus = moment(moment(slot.fromTime, "HH:mm:ss")).isBetween(startTime, endTime)
                var afterTimeStatus = moment(moment(slot.toTime, "HH:mm:ss")).isBetween(startTime, endTime)
                if (beforeTimeStatus === true || afterTimeStatus === true) {
                  return timeStatus = true
                }
              }
            })
            return timeStatus
          }
          let current = moment(value + ":00", 'HH:mm:ss');
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
        let countOfDupli = slotObjArray.filter(
          (obj) => JSON.stringify(obj) === JSON.stringify(currentObj)
        ).length;
        if (countOfDupli > 1) {
          if (findErrorIndex < 0) {
            var _obj = {
              index: index,
              message: "Slot is already added"
            }
            setErrorCustomSlots([...errorCustomSlots, _obj]);
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
    let foundIndex = slotObjArray.findIndex(
      (obj) => JSON.stringify(obj) === JSON.stringify(customSlots[index])
    );
    slotObjArray[foundIndex] = currentObj;
    let newSlotObjArray = slotObjArray;
    setSlotObjArray(newSlotObjArray);
    customSlots[index] = currentObj;
    let newCustomSlots = customSlots;
    setNewSlots((prevSlots) => ({
      ...prevSlots,
      customSlots: newCustomSlots,
    }));
  };
  return (
    <>
      <div className="flex my-2 items-center gap-2 ">
        <input
          value={slotObj.fromTime}
          type="time"
          className="border-2 h-[50px] rounded-md p-2"
          onChange={(e) => setSlotTime("fromTime", e.target.value)}
        />{" "}
        To
        <input
          value={slotObj.toTime}
          type="time"
          className="border-2 h-[50px] rounded-md p-2"
          onChange={(e) => setSlotTime("toTime", e.target.value)}
        />
        {index === customSlots.length - 1 && (
          <AiOutlinePlusCircle
            size={26}
            style={{ cursor: "pointer" }}
            onClick={errorStatus.status ? null : incrementSlot}
          />
        )}
        <RiDeleteBin5Fill
          size={23}
          className="border-2  border-black flex items-center p-[2px] rounded-full cursor-pointer"
          onClick={deleteSlot}
        />
      </div>
      {errorStatus.status ? (
        <p className="text-red-500 text-sm">{errorStatus.message}</p>
      ) : null}
      {errorCustomSlot.slotIndex === index && errorCustomSlot.status ? (
        <p className="text-red-500 text-sm">Slot is invalid</p>
      ) : null}
    </>
  );
};

export default CustomSlotView;
