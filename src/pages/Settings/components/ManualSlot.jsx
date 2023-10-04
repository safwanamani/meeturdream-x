import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai"

const ManualSlot = () => {
    return (
        <>
            <div className="mt-3">
                <h2 className="text-gray-500">Add or Edit Slots</h2>
                <div className="flex my-2 items-center gap-2">
                    <input type="text" className="border-2 h-[50px] rounded-md p-2" /> To
                    <input type="text" className="border-2 h-[50px] rounded-md p-2" />
                    <AiOutlinePlusCircle size={26} />
                </div>
            </div>

        </>
    )
}

export default ManualSlot