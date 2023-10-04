import React from 'react';
// import ReactDOM from 'react-dom/client';
import './index.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Index from './pages/Become_Professional/Index';
import Header from './components/Header';
import Footer from './components/Footer';
import Sign__in from './pages/Sign_in/Sign_in';
import Sign__up from './pages/Sign__up/Sign_up';
import ForgotPassword from './pages/Forgot-Password/Forgot-password';
import Otp from './pages/otp/otp';
import AboutUs from './pages/About';
import Search from './pages/Search/search-professionals';
import Privacy from './pages/Policy-pages/Privacy';
import Terms from './pages/Policy-pages/Terms-and-contition';
import DetailPage from './pages/Profession-Detailpage/LayoutDetail';
import WishList from './pages/wishlist/Wishlist';
import Dashboard from './pages/Professional-Dashboard/Dashboard';
import Mysession from './pages/My-sessions/MySessionLayout';
import CheckOut from './pages/Checkout/Checkout';
import SettingsLayout from './pages/Settings/SettingLayout';
import SignUpLayout from './pages/Professional-Signup/SignUpLayout';
import ChatwootWidget from './components/ChatWoot/chatWidget';
import CallPage from './components/Video Call/CallPage';
import ConfirmPassword from './pages/Forgot-Password/ConfirmPassword';
import FavouriteList from './pages/Favourites';
import { onMessage } from "firebase/messaging";
import TransactionComplete from './pages/Checkout/TransactionComplete';
import { useSelector } from 'react-redux';
import { getUserDetails, selectIsLoggedIn } from './features/redux/auth';
import AlreadyRegistered from './pages/Professional-Signup/AlreadyRegistered';
import Referal from './pages/ReferalLink';
import Success from './pages/ReferalLinkSucess';
import ApplePay from './ApplePay/ApplePay';
import ErrorPage from './pages/404/404';
export default function App() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const userDetails = useSelector(getUserDetails)
  const userType = userDetails.is_professional
  const professionalRequested = userDetails.professional_status
  // onMessageListener()
   const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage((payload) => {
      resolve(payload);
    });
  });
  onMessageListener().then((payload)=>{
    console.log('payload Notification',payload)
  }).catch((err) => console.log("failed: ", err));
  return (
    <>
    {/* <ChatwootWidget /> */}
    <Routes>
      <Route path="/" element={<Home />}/> 
      {/* <Route path="/become_profession" element={<Index/>} />  */}
      <Route path="/" element={<Header/>} /> 
      <Route path="/become_profession" element={isLoggedIn ? userType == 0 && professionalRequested ? <AlreadyRegistered /> : <Index /> : <Index />} /> 
      <Route path="/sign_in" element={<Sign__in />} /> 
      <Route path="/sign_up" element={<Sign__up />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/otp" element={<Otp />} /> 
      <Route path="/about" element={<AboutUs />} /> 
      <Route path="/search" element={<Search />} /> 
      <Route path="/privacy" element={<Privacy />} /> 
      <Route path="/Terms-and-service" element={<Terms />} /> 
      <Route path="/detailpage/:prof_id" element={<DetailPage />} /> 
      <Route path="/wishlist" element={<WishList />} /> 
      {/* <Route path="/dashboard" element={<Dashboard />} />  */}
      <Route path="/mysession" element={<Mysession />} /> 
      <Route path="/checkout" element={<CheckOut />} /> 
      <Route path="/settings" element={<SettingsLayout />} /> 
      <Route path="/profession-signup" element={<SignUpLayout />} /> 
      <Route path="/confirm-password" element={<ConfirmPassword />} />
      <Route path="/session-call" element={<CallPage />} />
      <Route path="/favourites" element={<FavouriteList />} />
      <Route path='/otp-checkout' element={<TransactionComplete/>} />
      <Route path='/referral/:referral_code' element={<Referal/>} />
      <Route path='/success' element={<Success/>} />
      <Route path='*' element={<ErrorPage/>} />
      {/* <Route path='/.well-known/:file' element={<ApplePay />} /> */}
    </Routes>
    <Footer />
  </>
  );
}

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<App />);

