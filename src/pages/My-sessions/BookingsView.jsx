import React from 'react'
import CommonSessionCard from "./CommonSessionCard";
import NoProductsFound from "../../components/NoProductsFound";
function BookingsView({professionalBookingsData,userBookingsData, setData, typeOfFilter}) {
  return (
    <>
        {professionalBookingsData?.length>0&& <>
            <h2 className="text-xl font-bold md:pb-5 pb-2 pt-2">Professional Bookings</h2>
           {professionalBookingsData.map((dataObj,index)=> {
            return (
              <CommonSessionCard professionalBookingsData={professionalBookingsData} dataObj={dataObj} key={index} session_type="professional" typeOfFilter={typeOfFilter} setData={setData}/>
            )
           }
           )}
           </>}
           {userBookingsData?.length>0&& <>
            <h2 className="text-xl font-bold pb-5 pt-7">User Bookings</h2>
           {userBookingsData.map((dataObj,index) => {
            return (
              <CommonSessionCard userBookingsData={userBookingsData} dataObj={dataObj} key={index} session_type="user" typeOfFilter={typeOfFilter} setData={setData}/>
            )
          })}
           </>}
            {(!professionalBookingsData?.length)&&(!userBookingsData?.length)&&<NoProductsFound/>}
    </>
  )
}

export default BookingsView

