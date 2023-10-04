import React, { useEffect } from 'react'
import { BsCheckCircleFill } from "react-icons/bs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Dropdown } from 'primereact/dropdown';
function LanguageDropdowns({ index, languageLevel, setLanguageLevel, obj, languagesList, setLanguagesList, removeLanguage, dropErrorStatus, setDropErrorStatus, defaultLanguages }) {
  useEffect(() => { }, [languageLevel])
  const levelSort = ['Limited', 'Proficient', 'Native']
  const setLanguageSpokenAndLevel = (type, value) => {
    if (type === 'languageSpoken') {
      obj.languageSpoken = value.name
      defaultLanguages.map((langobj) => {
        if (langobj.language === value.name) {
          return obj.langObject = langobj
        }
      })
    }
    else if (type === 'level') {
      obj.level = value.name
    }
    setLanguageLevel(languageLevel.map((item, i) => {
      if (index === i) {
        return { ...item, obj };
      }
      return item;
    }))
  }
  return (
    <>
      <div className="md:flex gap-4">
        <div className="md:w-1/2">
          <h2 className='font-semibold mb-3'>Language spoken <span class="text-red-500">*</span></h2>
          <Dropdown className='w-full mb-2 md:mb-0'
            value={{ 'name': obj.languageSpoken }}
            options={
              languagesList.map((langObj) => {
                return { 'name': langObj }
              })
            }
            onChange={(e) => {
              setLanguageSpokenAndLevel('languageSpoken', e.value)
              setLanguagesList(languagesList.filter(lang => lang !== e.value.name))
              setDropErrorStatus(prevValue => ({
                ...prevValue,
                languageSpokenStatus: false
              }))
            }
            }
            filter
            optionLabel="name"
            placeholder="Select a language"
          />
          {dropErrorStatus.languageSpokenStatus === true && dropErrorStatus.dropId === index ? <p className='text-red-500 text-sm'>Please select a language</p> : ""}
        </div>
        <div className="md:w-1/2 ">
          <h2 className='font-semibold mb-3'>Level <span class="text-red-500">*</span></h2>
          <Dropdown className='w-full'
            value={{ 'name': obj.level }}
            options={levelSort.map((levelObj) => { return { 'name': levelObj } })}
            onChange={(e) => {
              setLanguageSpokenAndLevel('level', e.value)
              setDropErrorStatus(prevValue => ({
                ...prevValue,
                levelStatus: false
              }))
            }}
            filter
            optionLabel="name"
            placeholder="Select a level"
          />
          {dropErrorStatus.levelStatus === true && dropErrorStatus.dropId === index ? <p className='text-red-500 text-sm'>Please select a level</p> : ""}
        </div>
      </div>
      {obj.languageSpoken && obj.level ? (
        <div className="pt-4">
          <p className="font-bold text-md pb-3 justify-between  flex items-center gap-2">
            <span className='flex items-center gap-2'>
              <BsCheckCircleFill color="green" /> {obj.languageSpoken}
              <span className="bg-green-200 text-sm text-green-800 font-medium px-4 py-1 rounded-full ml-2">{obj.level}</span>
            </span>
            {languageLevel.length > 1 ? (
              <span
                className="round_border cursor-pointer"
                onClick={() => removeLanguage(obj.languageSpoken)}
              >
                <RiDeleteBin5Fill />
              </span>
            ) : ""}
          </p>
        </div>
      ) : (
        <p className="font-bold text-md justify-end flex pt-3">
          {languageLevel.length > 1 ? (
            <span
              className="round_border cursor-pointer"
              onClick={() => removeLanguage(obj.languageSpoken)}
            >
              <RiDeleteBin5Fill />
            </span>
          ) : ""}
        </p>
      )}
    </>)
}

export default LanguageDropdowns