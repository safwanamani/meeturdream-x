import React, { useState, useRef } from "react";
import img from "../../assets/NoneProfile.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../features/redux/auth";
import { BiCheckDouble } from "react-icons/bi";
import ProcessingButton from "../Settings/components/ProcessingButton";
import {
  collection,
  addDoc,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";
import { appl } from "../../firebaseConfig/config";
import RatingView from "../../components/RatingView";
import UserCardData from "./userCardData";
import { Toast } from "primereact/toast";
import { IoIosStar } from 'react-icons/io';
import api from "../../Api/GeneralApi";
const UserCard = ({ items, indx }) => {
  const toast = useRef(null)
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const db = getFirestore(appl);
  const to_name = items.name;
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const to_id = items.id;
  const from_id = userDetails?.id;
  const from_name = userDetails?.name;
  const [isRequested, setIsRequested] = useState(false)
  const [isRequestProcessing, setIsRequestProcessing] = useState(false)
  const getCombinationIndexOnId = (fromId, toId) => {
    if (fromId % 2 == 0 && toId % 2 != 0) {
      return `${fromId}-${toId}`;
    } else if (fromId % 2 != 0 && toId % 2 == 0) {
      return `${toId}-${fromId}`;
    } else {
      if (fromId > toId) {
        return `${toId}-${fromId}`;
      } else if (toId > fromId) {
        return `${fromId}-${toId}`;
      }
    }
  };

  const checkWhetherRecieversNameIsNotOwnName = () => {
    // items!=undefined?items.to_name==userDetails.first_name?items.from_name:items.to_name:to_name
    let recieversName;
    if (to_name == userDetails.first_name) {
      recieversName = from_name;
    } else {
      recieversName = to_name;
    }

    return recieversName;
  };
  const checkWhetherRecieversImageIsNotOwnImage = () => {
    return items.user_profile_detail.thumb_image_url
  };
  const sendProfessionalSignupRequestToUser = async () => {
    checkWhetherRecieversImageIsNotOwnImage()
    setIsRequestProcessing(true)
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let role = userDetails.role;
    let id = userDetails.id;
    let message = `Hi ${to_name},
    I would like to book a consultation sesion with you.
    Please sign up as a professional./request`
    try {
      const docRef = await addDoc(
        collection(db, `chats/chatroom/${getCombinationIndexOnId(id, to_id)}`),
        {
          from_id: id,
          to_id: to_id,
          to_name: checkWhetherRecieversNameIsNotOwnName(),
          from_name: userDetails.name,
          messageType: 'txt',
          image: userDetails.user_profile_detail.image_url,
          message: message,
          created_at: Date.now(),
          type: role,
        }
      )
        .then(() => {
          setTimeout(() => {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Successfully Requested",
              life: 3000,
            });
            setIsRequestProcessing(false)
            setIsRequested(true)
          }, 1000)
        })
        .catch((err) => {
          console.log("err", err);
          setTimeout(() => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong",
            });
            setIsRequestProcessing(false)
          }, 1000)
          let toId = getCombinationIndexOnId(id, to_id);
          console.log(
            "checking",
            id,
            checkWhetherRecieversNameIsNotOwnName(),
            toId,
            userDetails.user_profile_detail.image_url,
            message,
            Date.now(),
            role
          );
        });
      try {
        await setDoc(
          doc(
            db,
            `chats/chatroom/lastMesssages/${getCombinationIndexOnId(id, to_id)}`
          ),
          {
            from: from_id,
            to: to_id,
            to_name: checkWhetherRecieversNameIsNotOwnName(),
            from_name: userDetails.name,
            message: message,
            // docRef: docRef,
            fromImage: userDetails.user_profile_detail.image_url,
            toImage: checkWhetherRecieversImageIsNotOwnImage(),
            created_at: new Date(),
            timestamp: Date.now(),
          }
        ).then(() => {
        });
      } catch (e) {
        console.error("Error adding document: ", e);
        console.log(
          "checking",
          from_id,
          checkWhetherRecieversNameIsNotOwnName(),
          to_id,
          userDetails.user_profile_detail.image_url,
          userDetails.name,
          message,
          Date.now(),
          role,
          checkWhetherRecieversImageIsNotOwnImage(),
          docRef
        );
      }
      await setDoc(doc(db, `chats/chatroom/messageCounts/${getCombinationIndexOnId(id, to_id)}`), {
        chat_id: `${getCombinationIndexOnId(id, to_id)}`,
        user1: id,
        user1Count: 0,
        user2: to_id,
        user2Count: 1
      })
      await api.sendPushWhenMessage({
        sender_id: to_id,
        message: message
      }).then(() => {

      }).catch(err => {
        console.log(err)
      })
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  // function sendProfessionalSignupRequestToUser(){
  //     console.log('items',items)
  // }

  const Staricons = () => {
    return (
      [...Array(Math.round(5))].map((i, ind) =>
        <span className='' key={ind}><IoIosStar className=' text-gray-400' /></span>
      )

    )
  }
  return (
    <>
      <Toast ref={toast} />
      {items.professional_tag ? (
        <Link to={`/detailpage/${items.user_profile_detail.user_id}`}>
          <div className="lg:flex md:flex sm:flex p-3 bg-white shadow-lg shadow-gray-500/400 mt-4 xl:items-center lg:items-start sm:items-start gap-6 flex-row justify-between"
            onClick={() => {
              let user_id = items.id
              items.id = items.professional_id
              items.user_id = user_id
              localStorage.setItem("professionalsDetails", JSON.stringify(items))
            }}>
            <UserCardData items={items} />
            {items.rating > 0 ? (
              <div className="w-[170px] h-[45px]">
                <div className="flex gap-1 justify-center items-center">
                  <RatingView rating={items.rating} />
                </div>
              </div>
            ) : <div className="flex gap-1 py-1 mr-10 items-center">
              {Staricons()}
            </div>}
          </div>
        </Link>
      ) : (
        <>
          <div className="lg:flex md:flex sm:flex p-3 bg-white shadow-lg shadow-gray-500/400 mt-4 xl:items-center lg:items-start sm:items-start gap-6 flex-row justify-between">
            <UserCardData items={items} />
            {isLoggedIn ? userDetails.id !== items.id ? (
              <div className="lg:block flex-none flex md:block  mt-2 sm:mt-2 sm:gap-2 gap-2">
                {isRequested ? <div className="w-[170px] h-[45px] block mb-3 font-semibold flex">
                  <BiCheckDouble className="text-[#00FF00] mt-1 text-xl" /> Requested
                </div> : isRequestProcessing ?
                  <ProcessingButton
                    button={"requestButton"}
                  /> :
                  <button
                    className="bg_primary rounded-full text-white w-[170px] h-[45px] block mb-3"
                    onClick={() => {
                      sendProfessionalSignupRequestToUser();
                    }}
                  >
                    Request
                  </button>
                }
              </div>
            ) : (
              <div className="mt-2 sm:mt-2">
                <div className="w-[170px] h-[45px] block font-semibold text-center">( It's You )</div>
              </div>
            ) : ""}
          </div>
        </>
      )}
    </>
  );
};

export default UserCard;
