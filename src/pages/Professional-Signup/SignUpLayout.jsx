
import Header from '../../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { selectProfessionalSignUpViewIndex } from '../../features/redux/pageData'
import { getUserDetails, selectIsLoggedIn, setLoggedInValue, userDetailsFetch } from '../../features/redux/auth'
import HeaderView from './HeaderView'
import FormView from './FormView'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import api from "../../Api/GeneralApi"
import DeactivateModal from '../Modals/DeactivateModal'
import { googleLogout } from '@react-oauth/google';
const SignUpLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const professionalSignUpViewIndex = useSelector(selectProfessionalSignUpViewIndex)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const userDetails = useSelector(getUserDetails)
  const userType = userDetails.is_professional
  const [userAlreadyLogin, setUserAlreadyLogin] = useState({
    status: false,
    message: ""
  })
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
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/sign_in')
    }
    if (isLoggedIn) {
      let fcmToken = localStorage.getItem("fcmToken")
      let data = {
        device_token: fcmToken
      }
      api.CheckUserAlreadyLogin(data).then((res) => {
        if (res.data.status) {
          setUserAlreadyLogin({
            status: res.data.login_status,
            message: res.data.message
          })
        } else if (res.response.status === 401) {
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
      }).catch((err) => {
        console.log(err)
      })
      if (userType) {
        navigate('/become_profession')
      }
    }
  }, [])
  return (
    <>
      <Header />
      <section className='bg_gray'>
        <HeaderView professionalSignUpViewIndex={professionalSignUpViewIndex} />
        <FormView professionalSignUpViewIndex={professionalSignUpViewIndex} />
      </section>
      {userAlreadyLogin.status && <DeactivateModal deactivateStatus={userAlreadyLogin} />}
    </>
  )
}

export default SignUpLayout