import React, { useState, useRef } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import moment from "moment/moment";
import AddNewSlot from "./AddNewSlot";
import SmallCommonModal from "../../Modals/SmallCommonModal";
import { Toast } from "primereact/toast";
import api from "../../../Api/GeneralApi";

const ListSlot = ({
  day,
  selectedSlots,
  predefinedSlots,
  nonFilteredPredefinedSlots,
  professionalId,
  setProfileDetails,
  setEditStatus,
}) => {
  const toast = useRef(null);
  const [addSlotState, setAddSlotState] = useState(false);
  const [selectSlot, setSelectSlot] = useState({
    slotId: "",
    type: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const slotSelection = (id, type) => {
    if (selectSlot.slotId === id) {
      setSelectSlot({
        slotId: "",
        type: "",
      });
    } else {
      setSelectSlot({
        slotId: id,
        type: type,
      });
    }
  };
  const deleteSingleSlot = async () => {
    let deleteObj = {
      slot_id: selectSlot.slotId,
      type: selectSlot.type,
      professional_id: professionalId,
    };
    await api.deleteSingleSlot(deleteObj).then((data) => {
      if (data.status === true) {
        api.getMyProfile().then((data) => {
          let profileData = data.data;
          setProfileDetails((prevValue) => ({
            ...prevValue,
            customSlots: profileData.customSlots,
            predefindSlots: profileData.predefindSlots,
          }));
        });
        setTimeout(() => {
          setSelectSlot({
            slotId: "",
            type: "",
          });
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
        }, 300);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message,
          life: 3000,
        });
      }
    });
  };
  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-between">
        <h4 className="mb-3 font-semibold">{day}</h4>
        <span className="flex gap-2">
          <AiOutlinePlusCircle
            size={22}
            className="cursor-pointer"
            onClick={() => setAddSlotState((current) => !current)}
          />
          <AiOutlineEdit
            className="cursor-pointer"
            size={22}
            onClick={() => setEditStatus((prevStatus) => !prevStatus)}
          />
          {selectSlot.slotId ? (
            <AiOutlineDelete
              className="cursor-pointer"
              size={22}
              onClick={() => setShowDeleteModal(true)}
            />
          ) : null}
        </span>
      </div>
      <ul className="">
        {selectedSlots.map(
          (slot, key) =>
            slot.day === day && (
              <li className="inline-block" key={key}>
                <button
                  className={`px-3 py-2 border-2 border-gray-300 rounded-md text-sm mr-2 mb-2 ${
                    selectSlot.slotId ===
                    (slot.professional_predefined_id
                      ? slot.professional_predefined_id
                      : slot.professional_custom_id)
                      ? "active-slot"
                      : ""
                  }`}
                  onClick={() =>
                    slotSelection(
                      slot.professional_predefined_id
                        ? slot.professional_predefined_id
                        : slot.professional_custom_id,
                      slot.professional_predefined_id ? "predefined" : "custom"
                    )
                  }
                >
                  {moment(slot.start_time, ["h:mm:ss"]).format("HH:mm")} -{" "}
                  {moment(slot.end_time, ["h:mm:ss"]).format("HH:mm")}
                </button>
              </li>
            )
        )}
      </ul>
      {addSlotState ? (
        <AddNewSlot
          selectedSlots={selectedSlots}
          predefinedSlots={predefinedSlots}
          nonFilteredPredefinedSlots={nonFilteredPredefinedSlots}
          day={day}
          professionalId={professionalId}
          setProfileDetails={setProfileDetails}
          setAddSlotState={setAddSlotState}
        />
      ) : null}
      {showDeleteModal ? (
        <SmallCommonModal
          setModal={setShowDeleteModal}
          bodyText="Are you sure you want to delete this slot ?"
          submitFunction={deleteSingleSlot}
        />
      ) : null}
    </>
  );
};

export default ListSlot;
