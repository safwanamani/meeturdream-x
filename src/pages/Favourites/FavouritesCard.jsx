import React, { useState, useRef } from "react";
import { connect , useSelector,useDispatch } from 'react-redux';
import verify from "../../assets/verify.png";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import RatingView from "../../components/RatingView";
import BookSessionModal from "../Modals/BookSessionModal";
import api from '../../Api/GeneralApi'
import { useEffect } from "react";
import {getUserDetails}  from '../../features/redux/auth'
import { Toast } from 'primereact/toast';
import ChatIndividualMessage from "../Chat/ChatIndividualMessage";
import { setChatItem } from "../../features/redux/chatData";
import { IoIosStar } from 'react-icons/io';
const FavouritesCard = ({ items, index, showFavouriteIcon, auth: { isLoggedIn }, getProfessionals }) => {
    const dispatch=useDispatch()
    const [showModal, setModal] = useState(false);
    const [showFavourite, setShowFavourite] = useState(false)
    const [showIndividualMessageModal,setShowIndividualMessageModal]=useState(false)
    const userDetails = useSelector(getUserDetails);  
    const toast = useRef(null);

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
        toast.current.show({ severity: 'success', summary: 'Success', detail: `${data.data.message}`, life: 3000 });
    }

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Please Login to Add favourite', life: 3000 });
    }

    const toggleFavourite = (items) => {
        if (items.is_favourite) {
            removeFavourite(items.professional_id);
        } else {
            addFavourite(items.professional_id);
        }
    };

    useEffect(() => {
    console.log("ITESM",items)
    }, [items, isLoggedIn,items.average_rating])

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
                    localStorage.setItem("professionalsDetails", JSON.stringify(items?.professional))
                }}>
                <Toast ref={toast} />
                <div className="lg:flex md:flex sm:flex p-3 bg-white shadow-lg shadow-gray-500/400 mt-4 xl:items-center lg:items-start sm:items-start gap-6">


                    <div className="w-[160px] h-[160px] flex-none relative">
                        <Link to={`/detailpage/${items.professional.user_id}`} className>
                            <img
                                src={items.professional.image_url}
                                className="img-responsive rounded-sm object-cover"
                                onError={(e)=>{
                                    e.target.src="/assets/NoneProfile.png"
                                }}
                                alt=""
                            />
                        </Link>
                        <a className="cursor-pointer" onClick={() => toggleFavourite(items)}>
                                    <AiFillHeart
                                        className="absolute top-2 right-2 text-red-500 shadow-sm "
                                        size={24}
                                    /> 
                                </a>
        
                    </div>


                    <div className="lg:flex md:flex lg:items-center sm:items-start lg:gap-5 lg:justify-between w-full">
                        <Link to={`/detailpage/${items?.professional.user_id}`} >
                            <div className="">
                                <h2 className="text-xl font-bold inline-flex items-center cursor-pointer">
                                    {items?.professionalName}
                                    <span>
                                        <img
                                            src={items.country.flag_url}
                                            alt=""
                                            width={25}
                                            className="ml-2"
                                        />
                                    </span>
                                    <span>
                                        <img src={verify} alt="" width={20} className="ml-1" />
                                    </span>
                                </h2>
                                <h6 className="text-sm text-gray-700 font-semibold">
                                    {items.subCategory}
                                </h6>
                                <div className="flex gap-1 py-1 items-center">
                                    {items.professional.average_rating > 0 ? (
                                        <RatingView rating={items.professional.average_rating} />
                                    ):Staricons()}
                                    <p className="text-sm font-bold">
                                        {items.ratings_count} Reviews
                                    </p>
                                </div>
                                {/* <p className="text-md pb-1 text-gray-700">{items.description}</p> */}
                                <p className="font-bold text-xl">
                                    {items.professional.base_rate} AED{" "}
                                    <span className="font-normal text-gray-500">/</span>{" "}
                                    <span className="font-normal text-sm text-gray-500">
                                        Minute
                                    </span>
                                </p>
                            </div>
                        </Link>

                        <div className="lg:block flex-none sm:flex flex mt-2 sm:mt-2 sm:gap-2">
                            <button
                                className="bg_primary rounded-full text-white w-[170px] h-[45px] block mb-3"
                                onClick={() => setModal(true)}
                            >
                                Book Session
                            </button>
                            <button className="rounded-full text-gray-800 w-[170px] h-[45px] bg-gray-200" onClick={()=>{setShowIndividualMessageModal(true);dispatch(setChatItem(items))}}>
                                Message
                            </button> 
                        </div>
                    </div>
                </div>

            </div>
            {showModal ? <BookSessionModal setModal={setModal} professionalDetails={items}/> : null}
            {showIndividualMessageModal && 
            <ChatIndividualMessage setShowMessageModal={setShowIndividualMessageModal} image={items.professional.image_url} to_id={items.professional.user_id} from_id={userDetails.id} to_name={items.professionalName} setOnePersonChat={setShowIndividualMessageModal}/>}
        </>
    );
};

export default connect((state) => state)(FavouritesCard);
