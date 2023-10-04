import React, { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import api from "../../../Api/GeneralApi";
import { Toast } from "primereact/toast";
function ReviewModal({ setShowReview, professionalDetails, setAddReview, from, changeReviewedStatus }) {
  const toast = useRef(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [bookingId, setBookingId] = useState("")
  const [professionalId, setProfessionalId] = useState("")
  useEffect(() => {
    if (from === "videosession") {
      setBookingId(professionalDetails.booking_id)
      setProfessionalId(professionalDetails.professional_id)
    } else {
      setBookingId(professionalDetails.id)
      setProfessionalId(professionalDetails.professional_id)
    }
  }, [])
  const submitReview = () => {
    if (review == "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter review",
      });
    } else {
      api
        .submitReview({
          booking_id: bookingId,
          professional_id: professionalId,
          rate: rating,
          review: review,
        })
        .then((data) => {
          if (data.status == true) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: data.message,
              life: 3000,
            });
            if (from === "videosession") {
              changeReviewedStatus()
            }
            setAddReview(true);
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: data.message,
              life: 3000,
            });
          }
          setTimeout(() => {
            setShowReview(false);
          }, 2000)
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };
  return (
    <>
      <Toast ref={toast}></Toast>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-4xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">Add Review</h3>
              <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <StarRating rating={rating} setRating={setRating} />
            {rating > 0 && (
              <div className="px-2 mb-2">
                <textarea
                  name="reason"
                  rows="3"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your reason..."
                  onChange={(e) => {
                    setReview(e.target.value);
                  }}
                ></textarea>
              </div>
            )}
            <div className="flex items-center justify-end py-5 pr-2 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ml-8 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowReview(false)}
              >
                Cancel
              </button>
              <button
                className="bg_primary text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => submitReview()}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default ReviewModal;
