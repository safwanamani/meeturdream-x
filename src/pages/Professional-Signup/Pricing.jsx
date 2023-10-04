import React from "react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { AiOutlinePlus } from "react-icons/ai";
import { setProfessionalSignUpViewIndex } from "../../features/redux/pageData";
import { time } from "./time";
import api from "../../Api/GeneralApi";
import SlotAvailablity from "./SlotAvailablity";

const PricingAvail = ({ values, handleChange }) => {
  const dispatch = useDispatch();
  const [selectedSort, setSort] = useState(null);
  const [predefinedSlots, setPredefinedSlots] = useState([]);
  const [slotArray, setSlotArray] = useState([
    {
      day: "",
      slotType: "",
      fixedSlots: [],
      customSlots: [{ fromTime: "00:00:00", toTime: "00:00:00" }],
    },
  ]);
  const [errorBaseHourPrice, setErrorBaseHourPrice] = useState(false);
  const [errorTimeZone, setErrorTimeZone] = useState(false);
  const [totalErrorCustomSlots, setTotalErrorCustomSlots] = useState([]);
  const [totalErrorCustomSlot, setTotalErrorCustomSlot] = useState([]);
  const changeFormStep = (e, step) => {
    e.preventDefault();
    if (values.baseHourlyPrice === undefined) {
      setErrorBaseHourPrice(true);
    }
    if (values.timeZone === undefined) {
      setErrorTimeZone(true);
    }
    let _totalErrorCustomSlot = [...new Set(totalErrorCustomSlot)]
    let findTotalErrorCustomSlot = _totalErrorCustomSlot.findIndex(slot => slot.slots.status  === true)
    let findTotalErrorCustomSlots = totalErrorCustomSlots.findIndex(slot => slot.slots.length !== 0)
    if (values.baseHourlyPrice !== undefined && values.timeZone !== undefined && findTotalErrorCustomSlot < 0 && findTotalErrorCustomSlots < 0) {
      setErrorBaseHourPrice(false);
      setErrorTimeZone(false);
      dispatch(setProfessionalSignUpViewIndex(step));
    }
  };
  const onSortChange = (e) => {
    setSort(e.value);
    handleChange("timeZone", e.value);
    setErrorTimeZone(false);
  };
  const incrementSlot = () => {
    let emptyObj = {
      day: "",
      slotType: "",
      fixedSlots: [],
      customSlots: [{ fromTime: "00:00:00", toTime: "00:00:00" }],
    };
    setSlotArray((current) => [...current, emptyObj]);
    values.slotArray.push(emptyObj);
  };
  useEffect(() => {
    api.getPreDefinedSlots().then((data) => {
      setPredefinedSlots(data.slots);
    });
  }, []);
  return (
    <>
      <div className="p-8 bg-white">
        <div className="header flex justify-between pb-8">
          <h2 className="text-xl font-bold">Pricing & Availability</h2>
          <span className="py-1 px-3 bg-[#eeb738af] rounded-lg text-sm">
            Step <b className="text-md">5/6</b>
          </span>
        </div>
        <form action="">
          <h2 className="mb-3 text-lg font-semibold">
            Base rate <span class="text-red-500">*</span>
          </h2>
          <div className="gap-4 flex items-center">
            <input
              type="number" min="0"
              onWheel={(e) => e.target.blur()}
              defaultValue={Number(values.baseHourlyPrice).toFixed(2)}
              onChange={(e) => {
                var t = e.target.value;
                e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
                handleChange("baseHourlyPrice", e.target.value);
                setErrorBaseHourPrice(false);
              }}
              className="border-2 p-2 rounded-md border-gray-300 h-[50px] w-[200]"
            />
            <span className="text-2xl fond-semibold">AED / Minute</span>
          </div>
          {errorBaseHourPrice ? (
            <p className="text-red-500 text-sm">
              Base hourly price is required
            </p>
          ) : (
            ""
          )}
          <div className="form-group mt-3">
            <label htmlFor="">
              Time Zone <span class="text-red-500">*</span>
            </label>

            {/* <Dropdown
              className="w-full"
              value={values.timeZone}
              options={time}
              onChange={onSortChange}
              optionLabel="name"
              placeholder="Sort By"
            /> */}
            <Dropdown
              className="w-full"
              value={values.timeZone}
              options={time}
              onChange={onSortChange}
              optionLabel="name"
              filter
              showClear
              filterBy="name"
              placeholder="Select TimeZone"
            />

            {errorTimeZone ? (
              <p className="text-red-500 text-sm">Time Zone is required</p>
            ) : (
              ""
            )}
            <p className="text-sm text-gray-500 mt-2">
              New tutors charge 6 AED for this subject to earn 300% more. Set this
              rate to get more students to your profile. You can change it
              anytime.
            </p>
          </div>
          <h2 className="mb-1 text-lg font-semibold">Set your availability</h2>

          {values.slotArray.map((slotObj, index) => {
            return (
              <SlotAvailablity
                slotObj={slotObj}
                key={index}
                index={index}
                values={values}
                handleChange={handleChange}
                slotArray={slotArray}
                setSlotArray={setSlotArray}
                totalErrorCustomSlots={totalErrorCustomSlots}
                setTotalErrorCustomSlots={setTotalErrorCustomSlots}
                totalErrorCustomSlot={totalErrorCustomSlot}
                setTotalErrorCustomSlot={setTotalErrorCustomSlot}
              />
            );
          })}
        <p className="pt-2 text-sm text-gray-500">
          Availability shows your potential working hours students can book
          lessons at these time
        </p>
          <div className="flex my-5 items-center gap-2 ">
            <span
              style={{ cursor: "pointer" }}
              className="flex my-5 items-center gap-2 "
              onClick={() => incrementSlot()}
            >
              <AiOutlinePlus size={22} /> Add Another Slot
            </span>
          </div>
          <div className="justify-end flex gap-3">
            <button
              className="font-semibold text-md py-3 px-6 text-black rounded-md border-1 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setProfessionalSignUpViewIndex(3));
              }}
            >
              Back
            </button>
            <button
              onClick={(e) => {
                changeFormStep(e, 5);
              }}
              className="bg_primary font-semibold text-md py-3 px-6 text-white rounded-md"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default PricingAvail;
