import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import api from '../../Api/GeneralApi';
import moment from 'moment'
import { connect } from 'react-redux';

const SearchFilter = ({ professionalDataFilters, setProfessionalDataFilters, professionFilter: { directSearchProfession } }) => {
  const [selectedCountry, setSelectedCountry,] = useState(null);
  const [selectedProfession, setProfession] = useState(null);
  const [selectedSpecialization, setSpecialization] = useState(null);
  const [selectedAvailibility, setAvailibility] = useState(null);
  const [selectedSort, setSort] = useState(null);
  const [selectedDays, setDays] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [countries, setCountries] = useState(null)
  const [professions, setProfessions] = useState([])
  const [Specialization, setSpecializationn] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const getArea = () => {
    api.getAreaOfDomainForProfessionals().then((data) => {
      if (data.status) {
        let areaData = data.data
        let obj = {
          id: "",
          category_name: "All"
        }
        areaData.unshift(obj)
        setProfessions(areaData.map((obj) => {
          return {
            name: obj.category_name,
            ...obj
          }
        }))
      }
    })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const isFiltersExist = () => {
    return (selectedCountry == [] || selectedProfession != null || selectedSpecialization != null
      || selectedAvailibility != null
      || selectedDays != null || selectedSort != null || selectedTimeSlot != null)
  }
  const clearFilers = () => {
    setSpecializationn([])
    localStorage.setItem('professionalSearchFilters', JSON.stringify({
      'country_id': '',
      'category': '',
      'sub_category': '',
      'sort': '',
      'day': '',
      'time':''
    }))
    setProfessionalDataFilters({
      'country_id': '',
      'category': '',
      'sub_category': '',
      'sort': '',
      'day': '',
      'time':''
    })
    setSelectedCountry([])
    setProfession(null)
    setSpecialization(null)
    setAvailibility(null)
    setSort(null)
    setDays(null)
    setSelectedTimeSlot(null)
  }
  const getSpecializedArea = (categoryId) => {
    api.getSpecializedAreaOfDomainForProfessionals(categoryId).then((data) => {
      if (data.status) {
        let specializedAreaData = data.data
        setSpecializationn(specializedAreaData.map((obj) => {
          return {
            name: obj.sub_category_name,
            ...obj
          }
        }))
      }
    })
      .catch((err) => {
        console.log('err', err)
      })
  }

  function getTimeInCorrectFormat(time) {
    var localTime = moment(time, ["HH:mm:ss"]).format('hh:mm A')
    return localTime;
  }

  const getSpecializedDay = (day) => {
    api.getSpecializedDayForProfessionals({ day: day }).then((data) => {
      if (data.status) {
        
        let specializedTime = data.time_data
        setTimeSlots(specializedTime.map((obj) => {
          return {
            name: getTimeInCorrectFormat(obj?.start_time) + "-" + getTimeInCorrectFormat(obj?.end_time),
            ...obj
          }
        }))

      }
    })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const getCountryListData = () => {
    api.getCountryList().then((data) => {
      let countriesData = data.data
      setCountries(countriesData.map((countryObj) => {
        return {
          name: countryObj.country_name,
          ...countryObj
        }
      }))
    })
      .catch((err) => {
        console.log(err)
      })
  }
  // country
  useEffect(() => {
    if (directSearchProfession) {
      let professionalSearchFilters = JSON.parse(localStorage.getItem("professionalSearchFilters"))
      setProfessionalDataFilters(professionalSearchFilters)
      getArea()
      getCountryListData()
    } else {
      localStorage.setItem('professionalSearchFilters', JSON.stringify({
        'country_id': '',
        'category': '',
        'sub_category': '',
        'sort': '',
        'day': '',
        'time':''
      }))

      getArea()
      getCountryListData()
    }

  }, [directSearchProfession])
  const onCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    let selectedCountries = e.target.value
    let arrayOfIds = selectedCountries.map((country) => {
      return country.id
    })
    const proDetailFilters = JSON.parse(localStorage.getItem('professionalSearchFilters'))
    proDetailFilters['country_id'] = arrayOfIds
    localStorage.setItem('professionalSearchFilters', JSON.stringify(proDetailFilters))
    proDetailFilters.page = 1
    setProfessionalDataFilters(proDetailFilters)
  }
  // country

  const onProfessionChange = (e) => {
    setProfession(e.value);
    getSpecializedArea(e.value.id)
    const proDetailFilters = JSON.parse(localStorage.getItem('professionalSearchFilters'))
    proDetailFilters.category = e.value.id
    proDetailFilters.sub_category = ""
    localStorage.setItem('professionalSearchFilters', JSON.stringify(proDetailFilters))
    proDetailFilters.page = 1
    setProfessionalDataFilters(proDetailFilters)
  }
  // Specialization

  const onSpecializationChange = (e) => {
    setSpecialization(e.value);
    let selectedProfessors = [];
    selectedProfessors.push(e.value.id)
    const proDetailFilters = JSON.parse(localStorage.getItem('professionalSearchFilters'))
    proDetailFilters['sub_category'] = selectedProfessors
    localStorage.setItem('professionalSearchFilters', JSON.stringify(proDetailFilters))
    proDetailFilters.page = 1
    setProfessionalDataFilters(proDetailFilters)
  }

  const onAvailabilityChange = (e) => {
    setAvailibility(e.value);
  }
  const Availibility = [
    { name: 'Doctor' },
    { name: 'Engineer' },
    { name: 'Accountant' },
    { name: 'Mentor' },
    { name: 'Engineer' }
  ];


  const onSortChange = (e) => {
    setSort(e.value);
    const proDetailFilters = JSON.parse(localStorage.getItem('professionalSearchFilters'))
    proDetailFilters.sort = e.value.id
    localStorage.setItem('professionalSearchFilters', JSON.stringify(proDetailFilters))
    setProfessionalDataFilters(proDetailFilters)
  }
  const Sort = [
    { name: 'Lowest Price', id: 'asc' },
    { name: 'Highest Price', id: 'desc' },
    { name: 'Review', id: 'review' }
  ];

  const onDaysChange = (e) => {
    setDays(e.value);
    getSpecializedDay(e.value.name)
    const proDetailFilters = JSON.parse(localStorage.getItem('professionalSearchFilters'))
    proDetailFilters.day = e.value.name
    localStorage.setItem('professionalSearchFilters', JSON.stringify(proDetailFilters))
    setProfessionalDataFilters(proDetailFilters)
  }

  const onTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.value)
    const proDetailFilters = JSON.parse(localStorage.getItem('professionalSearchFilters'))
    let newTimes = []
    newTimes.push(e.value.id)
    proDetailFilters.time = newTimes
    localStorage.setItem('professionalSearchFilters', JSON.stringify(proDetailFilters))
    proDetailFilters.page = 1
    setProfessionalDataFilters(proDetailFilters)
  }
  const Days = [
    { name: 'Monday' },
    { name: 'Tuesday' },
    { name: 'Wednesday' },
    { name: 'Thursday' },
    { name: 'Friday' },
    { name: 'Saturday' },
    { name: 'Sunday' }
  ];

 
  return (
    <div className="filter lg:flex  md:gap-4 gap-4 justify-center mt-3  text-center">
      <MultiSelect value={selectedCountry} options={countries} onChange={(e) => onCountryChange(e)} optionLabel="name" placeholder="Country" display="chip" />
      <Dropdown className='m-2 lg:m-0'
        value={selectedProfession}
        options={professions}
        onChange={onProfessionChange}
        optionLabel="name"
        placeholder="Profession"
      />
      <Dropdown className='m-2 lg:m-0'
        value={selectedSpecialization}
        options={Specialization}
        onChange={onSpecializationChange}
        optionLabel="name"
        placeholder="Specialization"
      />
      <Dropdown className='m-2 lg:m-0'
        value={selectedDays}
        options={Days}
        onChange={onDaysChange}
        optionLabel="name"
        placeholder="Days"
      />
      <Dropdown className='m-2 lg:m-0'
        value={selectedTimeSlot}
        options={timeSlots}
        onChange={onTimeSlotChange}
        optionLabel="name"
        placeholder="Times Available"
      />
      <Dropdown className='m-2 lg:m-0'
        value={selectedSort}
        options={Sort}
        onChange={onSortChange}
        optionLabel="name"
        placeholder="Sort By"
      />
      <div className='text-[14px] m-2 lg:m-0 p-dropdown text-white bg-[#1e4763] py-2 px-4 cursor-pointer relative flex items-center' onClick={() => clearFilers()}>Clear
        <AiOutlineClose className='mt-1' size={12} />
        {isFiltersExist() && <span className="flex h-3 w-3 absolute top-[-4px] right-[-4px]">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5858] "></span>
        </span>}
      </div>
    </div>
  )
}
export default connect((state) => state)(SearchFilter);
