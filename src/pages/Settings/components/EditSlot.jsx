import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { AiOutlineEdit } from "react-icons/ai";
import Time from "./Time";
import CustomSlotView from "./CustomSlotView";
import api from "../../../Api/GeneralApi";
import { Toast } from "primereact/toast";

const EditSlot = ({
  day,
  selectedSlots,
  predefinedSlots,
  setEditStatus,
  notSelectedDays,
  setNotSelectedDays,
  professionalId,
  setProfileDetails,
}) => {
  const toast = useRef(null);
  const [currentSlot, setCurrentSlot] = useState({
    day: day,
    fixedSlots: [],
    customSlots: [],
  });
  const [listDays, setListDays] = useState([]);
  const [slotType, setSlotType] = useState("");
  const [submitButtonStatus, setSubmitButtonStatus] = useState(false);
  const [slotObjArray, setSlotObjArray] = useState([]);
  const [errorCustomSlots, setErrorCustomSlots] = useState([]);
  const [errorCustomSlot, setErrorCustomSlot] = useState({
    status: false,
    slotIndex: 0,
  });
  useEffect(() => {
    let currentDayPredefinedSlots = selectedSlots.filter(
      (slot) => slot.day === day && slot.professional_predefined_id
    );
    let currentDayCustomSlots = selectedSlots.filter(
      (slot) => slot.day === day && slot.professional_custom_id
    );
    let fixedSlotsIds = [];
    let slotObjects = [];
    currentDayPredefinedSlots.forEach((currentSlot) => {
      predefinedSlots.forEach((preSlot) => {
        if (
          currentSlot.start_time === preSlot.start_time &&
          currentSlot.end_time === preSlot.end_time
        ) {
          let obj = {
            fromTime: preSlot.start_time,
            toTime: preSlot.end_time,
          };
          slotObjects.push(obj);
          fixedSlotsIds.push(preSlot.id);
        }
      });
    });
    let customSlots = [];
    currentDayCustomSlots.forEach((customSlot) => {
      let customObj = {
        fromTime: customSlot.start_time,
        toTime: customSlot.end_time,
      };
      slotObjects.push(customObj);
      customSlots.push(customObj);
    });
    if (currentDayCustomSlots.length === 0) {
      let customObj = {
        fromTime: "00:00:00",
        toTime: "00:00:00",
      };
      customSlots.push(customObj);
      slotObjects.push(customObj);
    }
    if (fixedSlotsIds.length === 0 && customSlots.length > 0) {
      setSlotType("customSlot");
    } else {
      setSlotType("oneHourSlot");
    }
    setCurrentSlot((prevSlot) => ({
      ...prevSlot,
      fixedSlots: [...new Set(fixedSlotsIds)],
      customSlots: customSlots,
    }));
    setSlotObjArray(slotObjects);
  }, []);
  useEffect(() => {
    let days = [...notSelectedDays];
    if (currentSlot.day) {
      days.push(currentSlot.day);
      days = [...new Set(days)];
      setListDays(days);
    }
  }, [notSelectedDays]);
  const onSlotChange = (type, value) => {
    if (type === "day") {
      if (value !== currentSlot.day) {
        let currentDays = [...notSelectedDays];
        currentDays.push(currentSlot.day);
        setNotSelectedDays(currentDays.filter((day) => day !== value));
      }
      setCurrentSlot((prevSlot) => ({
        ...prevSlot,
        day: value,
      }));
    }
  };
  const submitEdit = async () => {
    let submitData = new FormData();
    submitData.append("professional_id", professionalId);
    submitData.append("previous_day", day);
    submitData.append("current_day", currentSlot.day);
    currentSlot.fixedSlots.forEach((slot, i) => {
      submitData.append(
        `professional_predefined_slots[${i}][predefined_slot_id]`,
        slot
      );
    });
    let customSlots = [...currentSlot.customSlots];
    customSlots = customSlots.filter(
      (slot) => !(slot.fromTime === "00:00:00" && slot.toTime === "00:00:00")
    );
    if (customSlots.length > 0) {
      let convertedFixedSlots = [];
      currentSlot.fixedSlots.forEach((slot, i) => {
        predefinedSlots.forEach((preSlot) => {
          if (slot === preSlot.id) {
            let obj = {
              fromTime: preSlot.start_time,
              toTime: preSlot.end_time,
            };
            convertedFixedSlots.push(obj);
          }
        });
      });
      let newCustomSlots = customSlots.filter((custObj) =>
        convertedFixedSlots.every(
          (fixObj) =>
            custObj.fromTime !== fixObj.fromTime &&
            custObj.toTime !== fixObj.toTime
        )
      );
      newCustomSlots.forEach((preSlot, i) => {
        submitData.append(
          `professional_custom_slots[${i}][start_time]`,
          preSlot.fromTime
        );
        submitData.append(
          `professional_custom_slots[${i}][end_time]`,
          preSlot.toTime
        );
      });
    }
    await api.editManageSlot(submitData).then(({ data }) => {
      if (data.status === true) {
        api.getMyProfile().then((data) => {
          let profileData = data.data;
          setProfileDetails((prevValue) => ({
            ...prevValue,
            customSlots: profileData.customSlots,
            predefindSlots: profileData.predefindSlots,
          }));
        });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: data.message,
          life: 5000,
        });
        setTimeout(() => {
          setEditStatus(false);
        }, 300);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message,
          life: 3000,
        });
      }
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-between">
        <Dropdown
          className="w-[350px] md:w-[400px]"
          value={{ name: currentSlot.day }}
          options={listDays.map((day) => {
            return { name: day };
          })}
          onChange={(e) => onSlotChange("day", e.value.name)}
          optionLabel="name"
          placeholder="Select a Day"
        />
        <span className="flex gap-2">
          <AiOutlineEdit
            className="cursor-pointer"
            size={22}
            onClick={() => setEditStatus((prevStatus) => !prevStatus)}
          />
        </span>
      </div>
      <div className="flex gap-2 mt-3">
        <span
          className="px-4 py-3 border-2 rounded-md cursor-pointer"
          onClick={() => setSlotType("oneHourSlot")}
        >
          <input
            type="radio"
            className="mr-1 cursor-pointer"
            value="One Hour Slot"
            checked={slotType === "oneHourSlot"}
            onChange={() => setSlotType("oneHourSlot")}
          />
          One Hour Slot
        </span>
        <span
          className="px-4 py-3 border-2 rounded-md cursor-pointer"
          onClick={() => setSlotType("customSlot")}
        >
          <input
            type="radio"
            className="mr-1 cursor-pointer"
            value="Add Manually"
            checked={slotType === "customSlot"}
            onChange={() => setSlotType("customSlot")}
          />
          Add Manually
        </span>
      </div>
      {slotType === "oneHourSlot" ? (
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
                      index={key}
                      start_time={slot.start_time}
                      end_time={slot.end_time}
                      slotObj={currentSlot}
                      setNewSlots={setCurrentSlot}
                      setSubmitButtonStatus={setSubmitButtonStatus}
                      slotObjArray={slotObjArray}
                      setSlotObjArray={setSlotObjArray}
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
                      index={key}
                      start_time={slot.start_time}
                      end_time={slot.end_time}
                      slotObj={currentSlot}
                      setNewSlots={setCurrentSlot}
                      setSubmitButtonStatus={setSubmitButtonStatus}
                      slotObjArray={slotObjArray}
                      setSlotObjArray={setSlotObjArray}
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
                      index={key}
                      start_time={slot.start_time}
                      end_time={slot.end_time}
                      slotObj={currentSlot}
                      setNewSlots={setCurrentSlot}
                      setSubmitButtonStatus={setSubmitButtonStatus}
                      slotObjArray={slotObjArray}
                      setSlotObjArray={setSlotObjArray}
                    />
                  );
                }
              })}
          </ul>
          {errorCustomSlot.status === true && errorCustomSlots.length !== 0 && (
            <p className="text-red-500 text-sm">
              There is an error occured in custom slots
            </p>
          )}
          {errorCustomSlot.status === false &&
            errorCustomSlots.length !== 0 && (
              <p className="text-red-500 text-sm">
                There is an error occured in custom slots
              </p>
            )}
          {errorCustomSlot.status === true && errorCustomSlots.length === 0 && (
            <p className="text-red-500 text-sm">
              There is an error occured in custom slots
            </p>
          )}
        </div>
      ) : slotType === "customSlot" ? (
        <div className="mt-3">
          <h2 className="text-gray-500">Add or Edit Slots</h2>
          {currentSlot.customSlots.map((slot, key) => {
            var fromTime = slot.fromTime.slice(0,5)
            var toTime = slot.toTime.slice(0,5)
            var slotOb = {
              fromTime: fromTime + ":00",
              toTime: toTime + ":00"
            }
            return (
              <CustomSlotView
                key={key}
                index={key}
                slotObj={slotOb}
                customSlots={currentSlot.customSlots}
                setNewSlots={setCurrentSlot}
                slotObjArray={slotObjArray}
                setSlotObjArray={setSlotObjArray}
                errorCustomSlots={errorCustomSlots}
                setErrorCustomSlots={setErrorCustomSlots}
                errorCustomSlot={errorCustomSlot}
                setErrorCustomSlot={setErrorCustomSlot}
              />
            );
          })}
        </div>
      ) : null}
      {/* {slotObjArray.length > 0 ? ( */}
        <div className="justify-end flex">
          {errorCustomSlot.status === true && errorCustomSlots.length !== 0 && (
            <button className="btn_primary bg_primary text-lg text-white rounded-md opacity-60 hover:opacity-60 hover:bg-[#153D57]">
              Save Changes
            </button>
          )}
          {errorCustomSlot.status === false &&
            errorCustomSlots.length !== 0 && (
              <button className="btn_primary bg_primary text-lg text-white rounded-md opacity-60 hover:opacity-60 hover:bg-[#153D57]">
                Save Changes
              </button>
            )}
          {errorCustomSlot.status === true && errorCustomSlots.length === 0 && (
            <button className="btn_primary bg_primary text-lg text-white rounded-md opacity-60 hover:opacity-60 hover:bg-[#153D57]">
              Save Changes
            </button>
          )}
          {errorCustomSlot.status === false &&
            errorCustomSlots.length === 0 && (
              <button
                className="btn_primary bg_primary text-lg text-white rounded-md cursor-pointer"
                onClick={submitEdit}
              >
                Save Changes
              </button>
            )}
        </div>
      {/* ) : null} */}
    </>
  );
};

export default EditSlot;
