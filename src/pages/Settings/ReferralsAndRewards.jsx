import React, { useEffect, useState } from "react";
import moment from 'moment'
import image from "../../assets/NoneProfile.png"
import api from "../../Api/GeneralApi"
import { Pagination } from "antd";

const ReferralsAndRewards = () => {
    const [referrals, setReferrals] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalReferrals, setTotalReferrals] = useState(0)
    const [pageDetails, setPageDetails] = useState({})
    const [pageNo, setPageNo] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        getReferrals()
    },[])
    useEffect(() => {
        getReferrals()
    },[pageNo])
    const getReferrals = () => {
        api.getReferralsAndRewards({page: pageNo}).then(({data}) => {
            if (data.status === true) {
                setReferrals(data.user_details)
                setTotalAmount(data.referral_sum)
                setTotalReferrals(data.total_no_reference)
                setPageDetails(data.page_details)
                setCurrentPage(pageNo)
            } else {
                setReferrals([])
                setTotalAmount(0)
                setTotalReferrals(0)
                setCurrentPage(1)
            }
        })
    }
    const handlePagination = (page) => {
        setPageNo(page)
    }
    function getTimeInCorrectFormat(dateTime) {
        var localTime = moment.utc(dateTime).local().format('MMM D YYYY h:mm:ss a')
        return localTime;
    }
    return (
        <div className="box__wrap w-full">
            <h2 className="title">Referrals & Rewards</h2>

            <div className="border-2 rounded-md p-5 mb-2">
                <div className="py-3 mb-1 flex justify-between text-[#014000] font-semibold text-2xl">
                    <h2 className="">Total Amount</h2>
                    <span>{totalAmount ? parseInt(totalAmount * 100) / 100 : 0} AED</span>
                </div>
                <div className="border-t-2 py-3 mb-1">
                    <p className="text-md text-gray-700">Total Referrals</p>
                    <h2 className="text-xl font-semibold">{totalReferrals ? totalReferrals : 0}</h2>
                </div>
            </div>
            {referrals?.length > 0 &&
             (
                <div className="border-2 p-5 rounded-md">
                    {referrals?.map((referral, key) => {
                        return (
                            <div key={key}>
                                <div className="flex justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-[50px] h-[50px] bg-gray rounded-full">
                                            <img
                                                src={referral?.image ? referral.image : image}
                                                className="w-full h-full object-cover rounded-full"
                                                alt=""
                                            />
                                        </div>
                                        <div className="my-auto">
                                            <h2 className="font-semibold capitalize">
                                            {referral?.name}
                                            </h2>
                                            <p className="text-xs text-gray-500">Booking ID: {referral?.booking_unique_id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="font-semibold text-lg text-gray-800">{parseInt(referral?.amount * 100) / 100} AED</h2>
                                        <p className="text-gray-500 text-[12px]">{getTimeInCorrectFormat(referral?.created_at)}</p>
                                    </div>
                                </div>
                                {referrals?.length !== key +1 && <hr className="my-3" />}
                            </div>
                        )
                    })}
                    {referrals?.length > 10 && (
                        <Pagination
                            className="text-center my-3"
                            total={pageDetails.total_records}
                            current={currentPage}
                            responsive={true}
                            defaultCurrent={1}
                            pageSizeOptions={[]}
                            onChange={(e) => handlePagination(e)}
                        />
                    )}
                </div>
             )
            }
        </div>
    )
}

export default ReferralsAndRewards;