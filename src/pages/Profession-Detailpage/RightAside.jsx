import React,{useState,useRef} from "react";
import { AiOutlineArrowRight } from 'react-icons/ai';
import { AiOutlineHeart,AiFillHeart } from 'react-icons/ai';
import { IoMdShareAlt } from 'react-icons/io';
import { Link, useNavigate } from "react-router-dom";
import { RWebShare } from "react-web-share";
import {useSelector,useDispatch} from 'react-redux'
import {selectSlotList} from '../../features/redux/slotListData'
import { selectProfessionalsData } from "../../features/redux/professionalsData";
import {getUserDetails, selectIsLoggedIn} from '../../features/redux/auth'
import ChatIndividualMessage from "../Chat/ChatIndividualMessage";
import api from '../../Api/GeneralApi'
import { Toast } from 'primereact/toast';
import { useEffect } from "react";
import { BiBlock } from "react-icons/bi";
import { setChatItem } from "../../features/redux/chatData";
const RightAside = ({ introVideo, basePrice,selectedDate,setSelectedDate,professionalDetails,getProfessionalsDetails, setShowMessageModal }) => {
    const userDetails = useSelector(getUserDetails);
    const dispatch=useDispatch()
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const slotObj=useSelector(selectSlotList)
    const navigate = useNavigate()
    // const [showMessageModal,setShowMessageModal] =useState(false)
    const isProfessionalBlocked = useSelector(selectProfessionalsData).isProfessionalBlocked

    const toast = useRef(null);
    useEffect(()=>{
    },[])

    const addFavourite = (id) => {
        console.log("FAZOURATEADD",id)

        api.getFavourites({ professional_id: id }).then((data) => {
            if (data.status) {
                toast.current.show({ severity: 'success', summary: 'Success Message', detail: `${data.data.message}`, life: 3000 });
                getProfessionalsDetails()
                // showSuccess(data);
                // getProfessionals()
            }
        }).catch((err) => {
            console.log('err', err)
        })
    }

    const removeFavourite = (id) => {
        console.log("FAZOURATEREMOVE",id)

        api.getFavourites({ professional_id: id }).then((data) => {
            if (data.status) {
                toast.current.show({ severity: 'success', summary: 'Success Message', detail: `${data.data.message}`, life: 3000 });
                getProfessionalsDetails()
                // showSuccess(data);
                // getProfessionals()
            }
        }).catch((err) => {
            console.log('err', err)
        })
    }

    const toggleFavourite = (items) => {
        console.log("FAZOURATE",items)
        if (items.is_favourite) {
            removeFavourite(items.id);      
        } else {
            addFavourite(items.id);
        }
    };
    const sentMessage = () => {
        if (isProfessionalBlocked === false) {
            console.log(JSON.stringify(professionalDetails))
            dispatch(setChatItem(professionalDetails))
            localStorage.setItem('chatScheduleStatus', true)
            setShowMessageModal(true)
        }
    }
    return (
        <>
            <div className="">
            <Toast ref={toast} />
                <div>
                    <div className="h-[250px]">
                    <video className="img-responsive" controls autoPlay muted>
                        <source src={introVideo} type="video/mp4" />
                    </video>
                    </div>
                    
                    <div className="p-4 font-semibold">
                        <div className="flex justify-between mb-2">
                            <h2 className="text-2xl font-bold">{basePrice} AED <span className="text-gray-500 font-normal">/</span> <span className="text-sm text-gray-500 font-normal">Minute</span></h2>
                            <RWebShare
                                data={{
                                text: "Take live lessons with the best online language tutors",
                                url: "https://meetweb.iroidtechnologies.in",
                                title: "MeetUrDream",
                                }}
                            >
                                <span className="flex items-center gap-2 cursor-pointer">Share <span> <IoMdShareAlt size={22} color="#F4B319" /> </span> </span>
                            </RWebShare>
                        </div>
                        {professionalDetails.user_id !== userDetails.id && slotObj.id!=undefined &&  <Link to="/checkout">
                            <button className="bg_primary w-full flex justify-between rounded-md text-white text-lg font-semibold py-3 px-3 mb-2 mt-5 items-center">
                                Book Session
                                <span><AiOutlineArrowRight size={20} className="" /></span>
                            </button>
                        </Link>}
                        {professionalDetails.user_id !== userDetails.id &&  
                        <button onClick={()=>{isLoggedIn ? sentMessage() : navigate("/sign_in")}} className={`border-2 w-full flex justify-between rounded-md text-gray-800 text-lg font-semibold py-3 px-3 mb-2 items-center ${isProfessionalBlocked ? "bg-gray-200" : 'hover:bg-gray-100 ease-in duration-300'}`}
                            disabled={isProfessionalBlocked ? true : false}>
                                Send Message
                            {isProfessionalBlocked ? <span><BiBlock size={20} /> </span> : <span><AiOutlineArrowRight size={20} className="" /></span>}
                        </button>}
                        {professionalDetails.user_id !== userDetails.id && 
                            <button onClick={() => {isLoggedIn ? toggleFavourite(professionalDetails) : navigate("/sign_in")}} className="border-2 w-full flex justify-between rounded-md text-gray-800 text-lg font-semibold py-3 px-3 mb-2 items-center hover:bg-gray-100 ease-in duration-300 ">
                                { professionalDetails.is_favourite ? 
                                    (<>
                                        <span>Unsave</span>  <span>  <AiFillHeart size={20} className="text-red-500" /></span>
                                    </>) : (
                                    <>
                                        <span>Save</span> 
                                        <span> <AiOutlineHeart size={20} className="" /></span>
                                    </>
                                    )
                                }                           
                            </button>
                        }     
                        <div className="flex between"></div>
                    </div>
                </div>
            </div>
            {/* {showMessageModal && <ChatIndividualMessage setShowMessageModal={setShowMessageModal} setOnePersonChat={setShowMessageModal} image={professionalDetails.thumb_image_url} to_id={professionalDetails.user_id} from_id={userDetails.id} to_name={professionalDetails.user.name}/>} */}
        </>
    )
}
export default RightAside;