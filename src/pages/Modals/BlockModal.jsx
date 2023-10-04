import React from "react";
import api from '../../Api/GeneralApi'
import { useParams } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { setIsProfessionalBlocked,selectProfessionalsData } from "../../features/redux/professionalsData";
import BlockModalContent from "./BlockModalContent";
import UnBlockModal from "./UnBlockModal";
const BlockModal = ({ setModal,professionalName,professionalId }) => {
  const dispatch=useDispatch()
  const { prof_id } = useParams();
  const isProfessionalBlocked=useSelector(selectProfessionalsData).isProfessionalBlocked
  const getProfessionalsDetails = () => {
    api
      .getProfessionalDetails({ user_id: prof_id })
      .then((data) => {
        if (data.status==true) {
          dispatch(setIsProfessionalBlocked(data.professional_data.is_blocked))
        } else {
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function blockProfessional(){
    api.blockProfessional({"professional_id":professionalId}).then((data)=>{
      if(data.status==true){
        setModal(false)
        getProfessionalsDetails()
      }
    }).catch((err)=>{
      console.log('err',err)
    })
  }
  return (
    <>
      {isProfessionalBlocked==true?<UnBlockModal setModal={setModal} blockProfessional={blockProfessional} professionalName={professionalName}/>:<BlockModalContent setModal={setModal} blockProfessional={blockProfessional} professionalName={professionalName}/>}
      {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
    </>
  );
};

export default BlockModal;
