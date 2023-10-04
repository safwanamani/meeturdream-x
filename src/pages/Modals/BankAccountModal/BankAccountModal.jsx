import React, { useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "./BankAccountModal.css";
import api from "../../../Api/GeneralApi";
const BankAccountModal = ({ setModal, submitFunction, modalTitle, country, setCountry, bankName, setBankName, ibanNumber, setIbanNumber, branch, setBranch, debitCardNumber, setDebitCardNumber, name, setName, loading, setLoading }) => {
  const [countryError, setCountryError] = useState(false)
  const [bankNameError, setBankNameError] = useState(false)
  const [ibanNumberError, setIbanNumberError] = useState(false)
  const [ibanNumberStatus, setIbanNumberStatus] = useState({
    status: false,
    message: ""
  })
  const [branchError, setBranchError] = useState(false)
  const [debitCardNumberError, setDebitCardNumberError] = useState({
    status: false,
    message: ""
  })
  const [nameError, setNameError] = useState(false)
  const checkDebitCardNumber = (value) => {
    value = value.replace(/ /g, '')
    if (value) {
      if (value.length !== 16) {
        setDebitCardNumberError({
          status: true,
          message: "Debit card number is not valid"
        })
      } else {
        setDebitCardNumberError({
          status: false,
          message: ""
        })
      }
    } else {
      setDebitCardNumberError({
        status: true,
        message: "Debit card number is required"
      })
    }
  }
  const addBankAccount = () => {
    if (!country) {
      setCountryError(true)
    }
    if (!bankName) {
      setBankNameError(true)
    }
    if (!ibanNumber) {
      setIbanNumberStatus({
        status: false,
        message: ""
      })
      setIbanNumberError(true)
    } else {
      validateIBAN()
    }
    if (!branch) {
      setBranchError(true)
    }
    if (!debitCardNumber) {
      setDebitCardNumberError(true)
    }
    if (!debitCardNumber) {
      setDebitCardNumberError({
        status: true,
        message: "Debit card number is required"
      })
    }
    if (!name) {
      setNameError(true)
    }
    if (country && bankName && ibanNumber && branch && debitCardNumber && name && ibanNumberStatus.status===true) {
      setLoading(true)
      setCountryError(false)
      setBankNameError(false)
      setIbanNumberError(false)
      setBranchError(false)
      setDebitCardNumberError({
        status: false,
        message: ""
      })
      setNameError(false)
      let payload = {
        country: country,
        bank_name: bankName,
        iban: ibanNumber,
        branch: branch,
        card_number: debitCardNumber.replace(/ /g, ''),
        name: name
      }
      submitFunction(payload)
    }
  }
  const validateIBAN = () => {
    if (!ibanNumber) {
      setIbanNumberError(true)
    } else {
      api.validateIBAN(({iban: ibanNumber})).then(({data}) => {
        if (data.status == true) {
          setIbanNumberError(false)
          setIbanNumberStatus({
            status: true,
            message: "Validation success!!"
          })
        } else {
          setIbanNumberStatus({
            status: false,
            message: "Validation failed!!"
          })
        }
      })
    }
  }
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto min-w-[300px] md:min-w-[600px]">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">{modalTitle}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setModal(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <>
                <div className="md:flex gap-4">
                  <div className="form-group md:w-1/2">
                    <label className="font-semibold">Country name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      defaultValue={country}
                      className="form-control-stroke"
                      placeholder="Enter country name"
                      onChange={(e) => {
                        setCountry(e.target.value)
                        if (e.target.value) {
                          setCountryError(false)
                        } else {
                          setCountryError(true)
                        }
                      }}
                    />
                    {countryError ? (
                      <p className="text-red-500 text-sm">Country name is required</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-group md:w-1/2">
                    <label className="font-semibold">Bank name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      defaultValue={bankName}
                      className="form-control-stroke"
                      placeholder="Enter bank name"
                      onChange={(e) => {
                        setBankName(e.target.value)
                        if (e.target.value) {
                          setBankNameError(false)
                        } else {
                          setBankNameError(true)
                        }
                      }}
                    />
                    {bankNameError ? (
                      <p className="text-red-500 text-sm">Bank name is required</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="form-group mt-2 w-full">
                  <label className="font-semibold">IBAN number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={ibanNumber}
                      className="form-control-stroke"
                      placeholder="Enter IBAN number"
                      onChange={(e) => {
                        setIbanNumber(e.target.value)
                        if (e.target.value) {
                          setIbanNumberError(false)
                        } else {
                          setIbanNumberError(true)
                          setIbanNumberStatus({
                            status: false,
                            message: ""
                          })
                        }
                      }}
                    />
                    <button className='absolute right-2 bottom-2 bg-green-500 text-white font-medium rounded-lg text-base px-4 py-2 border-1 border' onClick={(e) => {
                      e.preventDefault()
                      validateIBAN()
                      // checkPromocode()
                    }}>
                      Validate
                    </button>
                  </div>
                  {ibanNumberError ? (
                    <p className="text-red-500 text-sm">IBAN number is required</p>
                  ) : (
                    ""
                  )}
                  {ibanNumberError === false && ibanNumberStatus.status ? (
                    <p className="text-green-500 text-sm flex">{ibanNumberStatus.message}</p>
                  ) : (
                    <p className="text-red-500 text-sm">{ibanNumberStatus.message}</p>
                  )}
                </div>
                <div className="form-group mt-2 w-full">
                  <label className="font-semibold">Branch name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    defaultValue={branch}
                    className="form-control-stroke"
                    placeholder="Enter branch name"
                    onChange={(e) => {
                      setBranch(e.target.value)
                      if (e.target.value) {
                        setBranchError(false)
                      } else {
                        setBranchError(true)
                      }
                    }}
                  />
                  {branchError ? (
                    <p className="text-red-500 text-sm">Branch name is required</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group mt-2 w-full">
                  <label className="font-semibold">Debit card number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    defaultValue={debitCardNumber}
                    className="form-control-stroke"
                    placeholder="Enter debit card number"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
                      setDebitCardNumber(e.target.value)
                      checkDebitCardNumber(e.target.value)
                    }}
                  />
                  {debitCardNumberError.status ? (
                    <p className="text-red-500 text-sm">
                      {debitCardNumberError.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group mt-2 w-full">
                  <label className="font-semibold">Name as per account <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    defaultValue={name}
                    className="form-control-stroke"
                    placeholder="Enter name as per account"
                    onChange={(e) => {
                      setName(e.target.value)
                      if (e.target.value) {
                        setNameError(false)
                      } else {
                        setNameError(true)
                      }
                    }}
                  />
                  {nameError ? (
                    <p className="text-red-500 text-sm">
                      Name is required
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </>
            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                className={`bg_primary text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${loading ? "" : "uppercase"}`}
                type="button"
                onClick={addBankAccount}
              >
                {loading ?
                  <div className="flex justify-center">
                    <div className="my-auto pt-[2px]">
                      <LoadingSpinner />
                    </div>
                    <span>Processing...</span>
                  </div>
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
export default BankAccountModal;