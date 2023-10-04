import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import ListSlot from "./ListSlot";
import EditSlot from "./EditSlot";

const ListDeleteSlot = ({
  day,
  selectedSlots,
  predefinedSlots,
  filteredSlot,
  professionalId,
  setProfileDetails,
  notSelectedDays,
  setNotSelectedDays,
}) => {
  const toast = useRef(null);
  const [editStatus, setEditStatus] = useState(false);
  return (
    <div className="p-4 border-2 rounded-md mb-3">
      <Toast ref={toast} />
      {editStatus ? (
        <EditSlot
          day={day}
          selectedSlots={selectedSlots}
          predefinedSlots={predefinedSlots}
          setEditStatus={setEditStatus}
          professionalId={professionalId}
          notSelectedDays={notSelectedDays}
          setNotSelectedDays={setNotSelectedDays}
          setProfileDetails={setProfileDetails}
        />
      ) : (
        <ListSlot
          day={day}
          selectedSlots={selectedSlots}
          predefinedSlots={filteredSlot}
          nonFilteredPredefinedSlots={predefinedSlots}
          professionalId={professionalId}
          setProfileDetails={setProfileDetails}
          setEditStatus={setEditStatus}
        />
      )}
    </div>
  );
};

export default ListDeleteSlot;
