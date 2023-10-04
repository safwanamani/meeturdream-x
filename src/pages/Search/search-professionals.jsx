import { React, useEffect, useState } from "react";
import Header from "../../components/Header";
import Professioncard from "./ProfessionCard";
import SearchFilter from "./filter";
import api from "../../Api/GeneralApi";
import { useDispatch, connect, useSelector } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";
import UserCard from "./userCard";
import NoProductsFound from "../../components/NoProductsFound";
import { setSearchKeyword } from "../../features/redux/professionFilter";
import { setDirectSearch } from "../../features/redux/professionFilter";
import { Pagination } from "antd";
import useDebounce from "../../components/Hooks/useDebounce";
import { selectIsLoggedIn, setLoggedInValue, userDetailsFetch } from "../../features/redux/auth";
import DeactivateModal from "../Modals/DeactivateModal";
import { googleLogout } from '@react-oauth/google';

const Search = ({
  professionFilter: {
    professionList,
    directSearchProfession,
    directSearch,
    searchKeyWord,
  },
}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const [professionals, setProfessionals] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageDetails, setPageDetails] = useState({});
  const [paginatorShow, setpaginatorShow] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [current, setCurrent] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [professionalDataFilters, setProfessionalDataFilters] = useState({
    country_id: "",
    category: directSearchProfession ? professionList.id : "",
    sub_category: "",
    sort: "",
    page: pageNo,
    name: debouncedSearchTerm,
    day: "",
    time: ''
  });
  const [isDataEmpty, setIsDataEmpty] = useState(false);
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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
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
          googleLogout()
          window.FB.getLoginStatus(function (response) {
            window.FB.logout(function (response) {
              console.log("Logout")
            });
          });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }, [])
  useEffect(() => {
    if (directSearch) {
      setSearchTerm(searchKeyWord);
      if (searchTerm.length > 0) {
        getAllUsers();
      } else if (searchTerm.length == 0) {
        setUsers([]);
        setPageNo(1)
        getProfessionals();
      }
    } else {
      if (searchTerm.length > 0) {
        getAllUsers();
      } else if (searchTerm.length == 0) {
        setUsers([]);
        setPageNo(1)
        getProfessionals();
      }
    }
    return () => {
      dispatch(setDirectSearch(false));
      dispatch(setSearchKeyword(""));
    };
  }, [debouncedSearchTerm, professionalDataFilters]);

  const getAllUsers = () => {
    api
      .getAllUsers({ user: debouncedSearchTerm, page: pageNo })
      .then((result) => {
        if (result.data.status) {
          if (result.data.users.length == 0) {
            setIsDataEmpty(true);
            setUsers([]);
            setpaginatorShow(false);
          } else {
            setIsDataEmpty(false);
            setUsers(result.data.users);
            setPageDetails(result.data.page_details || {});
            setpaginatorShow(true);
          }
        } else {
          setIsDataEmpty(true);
          setUsers([]);
          setpaginatorShow(false);
        }
      });
  };
  const getProfessionals = () => {
    professionalDataFilters.name = searchTerm;
    setCurrent(professionalDataFilters.page)
    api
      .getProfessionals(professionalDataFilters)
      .then((result) => {
        setPageDetails(result.data.page_details || {});
        let professionalsData = result.data.professionals_data;
        if (result.data.message == "No Data Found") {
          setIsDataEmpty(true);
          setProfessionals([]);
          setpaginatorShow(false);
        } else {
          setProfessionalDataFilters(professionalDataFilters);
          setIsDataEmpty(false);
          setpaginatorShow(true);
        }
        if (searchTerm == "" && pageNo) {
          setProfessionals(professionalsData);
        } else {
          const newProfessionalsData = professionalsData.filter((value) =>
            value.user.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (newProfessionalsData.length > 0) {
            professionalDataFilters.name = searchTerm;
            setProfessionalDataFilters(professionalDataFilters);
            setIsDataEmpty(false);
            setProfessionals(newProfessionalsData);
            setpaginatorShow(true);
          } else {
            setIsDataEmpty(true);
            setProfessionals([]);
            setpaginatorShow(false);
          }
        }
      })
      .catch((err) => {
        console.log("api error privacy policy  response", err);
      });
  };

  useEffect(() => { }, [pageNo]);

  const handlePagination = (page) => {
    let professionalSearchFilters = JSON.parse(
      localStorage.getItem("professionalSearchFilters")
    );
    professionalSearchFilters.page = page;
    localStorage.setItem(
      "professionalSearchFilters",
      JSON.stringify(professionalSearchFilters)
    );
    setProfessionalDataFilters(professionalSearchFilters);
    setCurrent(page);
    setPageNo(page);
  };

  useEffect(() => {
    if (directSearchProfession) {
      let categaryID = professionList.id;
      let professionalSearchFilters = JSON.parse(
        localStorage.getItem("professionalSearchFilters")
      );
      professionalSearchFilters.category = categaryID;
      localStorage.setItem(
        "professionalSearchFilters",
        JSON.stringify(professionalSearchFilters)
      );
      setProfessionalDataFilters(professionalSearchFilters);
      getProfessionals();
    }
  }, [directSearchProfession]);
  return (
    <>
      <Header screen="About" />
      <section className="bgSearch pt-32 pb-20">
        <div className="container mx-auto " id="professional-lists">
          <div className="max-w-[900px] mx-auto text-center text-white">
            <h1 className="md:text-5xl lg:text-5xl xl:text-4xl lg:pb-3 text-2xl capitalize">
              All the assets you need, in one place
            </h1>
            <p className="lg:pb-5 pb-3 text-white">
              Express yourself with millions of your dream people in one click
            </p>
          </div>
          <div className="max-w-[800px] mx-auto">
            <input
              value={directSearch == true ? searchKeyWord : searchTerm}
              onChange={(e) => {
                setPageNo(1)
                setCurrent(1)
                setSearchTerm(e.target.value);
                dispatch(setDirectSearch(false));
              }}
              type="text"
              className="w-full form-control text-lg"
              name=""
              id=""
              placeholder="Search"
            />
            {debouncedSearchTerm.length === 0 && (
              <SearchFilter
                professionalDataFilters={professionalDataFilters}
                setProfessionalDataFilters={setProfessionalDataFilters}
              />
            )}
          </div>
        </div>
      </section>
      {isDataEmpty && (
        <section className="no__data text-center">
          <div className="text-center py-10 flex justify-center">
            <NoProductsFound />
          </div>
        </section>
      )}

      {!isDataEmpty && (
        <section className="">
          <div className="container mx-auto py-6 lg:px-20 xl:max-w-[1300px]">
            {debouncedSearchTerm == ""
              ? professionals.map((items, index) => (
                <Professioncard
                  items={items}
                  key={index}
                  showFavouriteIcon
                  getProfessionals={getProfessionals}
                  professionals={professionals}
                />
              ))
              : users.map((user, index) => (
                <UserCard items={user} key={index} />
              ))}
          </div>
        </section>
      )}
      {paginatorShow ? (
        <Pagination
          className="text-center my-3"
          total={pageDetails.total_records}
          current={current}
          responsive={true}
          defaultCurrent={1}
          pageSizeOptions={[]}
          onChange={(e) => {
            handlePagination(e)
            let elem = document.getElementById("professional-lists")
            elem.scrollIntoView({ behavior: "smooth" })
          }}
        />
      ) : (
        ""
      )}
      {userAlreadyLogin.status && <DeactivateModal deactivateStatus={userAlreadyLogin} />}
    </>
  );
};

export default connect((state) => state)(Search);
