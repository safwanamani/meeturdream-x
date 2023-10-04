import React, { useState, useRef,useEffect } from "react";
import { connect, useDispatch, useSelector } from 'react-redux';
import blue from "../../assets/verified.png";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import RatingView from "../../components/RatingView";
import BookSessionModal from "../Modals/BookSessionModal";
import api from '../../Api/GeneralApi'
import { Toast } from 'primereact/toast';
import {getUserDetails}  from '../../features/redux/auth'
import ChatIndividualMessage from "../Chat/ChatIndividualMessage";
import  {setshowBookButton}  from "../../features/redux/slotListData";
import { setChatItem } from "../../features/redux/chatData";
import { IoIosStar } from 'react-icons/io';
const ProfessionCard = ({ items, index, showFavouriteIcon, auth: { isLoggedIn }, getProfessionals,professionals }) => {
    const dispatch =useDispatch()
    const [showModal, setModal] = useState(false);
    const [showFavourite, setShowFavourite] = useState(false)
    const [showBookSession, setBookSession] =useState(false)
    
    const [showRespectiveProfessionalsMessageModal,setShowRespectiveProfessionalsMessageModal]=useState(false)
    const toast = useRef(null);
    const userDetails = useSelector(getUserDetails);   
    const addFavourite = (id) => {
        api.getFavourites({ professional_id: id }).then((data) => {
            if (data.status) {
                showSuccess(data);
                getProfessionals()
            }
        }).catch((err) => {
            console.log('err', err)
        })
    }

    const removeFavourite = (id) => {
        api.getFavourites({ professional_id: id }).then((data) => {
            if (data.status) {
                showSuccess(data);
                getProfessionals()
            }
        }).catch((err) => {
            console.log('err', err)
        })
    }
    const showSuccess = (data) => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: `${data.data.message}`, life: 3000 });
    }

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Info Message', detail: 'Please Login to Add favourite', life: 3000 });
    }

    const toggleFavourite = (items) => {
        console.log("FAZOURATE",items)
        if (items.is_favourite) {
            removeFavourite(items.id);
        } else {
            addFavourite(items.id);
        }
    };

    const Staricons=()=>{
        return(
            [...Array(Math.round(5))].map((i,ind)=>
            <span className='' key={ind}><IoIosStar className='text-gray-400'/></span>
            )
            
        )
    }
    return (
        <>
            <div
                onClick={() => {
                    localStorage.setItem("professionalsDetails", JSON.stringify(items))
                }}>
                <Toast ref={toast} />
                <div className="lg:flex md:flex sm:flex p-3 bg-white shadow-lg shadow-gray-500/400 mt-4 xl:items-center lg:items-start sm:items-start gap-6">


                    <div className="w-[160px] h-[160px] flex-none relative">
                        <Link to={`/detailpage/${items.user_id}`} className>
                            <img
                                src={items.thumb_image_url}
                                className="img-responsive rounded-sm object-cover"
                                onError={(e) => {
                                    e.target.src = "/assets/NoneProfile.png"
                                }}
                                alt=""
                            />
                        </Link>
                        {isLoggedIn ? (<>
                            {showFavouriteIcon &&
                                <a className="cursor-pointer" onClick={() => toggleFavourite(items)}>
                                    {items?.is_favourite ? <div className="bg-[#32323224] rounded-full absolute top-2 right-2 p-1">
                                        <AiFillHeart
                                        className=" text-red-500 shadow-sm "
                                        size={24}
                                    /> 
                                    </div>: <div className="bg-[#32323224] rounded-full absolute top-2 right-2 p-1"><AiOutlineHeart
                                        className="text-white"
                                        size={24}
                                    /></div>}
                                </a>
                            }
                        </>) : (<a className="cursor-pointer" onClick={() => showInfo()}>
                            <div className="bg-[#32323224] rounded-full absolute top-2 right-2 p-1">
                            <AiOutlineHeart
                                className="text-white"
                                size={24}
                            />
                            </div>
                            
                        </a>)}

                    </div>


                    <div className="lg:flex md:flex lg:items-center md:gap-4  lg:gap-5 lg:justify-between w-full">
                        <Link to={`/detailpage/${items.user_id}`} >
                            <div className="">
                                <h2 className="text-xl font-bold inline-flex items-center cursor-pointer capitalize">
                                    {items.user.name}
                                    <span>
                                        <img
                                            src={items.country.flag_url}
                                            alt=""
                                            width={25}
                                            className="ml-2"
                                        />
                                    </span>
                                    {items.verfied_status ?  <span className="h-[20px] w-[20px]">
                                        <img src={blue} alt="" className="ml-1 bg-cover w-full h-full" />
                                    </span> :""}
                                   
                                </h2>
                                <h6 className="text-sm text-gray-700 font-semibold">
                                    {items?.sub_category?.sub_category_name}
                                </h6>
                                <div className="flex gap-1 py-1 items-center">
                                    {items.average_rating > 0 ? (
                                        <RatingView rating={items.average_rating} />
                                    ):Staricons()}
                                    <p className="text-sm font-bold">
                                        {items.ratings_count} Reviews
                                    </p>
                                </div>
                                <p className="text-md pb-1 text-gray-700 para__limit__2">{items.description}</p>
                                <p className="font-bold text-xl">
                                    {items.base_rate} AED{" "}
                                    <span className="font-normal text-gray-500">/</span>{" "}
                                    <span className="font-normal text-sm text-gray-500">
                                        Minute
                                    </span>
                                </p>
                            </div>
                        </Link>

                        <div className="lg:block flex-none flex md:block  mt-2 sm:mt-2 sm:gap-2 gap-2">
                            {items.user_id !== userDetails.id && <button
                                className="bg_primary rounded-full text-white w-[170px] h-[45px] block mb-3"
                                onClick={() => {setModal(true); dispatch(setshowBookButton(true));dispatch(setChatItem(items))}}
                                >
                                Book Session
                                </button> }  
                            {isLoggedIn && items.user_id !== userDetails.id ? 
                            <button className="rounded-full text-gray-800 w-[170px] h-[45px] bg-gray-200 " onClick={()=>{localStorage.setItem('chatScheduleStatus', true);setShowRespectiveProfessionalsMessageModal(true);console.log("Show items",items);dispatch(setChatItem(items))}}>
                                Message
                            </button> : null}
                            
                        </div>
                    </div>
                </div>

            </div>
            {showRespectiveProfessionalsMessageModal&&
            <ChatIndividualMessage user_unique_id={items} setShowMessageModal={setShowRespectiveProfessionalsMessageModal} image={items.image_url} to_id={items.user_id} from_id={userDetails.id} to_name={items.user.name}  setOnePersonChat={setShowRespectiveProfessionalsMessageModal}/>}
            {showModal ? <BookSessionModal setModal={setModal} professionalDetails={items}/> : null}
        </>
    );
};

export default connect((state) => state)(ProfessionCard);
