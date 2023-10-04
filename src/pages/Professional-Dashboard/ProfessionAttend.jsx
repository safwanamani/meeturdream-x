import React from "react";
import profile from '../../assets/card.png';
import { RiVideoLine } from 'react-icons/ri';

const ProfessionAttentCard = () => {
    return (
        <>
            <div className=" bg-white mb-3">
                <div className="lg:flex md:flex lg:justify-between md:justify-between p-5">
                    <div className="lg:flex md:flex justify-between w-full items-center">
                        <div className="flex items-center gap-4">
                            <img src={profile} className="rounded-full" width={120} alt="" />
                            <div>
                                <h2 className="text-xl font-bold">Ananhtu</h2>
                                <p>Duration : 10 MIN</p>
                            </div>
                        </div>
                        <div className="">
                            <button className="py-2 px-4 flex items-center text-black rounded-md  bg-[#F4B319] gap-1 font-medium">Start<RiVideoLine size={20} /> </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="lg:flex md:justify-between p-5">
                    <div className="text-md uppercase text-red-800 font-semibold">Cancel</div>
                    <div className="uppercase">11:00 Am - 12:00 PM</div>
                </div>
            </div>
        </>
    )
}

export default ProfessionAttentCard