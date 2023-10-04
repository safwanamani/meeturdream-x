import React from "react";
import BookingsView from "./BookingsView";
const CancelMysession = ({data,typeOfFilter}) => {
    return (
        <>
            <BookingsView professionalBookingsData={data.professional_bookings} userBookingsData={data.user_bookings} typeOfFilter={typeOfFilter} />
        </>
    )
}

export default CancelMysession;