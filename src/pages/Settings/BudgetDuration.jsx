import React, { useState, useEffect } from "react";
import { Slider } from "primereact/slider";
import api from "../../Api/GeneralApi";

const BudgetDuration = () => {
  const [budget, setBudget] = useState(0)
  const [duration, setDuration] = useState(0);
  const [commissionPercentage, setCommissionPercentage] = useState(0)
  const [totalEstimate, setTotalEstimate] = useState(0)
  useEffect( () => {
    api.getBudgetDuration().then(data => {
      if (data.status === true) {
        setCommissionPercentage(data.commission_percentage)
      } else {
        setCommissionPercentage(0)
      }
    })
  },[])
  const setEstimate = (type, value) => {
    let total = 0
    if (type === "budget") {
      setBudget(value)
      total = (value * duration * 60) - ((value * duration * 60 * commissionPercentage) / 100)
    } else if (type === "duration") {
      setDuration(value)
      total = (budget * value * 60) - ((budget * value * 60 * commissionPercentage) / 100)
    }
    setTotalEstimate(total)
  }
  return (
    <div className="box__wrap w-full">
      <h2 className="title">Budget & Duration</h2>
      <div className="text-center pb-14">
        <h2 className="text-2xl text-[#F4B319] font-semibold">
          AED {budget} <span className="text-sm font-normal">(per minute)</span> over {duration} hour
        </h2>
        <p className="text-gray-500 mb-2">Total Spends</p>
        <h2 className="text-xl font-semibold">{totalEstimate.toFixed(2)}</h2>
        <p className="text-gray-500 mb-5">Estimate Match</p>
        <div className="max-w-96 mx-auto text-left">
          <h5 className="mb-5">Budget: {budget} <span className="text-sm text-gray-500">(per minute)</span> </h5>
          <Slider
            value={budget}
            onChange={(e) => setEstimate("budget", e.value)}
            step={0.1}
            max={10}
          />
          <h5 className="mb-3 mt-3">Duration: {duration} <span className="text-sm text-gray-500">(in hours)</span> </h5>
          <Slider
            value={duration}
            onChange={(e) => setEstimate("duration", e.value)}
            max={24}
          />
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default BudgetDuration;
