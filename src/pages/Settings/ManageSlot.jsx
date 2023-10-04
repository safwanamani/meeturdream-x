import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ListDeleteSlot from "./components/ListDeleteSlot";
import AddMoreSlot from "./components/AddMoreSlot";
import { Toast } from "primereact/toast";
import api from "../../Api/GeneralApi";

const ManageSlot = ({ profileDetails, setProfileDetails }) => {
  const toast = useRef(null);
  const [addButtonStatus, setAddButtonStatus] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [newSlots, setNewSlots] = useState([]);
  const [notSelectedDays, setNotSelectedDays] = useState([]);
  const [arrayOfDays, setArrayOfDays] = useState([]);
  const [errorIndex, setErrorIndex] = useState("");
  const [errorSlot, setErrorSlot] = useState(false);
  const [errorSlots, setErrorSlots] = useState([])
  const [dayDropdownCount, setDayDropdownCount] = useState(0);
  const [saveSlotsButtonStatus, setSaveSlotsButtonStatus] = useState(false);
  const [predefinedSlots, setPredefinedSlots] = useState([]);
  const weekDays = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  useEffect(() => {
    setNotSelectedDays(Object.keys(weekDays));
    let slots = profileDetails?.predefindSlots.concat(
      profileDetails?.customSlots
    );
    slots = slots.sort((previous, current) => {
      return weekDays[previous.day] - weekDays[current.day];
    });
    let days = Object.keys(weekDays);
    let slotDays = [
      ...new Set(
        slots.map((slot) => {
          return slot.day;
        })
      ),
    ];
    setSelectedSlots(slots);
    setArrayOfDays(slotDays);
    let remainingDays = days.filter((day) => !slotDays.includes(day));
    setNotSelectedDays(remainingDays);
    setDayDropdownCount(remainingDays.length);
  }, [profileDetails]);
  useEffect(() => {
    api.getPreDefinedSlots().then((data) => {
      setPredefinedSlots(data?.slots);
    });
  }, []);
  const incrementSlot = () => {
    let index = 0;
    if (newSlots.length !== 0) {
      index = newSlots.length - 1;
      let last_slot = newSlots[index];
      if (!last_slot.day) {
        setErrorIndex(index);
      }
      if (!last_slot.type) {
        setErrorIndex(index);
      }
      if (
        last_slot.type === "oneHourSlot" &&
        last_slot.fixedSlots.length === 0
      ) {
        setErrorIndex(index);
      }
      if (last_slot.day && last_slot.type) {
        if (
          last_slot.type === "oneHourSlot" &&
          last_slot.fixedSlots.length > 0
        ) {
          setAddButtonStatus(true);
          setDayDropdownCount(dayDropdownCount - 1);
          let emptyObj = {
            day: "",
            slotType: "",
            fixedSlots: [],
            customSlots: [{ fromTime: "00:00:00", toTime: "00:00:00" }],
          };
          setNewSlots((prevValue) => [...prevValue, emptyObj]);
        }
        if (last_slot.type === "customSlot") {
          setAddButtonStatus(true);
          setDayDropdownCount(dayDropdownCount - 1);
          let emptyObj = {
            day: "",
            slotType: "",
            fixedSlots: [],
            customSlots: [{ fromTime: "00:00:00", toTime: "00:00:00" }],
          };
          setNewSlots((prevValue) => [...prevValue, emptyObj]);
        }
      }
    } else {
      setAddButtonStatus(true);
      setSaveSlotsButtonStatus(true);
      if (dayDropdownCount !== 0) {
        setDayDropdownCount(dayDropdownCount - 1);
      }
      let emptyObj = {
        day: "",
        slotType: "",
        fixedSlots: [],
        customSlots: [{ fromTime: "00:00:00", toTime: "00:00:00" }],
      };
      setNewSlots((prevValue) => [...prevValue, emptyObj]);
    }
  };
  const removeSlot = (day) => {
    if (day !== "") {
      setNotSelectedDays((prevDay) => [...prevDay, day]);
      setDayDropdownCount(dayDropdownCount + 1);
    }
    setNewSlots(newSlots.filter((slot) => slot.day !== day));
  };
  const getSlots = () => {
    let professional_custom_slots = [];
    let professional_predefind_slots = [];
    newSlots.map((slotObj) => {
      if (slotObj.type === "customSlot") {
        let customSlotArr = slotObj.customSlots.map((customSlotObj) => {
          return {
            start_time: customSlotObj.fromTime,
            end_time: customSlotObj.toTime,
          };
        });
        let obj = {
          day: slotObj.day,
          slot: customSlotArr,
        };
        professional_custom_slots.push(obj);
      } else if (slotObj.type === "oneHourSlot") {
        let obj = {
          day: slotObj.day,
          slot: slotObj.fixedSlots,
        };
        professional_predefind_slots.push(obj);
      }
    });
    return [professional_custom_slots, professional_predefind_slots];
  };
  const submitSlotData = async () => {
    let submitData = new FormData();
    submitData.append("professional_id", profileDetails.professional_id);
    let professional_custom_slots = getSlots()[0];
    professional_custom_slots.forEach((customSlot, i) => {
      submitData.append(`professional_custom_slots[${i}][day]`, customSlot.day);
      customSlot.slot.forEach((slot, index) => {
        submitData.append(
          `professional_custom_slots[${i}][slot][${index}][start_time]`,
          slot.start_time
        );
        submitData.append(
          `professional_custom_slots[${i}][slot][${index}][end_time]`,
          slot.end_time
        );
      });
    });
    let professional_predefind_slots = getSlots()[1];
    professional_predefind_slots.forEach((predefinedSlot, i) => {
      submitData.append(
        `professional_predefined_slots[${i}][day]`,
        predefinedSlot.day
      );
      predefinedSlot.slot.forEach((slot, index) => {
        submitData.append(
          `professional_predefined_slots[${i}][slot][${index}][predefined_slot_id]`,
          slot
        );
      });
    });
    await api
      .addSheduleSlots(submitData)
      .then(({ data }) => {
        if (data.status === true) {
          api.getMyProfile().then((data) => {
            let profileData = data.data;
            setProfileDetails((prevValue) => ({
              ...prevValue,
              customSlots: profileData.customSlots,
              predefindSlots: profileData.predefindSlots,
            }));
          });
          setTimeout(() => {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: data.message,
              life: 3000,
            });
            setNewSlots([]);
            setSaveSlotsButtonStatus(false);
          }, 200);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message,
            life: 3000,
          });
        }
      })
      .catch((err) => {
        console.log("Internal Server", err);
      });
  };
  const addSheduleSlots = () => {
    let index = 0;
    if (newSlots.length !== 0) {
      index = newSlots.length - 1;
      let last_slot = newSlots[index];
      if (!last_slot.day) {
        setErrorIndex(index);
      }
      if (last_slot.day && last_slot.type) {
        if (
          last_slot.type === "oneHourSlot" &&
          last_slot.fixedSlots.length > 0
        ) {
          submitSlotData();
        }
        if (last_slot.type === "customSlot" && errorSlots.length === 0) {
          submitSlotData();
        }
      }
    }
  };
  return (
    <div className="box__wrap w-full">
      <Toast ref={toast} />
      <h2 className="title">Manage Your Slot</h2>
      {arrayOfDays.map((day, key) => {
        let commonSlots = predefinedSlots.filter((slot) => {
          return selectedSlots.some((selected) => {
            return (
              selected.day === day &&
              slot.start_time === selected.start_time &&
              slot.end_time === selected.end_time
            );
          });
        });
        let filteredSlot = predefinedSlots.filter(
          (slot) => !commonSlots.includes(slot)
        );
        return (
          <ListDeleteSlot
            key={key}
            day={day}
            professionalId={profileDetails.professional_id}
            selectedSlots={selectedSlots}
            predefinedSlots={predefinedSlots}
            filteredSlot={filteredSlot}
            setProfileDetails={setProfileDetails}
            notSelectedDays={notSelectedDays}
            setNotSelectedDays={setNotSelectedDays}
          />
        );
      })}

      <div className="">
        {addButtonStatus === true &&
          newSlots.map((slotObj, index) => {
            let currentDays = [];
            notSelectedDays.map((day) => {
              currentDays.push(day);
            });
            if (slotObj.day) {
              currentDays.push(slotObj.day);
            }
            return (
              <AddMoreSlot
                slotObj={slotObj}
                key={index}
                index={index}
                slotArray={newSlots}
                setSlotArray={setNewSlots}
                notSelectedDays={currentDays}
                setNotSelectedDays={setNotSelectedDays}
                errorIndex={errorIndex}
                errorSlot={errorSlot}
                errorSlots={errorSlots}
                setErrorSlots={setErrorSlots}
                setErrorSlot={setErrorSlot}
                removeSlot={removeSlot}
              />
            );
          })}
        {dayDropdownCount !== 0 ? (
          <p
            className="font-bold text-ld text-[#153D57] flex items-center gap-1 pb-3 cursor-pointer"
            onClick={() => incrementSlot()}
          >
            <AiOutlinePlus size={22} /> Add More Slot
          </p>
        ) : null}
        {saveSlotsButtonStatus ? (
          <div className="justify-end flex">
            <button
              className="btn_primary bg_primary  text-lg text-white rounded-md"
              onClick={addSheduleSlots}
            >
              Save Changes
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ManageSlot;
