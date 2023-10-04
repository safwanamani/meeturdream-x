import React from "react";
import done from "../../assets/done.png"
import { useNavigate } from "react-router-dom";
const Submitted = () => {
    const navigate=useNavigate()
    const changeUserRoleAndNavigateToHomePage=()=>{
        navigate('/')
    }
    return (
        <>
            <div className='p-4 md:p-8 bg-white'>
                <div className="text-center pb-28 px-3 md:px-28">
                    <h2 className="font-bold text-2xl">Profile submitted </h2>
                    <p>Review in progress
                    </p>
                    <div className="p-3 md:p-10 text=-center bg-[#FAFAFA] mt-5" >
                        <img src={done} alt="" className="mx-auto pb-2" />
                        <h2 className="font-semibold mb-2 text-lg">Thank you for completing registration!</h2>
                        <p>We’ve received your application and are currently reviewing it.
                            You will receive an email with the status of your application within 5 business days.</p>
                    </div>
                </div>
 
              <div className="cursor-pointer text-center uppercase text-[#153D57] text-sm font-semibold" onClick={()=>changeUserRoleAndNavigateToHomePage()}>Back To Home</div>

            </div>
        </>
    )
}
export default Submitted