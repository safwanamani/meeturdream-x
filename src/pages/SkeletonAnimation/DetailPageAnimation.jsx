import React from "react";

import Skeleton from "react-loading-skeleton";
const DetailAnimation = () => {
    return (
        <>
            <div className="lg:w-4/6">
                <div className="left_side_wrap">
                    <div className="bg-white lg:p-5 p-3 rounded-md">
                        <div className="flex lg:gap-5 gap-4 ">
                            <div className="w-[250px] flex-non">
                                <Skeleton height={200} />
                            </div>
                            <div className="w-full">
                                <p><Skeleton height={30} /></p>
                                <p><Skeleton width={200} /></p>
                                <p><Skeleton width={100} /></p>
                                <p><Skeleton height={30} /></p>

                                <div className="flex mt-5 gap-5">
                                <p><Skeleton height={60} width={60} /></p>
                                <p><Skeleton height={60} width={60} /></p>
                                <p><Skeleton height={60} width={60} /></p>
                                <p><Skeleton height={60} width={60} /></p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="bg-white lg:p-5 p-3 rounded-md">
                            <p className=""><Skeleton /></p>
                            <div id="about" className="mb-4">

                            </div>
                            <div id="schedule" className="mb-4">
                                <Skeleton height={120} />
                            </div>
                            <div id="language" className="mb-4">
                                <Skeleton height={120} />
                            </div>
                            <div id="resume" className="mb-4">
                                <Skeleton height={120} />
                            </div>
                            <div id="review" className="mb-4">
                                <Skeleton height={120} />
                            </div>

                            <div className="">
                                <Skeleton height={120} />
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="lg:w-2/6">
                <div className="right_side_wrap bg-white rounded-md">
                    <div>
                        <Skeleton height={200} />
                    </div>
                    <div className="p-5">
                        <p className="pt-5">  <Skeleton /></p>
                        <p className="pt-5">  <Skeleton /></p>
                        <p className="pt-5">  <Skeleton /></p>
                    </div>




                </div>
            </div>

        </>
    )
}

export default DetailAnimation;