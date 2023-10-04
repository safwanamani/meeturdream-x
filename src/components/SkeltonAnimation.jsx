import React from 'react'
import Skeleton from "react-loading-skeleton";
function SkeltonAnimation() {
  return (
    <div className="lg:flex md:flex sm:flex p-3 bg-white shadow-lg shadow-gray-500/400 mt-4 xl:items-center lg:items-start sm:items-start gap-6">
                            <div className="w-[160px] flex-none relative">
                                <Skeleton height={160} />
                            </div>

                            <div className='lg:flex md:flex lg:items-center sm:items-start lg:gap-5 lg:justify-between w-full animate-pulse'>
                                <div className="w-full">
                                    <h2 className='text-xl font-bol items-center w-full'>
                                        <Skeleton width={100} />
                                    </h2>
                                    <h6 className='text-sm text-gray-700 font-semibold'> <Skeleton /></h6>
                                    <p className="text-sm font-bold"> <Skeleton /></p>
                                    <p className='text-md pb-1 text-gray-700'> <Skeleton /></p>
                                    <p className='font-bold text-xl bg-slate-200'> <Skeleton /></p>
                                </div>
                                <div className="lg:block flex-none sm:flex flex mt-2 sm:mt-2 sm:gap-2">
                                    <button className="rounded-full text-white w-[170px] h-[45px] block mb-3"><Skeleton width={170} height={45} /></button>
                                    <button className="rounded-full text-gray-800 w-[170px] h-[45px]"><Skeleton width={170} height={45} /></button>
                                </div>
                            </div>
                        </div>
  )
}

export default SkeltonAnimation