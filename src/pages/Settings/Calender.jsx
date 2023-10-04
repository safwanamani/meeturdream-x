import React from "react";
import CalendarView from "../../components/Profile/Calendar/CalendarView";
const Calender = () => {
    return (
        <div className="box__wrap w-full">
            <CalendarView />
            {/* <h2 className="title">Calender</h2>
            <p> Connect your Google Calendar and synchronize all your Preply lessons with your personal schedule</p>
            <div className="flex justify-center py-4">
                <button className="bg-[#ce584f] py-3 px-4 text-white rounded-md">Connect Google Calender</button>
            </div> */}
        </div>
    )
}

export default Calender;