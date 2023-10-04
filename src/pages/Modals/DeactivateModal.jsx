import React from "react";
import { useDispatch } from 'react-redux'
import { setLoggedInValue, userDetailsFetch } from '../../features/redux/auth'
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { googleLogout } from '@react-oauth/google';
const DeactivateModal = ({ deactivateStatus }) => {
  const toast = useRef(null)
  const dispatch = useDispatch()
  const clearZendeskHistory = () => {
    const e = ["clientId", "appUserId", "sessionToken"];
    Object.keys(localStorage).filter(t => e.includes((e => e.split(".")[1])(t))).forEach(e => localStorage.removeItem(e))
  }
  const optIntoUncachedConfigEndpoint = () => {
    window.zESettings = {
      ...window.zESettings,
      preview: !0
    }
  }
  const logOut = async () => {
    if (clearZendeskHistory()) {
      optIntoUncachedConfigEndpoint()
    }
    dispatch(setLoggedInValue(false))
    dispatch(userDetailsFetch({}))
    localStorage.removeItem('meetingDuration')
    localStorage.removeItem('meetingEndtime')
    localStorage.removeItem('callRecieverDetails')
    localStorage.removeItem('MEETING_CREDENTIALS')
    localStorage.removeItem('meetingDurationInTimestamp')
    window.history.pushState({}, null, "/sign_in");
    window.location.reload();
    googleLogout();
    window.FB.getLoginStatus(function (response) {
      window.FB.logout(function (response) {
        console.log("Logout")
      });
    });
  }
  return (
    <>
      <Toast ref={toast} />
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

            {/*body*/}
            <div class="p-6 text-center">
              <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h1 class="mb-5 text-3xl font-normal text-gray-900 dark:text-gray-400">{deactivateStatus?.response}</h1>
              <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{deactivateStatus?.message}</h3>
              <button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                onClick={logOut}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default DeactivateModal;