import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import Time from "./Time.jsx";
import CustomSlotView from "./CustomSlotView";
import api from "../../Api/GeneralApi";
function SlotAvailablity({
  slotObj,
  index,
  values,
  handleChange,
  slotArray,
  setSlotArray,
  totalErrorCustomSlots,
  setTotalErrorCustomSlots,
  totalErrorCustomSlot,
  setTotalErrorCustomSlot,
}) {
  const [customSlotArray, setCustomSlotArray] = useState([]);
  const [predefinedSlots, setPredefinedSlots] = useState([]);
  const [errorCustomSlots, setErrorCustomSlots] = useState([]);
  const [errorCustomSlot, setErrorCustomSlot] = useState({
    status: false,
    slotIndex: "",
  });
  useEffect(() => {
    api.getPreDefinedSlots().then((data) => {
      setPredefinedSlots(data?.slots);
    });
    setCustomSlotArray(values.slotArray[index].customSlots)
  }, []);
  useEffect(() => {
    if (errorCustomSlots.length > 0) {
      let obj = {
        slotId: index,
        slots: errorCustomSlots
      }
      setTotalErrorCustomSlots(prev => [...prev, obj])
    } else {
      totalErrorCustomSlots.map((slot, key) => {
        if (slot.slotId === index) {
          totalErrorCustomSlots[key].slots = errorCustomSlots
        }
      })
    }
  },[errorCustomSlots])
  useEffect(() => {
    let slotKey = ""
    let obj = {
      slotId: index,
      slots: errorCustomSlot
    }
    if (totalErrorCustomSlot.length > 0) {
      let flag = false
      totalErrorCustomSlot.map((slot, key) => {
        if (slot.slotId === index) {
          slotKey = key
          return flag = true
        }
      })
      if (flag === true) {
        totalErrorCustomSlot[slotKey].slots = errorCustomSlot
      } else {
        let newArr = [...totalErrorCustomSlot]
        newArr = [...new Set(newArr)]
        newArr.push(obj)
        setTotalErrorCustomSlot(newArr)
      }
    } else {
      setTotalErrorCustomSlot([obj])
    }
  },[errorCustomSlot])
  const setSlotType = (type, value) => {
    slotObj[type] = value;

    setSlotArray(
      slotArray.map((item, i) => {
        if (index === i) {
          return { ...item, slotObj };
        }
        return item;
      })
    );
  };
  const setSlotObj = (type, value) => {
    slotObj[type] = value;

    setSlotArray(
      slotArray.map((item, i) => {
        if (index === i) {
          return { ...item, slotObj };
        }
        return item;
      })
    );
  };
  const onSortChange = (type, value) => {
    if (type == "day") {
      setSlotObj("day", value);
    }
  };
  const options = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [notSelectedDays, setNotSelectedDays] = useState([]);
  useEffect(() => {
    let selectedDays = values.slotArray.map((slot) => {
      return slot.day;
    });
    let notSelectedDayss = options.filter(
      (item) => !selectedDays.includes(item)
    );
    notSelectedDayss.push(values.slotArray[index].day)
    setNotSelectedDays(notSelectedDayss);
  }, []);
  return (
    <div className=" mb-2">
      <div className="pt-2 pb-2">
        <Dropdown
          className="w-full max-w-[350px] md:max-w-[400px]"
          value={{ name: values.slotArray[index].day }}
          options={notSelectedDays.map((day) => {
            return { name: day };
          })}
          onChange={(e) => onSortChange("day", e.value.name)}
          optionLabel="name"
          placeholder="Selact a Day"
        />
      </div>
      <div className="flex gap-2 mt-3">
        <span
          onClick={() => setSlotType("type", "oneHourSlot")}
          className="px-4 py-3 border-2 rounded-md"
        >
          <input
            type="radio"
            onChange={() => setSlotType("type", "oneHourSlot")}
            checked={values.slotArray[index].type == "oneHourSlot"}
            className="mr-1"
            value="One Hour Slot"
          />
          One Hour Slot
        </span>
        <span
          onClick={() => setSlotType("type", "customSlot")}
          className="px-4 py-3 border-2 rounded-md"
        >
          <input
            type="radio"
            onChange={() => setSlotType("type", "customSlot")}
            checked={values.slotArray[index].type == "customSlot"}
            className="mr-1"
            value="Add Manually"
          />
          Add Manually
        </span>
      </div>
      {values.slotArray[index].type == "oneHourSlot" ? (
        <div className="mt-5 max-w-[550px]">
          <h2 className="text-gray-500 mt-3 mb-3">Morning</h2>
          <ul>
            {predefinedSlots &&
              predefinedSlots.map((slot, key) => {
                if (slot.segment === "1") {
                  return (
                    <Time
                      key={key}
                      id={slot.id}
                      index={index}
                      start_time={slot.start_time}
                      end_time={slot.end_time}
                      slotObj={slotObj}
                      slotArray={slotArray}
                      setSlotArray={setSlotArray}
                    />
                  );
                }
              })}
          </ul>
          <h2 className="text-gray-500 mt-3 mb-3">Day Time</h2>
          <ul>
            {predefinedSlots &&
              predefinedSlots.map((slot, key) => {
                if (slot.segment === "2") {
                  return (
                    <Time
                      key={key}
                      id={slot.id}
                      index={index}
                      start_time={slot.start_time}
                      end_time={slot.end_time}
                      slotObj={slotObj}
                      slotArray={slotArray}
                      setSlotArray={setSlotArray}
                    />
                  );
                }
              })}
          </ul>
          <h2 className="text-gray-500 mt-3 mb-3">Evening</h2>
          <ul>
            {predefinedSlots &&
              predefinedSlots.map((slot, key) => {
                if (slot.segment === "3") {
                  return (
                    <Time
                      key={key}
                      id={slot.id}
                      index={index}
                      start_time={slot.start_time}
                      end_time={slot.end_time}
                      slotObj={slotObj}
                      slotArray={slotArray}
                      setSlotArray={setSlotArray}
                    />
                  );
                }
              })}
          </ul>
        </div>
      ) : (
        ""
      )}
      {values.slotArray[index].type == "customSlot" ? (
        <div className="mt-3">
          <h2 className="text-gray-500">Add or Edit Slots</h2>
          {values.slotArray[index].customSlots.map((slot, indexOfSlot) => {
            return (
              <CustomSlotView
                slot={slot}
                key={indexOfSlot}
                index={indexOfSlot}
                slotObjFromValues={values.slotArray[index]}
                customSlotArray={customSlotArray}
                setCustomSlotArray={setCustomSlotArray}
                values={values}
                handleChange={handleChange}
                errorCustomSlots={errorCustomSlots}
                setErrorCustomSlots={setErrorCustomSlots}
                errorCustomSlot={errorCustomSlot}
                setErrorCustomSlot={setErrorCustomSlot}
              />
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default SlotAvailablity;
