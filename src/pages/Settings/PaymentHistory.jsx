import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { BsFillArrowUpRightSquareFill, BsFillArrowDownLeftSquareFill } from 'react-icons/bs';
import api from '../../Api/GeneralApi'
import moment from 'moment'
import { Toast } from "primereact/toast";

const PaymentHistory = () => {
    const toast = useRef(null)
    const [totalAmount, setTotalAmount] = useState(0)
    const [upcomingBookingAmount, setUpcomingBookingAmount] = useState(0)
    const [pendingAmount, setPendingAmount] = useState(0)
    const [recievedAmount, setRecievedAmount] = useState(0)
    const [PaymentHistory, setPaymentHistory] = useState([])

    const getPaymentData = () => {
        api.getPayment().then((data) => {
            if (data.status === true) {
                setTotalAmount(data?.payment_data?.total_amount)
                setUpcomingBookingAmount(data?.payment_data?.upcoming_booking_amount)
                setPendingAmount(data?.payment_data?.pending_amount)
                setRecievedAmount(data?.payment_data?.payment_recieved_amount)
                setPaymentHistory(data?.payment_data?.payment_history)
            } else {
                setTotalAmount(0)
                setUpcomingBookingAmount(0)
                setPendingAmount(0)
            }
        })
    }

    function getTimeInCorrectFormat(dateTime) {
        var localTime = moment.utc(dateTime).local().format('MMM D YYYY h:mm:ss a')
        return localTime;
    }
    useEffect(() => {
        getPaymentData();
    }, [])
    const downloadReciept = (payment_id) => {
        api.downloadBookingReciept({ payment_id }).then(({ data }) => {
            if (data?.data?.pdf) {
                window.open(data?.data?.pdf)
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: "Sorry, something went wrong", life: 3000 })
            }
        })
    }
    return (
        <div className="box__wrap w-full">
            <Toast ref={toast} />
            <h2 className="title">Payment History</h2>

            {/* profession and user */}
            <div className="py-3 mb-1 flex justify-between text-[#014000] font-semibold text-2xl">
                <h2 className="">Total Amount</h2>
                <span>{parseInt(totalAmount * 100) / 100} AED</span>
            </div>
            <div className="border-t-2 py-3 mb-1">
                <p className="text-md text-gray-700">Upcoming Booking Amount</p>
                <h2 className="text-xl font-semibold">{parseInt(upcomingBookingAmount * 100) / 100} AED</h2>
            </div>
            <div className="border-t-2 py-3 mb-1">
                <p className="text-md text-gray-700">Pending Amount</p>
                <h2 className="text-xl font-semibold">{parseInt(pendingAmount * 100) / 100} AED</h2>
            </div>
            <div className="border-t-2 border-b-2 py-3 mb-3">
                <p className="text-md text-gray-700">Recevied Amount</p>
                <h2 className="text-xl font-semibold">{parseInt(recievedAmount * 100) / 100} AED</h2>

            </div>
            {/* profession and user */}
            <div>
                {PaymentHistory.map((history, key) => {
                    return (
                        <div key={key}>
                            <div className="flex justify-between">
                                <div className="flex gap-4">
                                    <span className="pt-1">
                                        {history.payment_type === "send" && <BsFillArrowUpRightSquareFill className="text-red-500" size={34} />}
                                        {history.payment_type === "recevied" && <BsFillArrowDownLeftSquareFill className="text-green-500" size={34} />}
                                    </span>
                                    <div>
                                        <h2 className="font-semibold">
                                            {history.payment_type === "send" && "Payment To"}
                                            {history.payment_type === "recevied" && "Payment From"}
                                        </h2>
                                        <p className="text-gray-800 text-sm">{history?.user?.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h2 className="font-semibold text-lg text-gray-800">{parseInt(history?.amount * 100) / 100} AED</h2>
                                    <p className="text-gray-500 text-[12px]">{getTimeInCorrectFormat(history?.date)}</p>
                                    <p className="text-[#153D57] text-[11px] cursor-pointer uppercase font-semibold"
                                        onClick={() => {
                                            downloadReciept(history.id)
                                        }}>Download</p>
                                </div>
                            </div>
                            <hr className="my-3" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PaymentHistory;