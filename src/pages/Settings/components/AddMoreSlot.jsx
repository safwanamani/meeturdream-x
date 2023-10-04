import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import Time from "../../Professional-Signup/Time.jsx";
import CustomSlotView from "../../Professional-Signup/CustomSlotView";
import api from "../../../Api/GeneralApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
const AddMoreSlot = ({
  slotObj,
  index,
  values,
  handleChange,
  slotArray,
  setSlotArray,
  notSelectedDays,
  errorIndex,
  setNotSelectedDays,
  errorSlots,
  setErrorSlots,
  removeSlot
}) => {
  const [customSlotArray, setCustomSlotArray] = useState([
    { fromTime: "00:00:00", toTime: "00:00:00" },
  ]);
  const [predefinedSlots, setPredefinedSlots] = useState([]);
  const [errorCustomSlots, setErrorCustomSlots] = useState([])
  const [errorCustomSlot, setErrorCustomSlot] = useState({
    status: false,
    slotIndex: ""
  })
  useEffect(() => {
    api.getPreDefinedSlots().then((data) => {
      setPredefinedSlots(data?.slots);
    });
  }, []);
  useEffect(() => {
    if (errorCustomSlot.status === true) {
      setErrorSlots([...errorSlots, index])
    } else {
      setErrorSlots(errorSlots.filter(slotId => slotId !== index))
    }
  },[errorCustomSlot])
  useEffect(() => {
    if (errorCustomSlots.length > 0) {
      setErrorSlots([...errorSlots, index])
    } else {
      setErrorSlots(errorSlots.filter(slotId => slotId !== index))
    }
  },[errorCustomSlots])
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
  }
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
    if (type === "day") {
      setSlotObj("day", value);
      setNotSelectedDays(notSelectedDays.filter(day => day !== value))
    }
  };
  return (
    <>
    <div className="p-4 border-2 rounded-md mb-3">
      <div className="pt-2 pb-2">
        <Dropdown
          className=" w-[350px] md:w-[400px]"
          value={{ name:slotArray[index].day }}
          options={notSelectedDays.map((day) => {
            return { name: day };
          })}
          onChange={(e) => onSortChange("day", e.value.name)}
          optionLabel="name"
          placeholder="Selact a Day"
        />
      </div>
      {errorIndex === index && slotObj.day === "" ? <p className="text-sm text-red-500">Please Select a Day</p> : null}
      <div className="flex gap-2 mt-3">
        <span onClick={()=>setSlotType("type", "oneHourSlot")} className="px-4 py-3 border-2 rounded-md">
          <input
            type="radio"
            onChange={()=>setSlotType("type", "oneHourSlot")}
            checked={slotArray[index].type === "oneHourSlot"}
            className="mr-1"
            value="One Hour Slot"
          />
          One Hour Slot
        </span>
        <span onClick={()=>setSlotType("type", "customSlot")} className="px-4 py-3 border-2 rounded-md">
          <input
            type="radio"
            onChange={()=>setSlotType("type", "customSlot")}
            checked={slotArray[index].type === "customSlot"}
            className="mr-1"
            value="Add Manually"
          />
          Add Manually
        </span>
      </div>
      {slotArray[index].type === "oneHourSlot" ? (
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
      {slotArray[index].type === "customSlot" ? (
        <div className="mt-3">
          <h2 className="text-gray-500">Add or Edit Slots</h2>
          {slotArray[index].customSlots.map((slot, indexOfSlot) => {
            return (
              <CustomSlotView
                slot={slot}
                key={indexOfSlot}
                index={indexOfSlot}
                slotObjFromValues={slotArray[index]}
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
      {errorIndex === index && !slotObj.type && <p className="text-sm text-red-500">Please Select any slot</p>}
      {errorIndex === index && slotObj.type === "oneHourSlot" && slotObj.fixedSlots.length === 0 && <p className="text-sm text-red-500">Please Select any slot</p>}
    </div>
    <p className="font-bold text-md justify-end flex mb-2">
      {slotArray.length > 1 ? (
        <span className="round_border cursor-pointer"
        onClick={() => removeSlot(slotObj.day)}>
          <RiDeleteBin5Fill />
        </span>
      ): null}
    </p>
    </>
  );
}

export default AddMoreSlot;