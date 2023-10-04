import React,{useRef} from "react";
import { useState,useEffect } from "react";
import api from "../../Api/GeneralApi"
import { useSelector } from "react-redux";
import RatingView from "../../components/RatingView";
import {getUserDetails}  from '../../features/redux/auth'
import { Toast } from "primereact/toast"
import { IoIosStar } from 'react-icons/io';
const ReviewSection = ({professionalId}) => {
    const toast = useRef(null)
const [reviewsList,setReviewsList]=useState([])
const userDetails = useSelector(getUserDetails); 
useEffect(() => {
    getReviewDetails()
}, [])
const getReviewDetails=()=>{
    const userDetails=JSON.parse(localStorage.getItem('professionalsDetails'))
    api.getReviewDetails({professional_user_id:userDetails.id})
        .then((data)=>{
            setReviewsList(data?.reviews)
        })
        .catch((err)=>{
            console.log(err)
        })
}

const deleteReview = (review)=>{
    api.deleteReview({review_id:review.id}).then((data)=>{
        if(data.status){
            toast.current.show({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
            getReviewDetails();
        }

    }) .catch((err)=>{
        console.log(err)
    })

}
const getDateAndMonth=(date)=>{
    const dateObj=new Date(date)
    let day=dateObj.getDate()
    let month=dateObj.toLocaleString('default', { month: 'long' });
    let year = dateObj.getFullYear()
    return `${month} ${day},${year}`
}
const Staricons=()=>{
    return(
        [...Array(Math.round(5))].map((i,ind)=>
        <span className='' key={ind}><IoIosStar className='text-gray-400'/></span>
        )
    )
}
    return (
        <> 
        <Toast ref={toast} />
            <div className="detail_box">
                <div className="head_wrap">
                    <h2 className="title">Reviews</h2>
                </div>
                <hr />
                {reviewsList&&reviewsList.map(items => (
                    <div className="p-4" key={items.id}>
                        <div className="review_card lg:flex md:flex sm:flex flex gap-4 w-full">
                            <div className="w-[100px] h-[100px] flex-none">
                                <img src={items.user_image} alt="" className="rounded-full img-responsive object-cover" />
                            </div>
                            <div className="lg:flex lg:justify-between md:flex md:justify-between w-full">
                                <div>
                                    <h2 className="text-xl font-bold">{items.user_name}
                                        <span className="flex items-center">
                                           {
                                            items.rating?
                                            <RatingView rating={items.rating} />:Staricons()
                                           }
                                            </span>
                                    </h2>
                                    <p>{items.review}</p>
                                </div>
                                <span className="flex-none">{getDateAndMonth(items.date)} <br/> 
                                {items.user_id === userDetails.id && <button onClick={()=>deleteReview(items)} className="w-full btn_primary bg_primary rounded-sm mt-3 py-3 text-white">Delete</button> }
                                {/* <button onClick={()=>deleteReview(items.id)} className="w-full btn_primary bg_primary rounded-sm mt-3 py-3 text-white">Delete</button> */}
                                </span>
                             
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
export default ReviewSection;