import React, { useState, useRef } from "react";
import Time from "./Time";
import CustomSlotView from "./CustomSlotView";
import { Toast } from "primereact/toast";
import api from "../../../Api/GeneralApi";
import { useEffect } from "react";

const AddNewSlot = ({
  predefinedSlots,
  day,
  professionalId,
  setProfileDetails,
  setAddSlotState,
  selectedSlots,
  nonFilteredPredefinedSlots,
}) => {
  const toast = useRef(null);
  const [newSlots, setNewSlots] = useState({
    slotType: "",
    fixedSlots: [],
    customSlots: [{ fromTime: "00:00:00", toTime: "00:00:00" }],
  });
  const [slotObjArray, setSlotObjArray] = useState([]);
  const [submitButtonStatus, setSubmitButtonStatus] = useState(false);
  const [errorCustomSlots, setErrorCustomSlots] = useState([]);
  const [errorCustomSlot, setErrorCustomSlot] = useState({
    status: true,
    slotIndex: "",
  });
  useEffect(() => {
    let currentDayPredefinedSlots = selectedSlots.filter(
      (slot) => slot.day === day && slot.professional_predefined_id
    );
    let currentDayCustomSlots = selectedSlots.filter(
      (slot) => slot.day === day && slot.professional_custom_id
    );
    let slotObjects = [{ fromTime: "00:00:00", toTime: "00:00:00" }];
    currentDayPredefinedSlots.forEach((currentSlot) => {
      nonFilteredPredefinedSlots.forEach((preSlot) => {
        if (
          currentSlot.start_time === preSlot.start_time &&
          currentSlot.end_time === preSlot.end_time
        ) {
          let obj = {
            fromTime: preSlot.start_time,
            toTime: preSlot.end_time,
          };
          slotObjects.push(obj);
        }
      });
    });
    currentDayCustomSlots.forEach((customSlot) => {
      let customObj = {
        fromTime: customSlot.start_time,
        toTime: customSlot.end_time,
      };
      slotObjects.push(customObj);
    });
    setSlotObjArray(slotObjects);
  }, []);
  const setSlotType = (value) => {
    if (value === "customSlot") {
      setSubmitButtonStatus(true);
    } else if (value === "oneHourSlot" && newSlots.fixedSlots > 0) {
      setSubmitButtonStatus(true);
    } else {
      setSubmitButtonStatus(false);
    }
    setNewSlots((prevValue) => ({
      ...prevValue,
      slotType: value,
    }));
  };
  const submitSlot = async () => {
    let submitData = new FormData();
    submitData.append("professional_id", professionalId);
    if (newSlots.slotType === "customSlot") {
      submitData.append(`professional_custom_slots[${0}][day]`, day);
      newSlots.customSlots.forEach((slot, index) => {
        submitData.append(
          `professional_custom_slots[${0}][slot][${index}][start_time]`,
          slot.fromTime
        );
        submitData.append(
          `professional_custom_slots[${0}][slot][${index}][end_time]`,
          slot.toTime
        );
      });
    }
    if (newSlots.slotType === "oneHourSlot") {
      submitData.append(`professional_predefined_slots[${0}][day]`, day);
      newSlots.fixedSlots.forEach((slot, index) => {
        submitData.append(
          `professional_predefined_slots[${0}][slot][${index}][predefined_slot_id]`,
          slot
        );
      });
    }
    await api.addSheduleSlots(submitData).then(({ data }) => {
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
          life: 3000,
        });
        setTimeout(() => {
          setNewSlots({
            slotType: "",
            fixedSlots: [],
            customSlots: [{ fromTime: "00:00:00", toTime: "00:00:00" }],
          });
          setSubmitButtonStatus(false);
          setAddSlotState(false);
        }, 1000);
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
      <div className="flex gap-2 mt-3">
        <span
          onClick={() => setSlotType("oneHourSlot")}
          className="px-4 py-3 border-2 rounded-md"
        >
          <input
            type="radio"
            onChange={() => setSlotType("oneHourSlot")}
            checked={newSlots.slotType === "oneHourSlot"}
            className="mr-1"
            value="One Hour Slot"
          />
          One Hour Slot
        </span>
        <span
          onClick={() => setSlotType("customSlot")}
          className="px-4 py-3 border-2 rounded-md"
        >
          <input
            type="radio"
            onChange={() => setSlotType("customSlot")}
            checked={newSlots.slotType === "customSlot"}
            className="mr-1"
            value="Add Manually"
          />
          Add Manually
        </span>
      </div>
      {newSlots.slotType === "oneHourSlot" ? (
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
                      slotObj={newSlots}
                      setNewSlots={setNewSlots}
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
                      slotObj={newSlots}
                      setNewSlots={setNewSlots}
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
                      slotObj={newSlots}
                      setNewSlots={setNewSlots}
                      setSubmitButtonStatus={setSubmitButtonStatus}
                      slotObjArray={slotObjArray}
                      setSlotObjArray={setSlotObjArray}
                    />
                  );
                }
              })}
          </ul>
        </div>
      ) : (
        ""
      )}
      {newSlots.slotType == "customSlot" ? (
        <div className="mt-3">
          <h2 className="text-gray-500">Add or Edit Slots</h2>
          {newSlots.customSlots.map((slot, key) => {
            return (
              <CustomSlotView
                key={key}
                index={key}
                slotObj={slot}
                customSlots={newSlots.customSlots}
                setNewSlots={setNewSlots}
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
      ) : (
        ""
      )}
      {submitButtonStatus ? (
        newSlots.slotType === "oneHourSlot" ? (
          <div className="justify-end flex">
            <button
              className="btn_primary bg_primary text-lg text-white rounded-md"
              onClick={submitSlot}
            >
              Save Changes
            </button>
          </div>
        ) : newSlots.slotType === "customSlot" &&
          errorCustomSlots.length === 0 &&
          errorCustomSlot.status === false ? (
          <div className="justify-end flex">
            <button
              className="btn_primary bg_primary text-lg text-white rounded-md"
              onClick={submitSlot}
            >
              Save Changes
            </button>
          </div>
        ) : null
      ) : null}
    </>
  );
};

export default AddNewSlot;
