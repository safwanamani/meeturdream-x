import React, { useEffect, useRef } from "react";
import Header from "../../components/Header";
import blue from "../../assets/verified.png";
import AboutSection from "./AboutSection";
import ScheduleSection from "./ScheduleSection";
import ResumeSection from "./ResumeSection";
import ReviewSection from "./ReviewSection";
import RightAside from "./RightAside";
import { BiBlock } from "react-icons/bi";
import {GrStatusWarning} from "react-icons/gr"
import { useParams } from "react-router-dom";
import api from "../../Api/GeneralApi";
import { useState } from "react";
import RatingView from "../../components/RatingView";
import DetailAnimation from "../SkeletonAnimation/DetailPageAnimation";
import ListReasonsModal from "../Modals/ListReasonsModal";
import BlockModal from "../Modals/BlockModal";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfessionalsData,
  setIsProfessionalBlocked,
} from "../../features/redux/professionalsData";
import { selectIsLoggedIn,getUserDetails } from "../../features/redux/auth";
import { Toast } from "primereact/toast";
import { IoIosStar } from 'react-icons/io';
import ChatIndividualMessage from "../Chat/ChatIndividualMessage";
const DetailPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userDetails = useSelector(getUserDetails);  
  const toast = useRef(null);
  const { prof_id } = useParams();
  const [professionalDetails, setProfessionalDetails] = useState({});
  const [showModal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const isProfessionalBlocked=useSelector(selectProfessionalsData).isProfessionalBlocked
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
    
  const setShowModal = (type) => {
    setModal(true);
    setModalType(type);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    getProfessionalsDetails();
  }, []);
  function blockProfessional() {
    if (isProfessionalBlocked == true) {
      setShowModal("Block");
      // api.blockProfessional({"professional_id":professionalDetails.id}).then((data)=>{
      //     if(data.status){
      //         dispatch(setIsProfessionalBlocked(false))
      //     }
      //   }).catch((err)=>{
      //     console.log('err',err)
      //   })
    } else {
      setShowModal("Block");
    }
  }
  const getProfessionalsDetails = () => {
    api
      .getProfessionalDetails({ user_id: prof_id })
      .then((data) => {
        if (data.status) {
          setProfessionalDetails(data.professional_data);
          console.log("Pro details",data.professional_data)
          dispatch(setIsProfessionalBlocked(data.professional_data.is_blocked));
        } else {
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //modal reasons for report
  const reasons = [
    "Used abusive language",
    "Impersonating someone else",
    "Spreading false or incorrect information",
    "Scam or fraud"
  ];
  const submitReason = (reason) => {
    api
      .reportProfessional({
        professional_id: professionalDetails.id,
        message: reason,
      })
      .then((data) => {
        if (data.status == true) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          setModal(false);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: data.message,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
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
      <Toast ref={toast}></Toast>
      <Header />
      <section className="bg_gray" onClick={() => { if (isCalendarVisible) { setIsCalendarVisible(false) }}}>
        <div className="container mx-auto">
          {professionalDetails.user ? (
            <div className="wrap lg:flex md:p-5 lg:gap-4 gap-2 xl:px-24 items-start">
              <div className=" lg:w-4/6">
                <div className="left_side_wrap">
                  <div className="bg-white lg:p-5 md:p-3 rounded-md">
                    <div className="md:flex lg:gap-5 gap-4">
                      <div className="max-w-[200px] h-[200px] flex-none mx-auto">
                        <img
                          src={professionalDetails?.image_url}
                          className="img-responsive object-cover"
                          alt=""
                        />
                      </div>
                      <div className="">
                        <h2 className="text-2xl font-bold inline-flex items-center">
                          {professionalDetails?.user?.name}
                          <span>
                            <img
                              src={professionalDetails?.country?.flag_url}
                              alt=""
                              width={30}
                              className="ml-2"
                            />
                          </span>
                          {professionalDetails?.verfied_status && 
                            <span className="w-[25px] h-[25px]">
                              <img
                                src={blue}
                                alt=""
                                className="ml-2 w-full h-full object-cover"
                              />
                            </span>
                          }
                        </h2>
                        <h6 className="text-sm text-gray-700 font-semibold">
                          {professionalDetails?.sub_category?.sub_category_name}
                        </h6>
                        <p>{professionalDetails?.description}</p>

                        <h6 className="text-sm text-gray-700 font-semibold">
                          {professionalDetails?.category?.category_name}
                        </h6>
                        <div className="flex gap-1 py-1 items-center">
                          {professionalDetails?.average_rating > 0 ? (
                            <RatingView
                              rating={professionalDetails?.average_rating}
                            />
                          ):Staricons()}
                          <p className="text-sm font-bold">
                            {professionalDetails?.ratings_count} Reviews
                          </p>
                        </div>
                        <div className="flex mt-2 sm:gap-4 gap-2 flex-wrap">
                          <span className="bg_gray py-2 px-3 text-center rounded-md">
                            <p className="text-[12px] font-bold">Per Min</p>
                            <h6 className="font-black text-md">
                              AED {professionalDetails?.base_rate}
                            </h6>
                          </span>
                          {professionalDetails?.work_experience >= 0 ? (
                            <span className="bg_gray py-2 px-3 text-center rounded-md">
                              <p className="text-[12px] font-bold">
                                Experience
                              </p>
                              <h6 className="font-black text-xl">
                                {professionalDetails?.work_experience ? professionalDetails?.work_experience : 0}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                  {professionalDetails?.work_experience > 1
                                    ? "Years"
                                    : "Year"}
                                </span>
                              </h6>
                            </span>
                          ) : null
                          }
                          {professionalDetails?.session >= 0 ? (
                            <span className="bg_gray py-2 px-3 text-center rounded-md">
                              <p className="text-[12px] font-bold">Sessions</p>
                              <h6 className="font-black text-md">
                                {professionalDetails?.session}
                              </h6>
                            </span>
                          ): ""}
                          <span className="bg_gray py-2 px-3 text-center rounded-md">
                            <p className="text-[12px] font-bold">Reviews</p>
                            <h6 className="font-black text-md">
                              {professionalDetails?.ratings_count}
                            </h6>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="bg-white lg:p-5 p-3 rounded-md">
                      <ul className="flex gap-5 lg:mb-5 mb-2 text-[16px] text-bold overflow-x-auto">
                        <a href="#about">
                          {" "}
                          <li className="text-bold">About</li>
                        </a>
                        <a href="#schedule">
                          {" "}
                          <li className="text-bold">Schedule</li>
                        </a>
                        <a href="#resume">
                          {" "}
                          <li className="text-bold">Resume</li>
                        </a>
                        <a href="#review">
                          {" "}
                          <li className="text-bold">
                            Reviews ({professionalDetails.ratings_count})
                          </li>
                        </a>
                      </ul>
                      <div id="about">
                        <AboutSection about={professionalDetails.description} />
                      </div>
                      <div id="schedule">
                        <ScheduleSection
                          professionalDetails={professionalDetails}
                          selectedDate={selectedDate}
                          setSelectedDate={setSelectedDate}
                          isCalendarVisible={isCalendarVisible}
                          setIsCalendarVisible={setIsCalendarVisible}
                        />
                      </div>
                      <div id="language">
                        {/* <LanguageSection languageArray={professionalDetails.languages}/> */}
                      </div>
                      <div id="resume">
                        <ResumeSection professionalId={prof_id} />
                      </div>
                      <div id="review">
                        <ReviewSection professionalId={prof_id} />
                      </div>

                      {userDetails.id !== professionalDetails.user_id && isLoggedIn == true &&   (
                        <>
                          <div
                            className="bg-gray-100 p-4 mb-4 flex justify-between items-center rounded-md border-2 cursor-pointer"
                            onClick={() => setShowModal("Report")}
                          >
                            <p className="font-bold text-md">Report </p>
                            <i>
                              <GrStatusWarning size={22} />
                            </i>
                          </div>
                          <div
                            className="bg-gray-100 p-4 flex justify-between items-center rounded-md border-2 cursor-pointer"
                            onClick={() => blockProfessional()}
                          >
                            <p className="font-bold text-md">
                              {isProfessionalBlocked == true
                                ? "Unblock"
                                : "Block"}
                            </p>
                            <i>
                              <BiBlock size={22} />
                            </i>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-2/6 sticky top-0">
                <div className="right_side_wrap bg-white rounded-md">
                  <RightAside
                    introVideo={professionalDetails?.intro_vedio}
                    basePrice={professionalDetails?.base_rate}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    professionalDetails={professionalDetails}
                    getProfessionalsDetails={getProfessionalsDetails}
                    setShowMessageModal={setShowMessageModal}
                    showFavouriteIcon
                    // getProfessionalsDetails={getProfessionalsDetails}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="wrap lg:flex p-5 lg:gap-4 gap-2 xl:px-24">
              <DetailAnimation />{" "}
            </div>
          )}
        </div>
      </section>
      {showModal ? (
        modalType === "Report" ? (
          <ListReasonsModal
            modalFor="Report"
            setModal={setModal}
            reasons={reasons}
            submitReason={submitReason}
            submitButton="Report"
          />
        ) : modalType === "Block" ? (
          <BlockModal
            setModal={setModal}
            professionalName={professionalDetails.user.name}
            professionalId={professionalDetails.id}
          />
        ) : null
      ) : null}
      {showMessageModal && <ChatIndividualMessage setShowMessageModal={setShowMessageModal} setOnePersonChat={setShowMessageModal} image={professionalDetails.thumb_image_url} to_id={professionalDetails.user_id} from_id={userDetails.id} to_name={professionalDetails.user.name} />}
    </>
  );
};

export default DetailPage;
