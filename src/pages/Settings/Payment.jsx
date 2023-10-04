import React, { useState, useRef, useEffect } from "react";
import { AiFillBank, AiFillDelete, AiFillEdit } from 'react-icons/ai'
import atm from "../../assets/atm.png";
import BankAccountModal from "../Modals/BankAccountModal/BankAccountModal";
import api from "../../Api/GeneralApi";
import SmallCommonModal from "../Modals/SmallCommonModal";
import { Toast } from "primereact/toast";

const Payment = () => {
    const toast = useRef(null)
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState("")
    const [bankAccounts, setBankAccounts] = useState([])
    const [accountId, setAccountId] = useState("")
    const [loading, setLoading] = useState(false)
    const [country, setCountry] = useState("")
    const [bankName, setBankName] = useState("")
    const [ibanNumber, setIbanNumber] = useState("")
    const [branch, setBranch] = useState("")
    const [debitCardNumber, setDebitCardNumber] = useState("")
    const [name, setName] = useState("")
    useEffect(() => {
        api.getBankAccounts().then(({ data }) => {
            if (data.status === true) {
                setBankAccounts(data.accounts_data)
            }
        }).catch(err => {
            console.log(err);
        })
    }, [])
    useEffect(() => {
        if (showModal === false) {
            setAccountId("")
            setCountry("")
            setBankName("")
            setIbanNumber("")
            setBranch("")
            setDebitCardNumber("")
            setName("")
            setLoading(false)
        }
    }, [showModal])
    const submitBankAccount = (payload) => {
        if (accountId && modalType === "edit") {
            payload.id = accountId
        }
        api.addBankAccount(payload).then(({ data }) => {
            if (data.status === true) {
                toast.current.show({ severity: "success", summary: "Success", detail: data.message, life: 3000 })
                setTimeout(() => {
                    api.getBankAccounts().then(({ data }) => {
                        if (data.status === true) {
                            setBankAccounts(data.accounts_data)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                    setShowModal(false)
                    setLoading(false)
                }, 2000)
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: data.message, life: 3000 })
                setTimeout(() => {
                    setLoading(false)
                }, 2000)
            }
        }).catch(err => {
            console.log(err);
            setLoading(false)
        })
    }
    const editBankModal = (data) => {
        setAccountId(data?.id)
        setCountry(data?.country)
        setBankName(data?.bank_name)
        setIbanNumber(data?.iban)
        setBranch(data?.branch)
        setDebitCardNumber(data?.card_number.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim())
        setName(data?.name)
        setShowModal(true)
        setModalType("edit")
    }
    const deleteAccount = () => {
        api.deleteBankAccount({ account_id: accountId }).then(({ data }) => {
            if (data.status === true) {
                toast.current.show({ severity: "success", summary: "Success", detail: data.message, life: 3000 })
                setTimeout(() => {
                    api.getBankAccounts().then(({ data }) => {
                        if (data.status === true) {
                            setBankAccounts(data.accounts_data)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                    setShowModal(false)
                    setModalType("")
                }, 2000)
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: data.message, life: 3000 })
                setTimeout(() => {
                    setShowModal(false)
                    setModalType("")
                }, 2000)
            }
        })
    }
    return (
        <>
            <Toast ref={toast} />
            <div className="box__wrap w-full">
                <h2 className="title">Payment Method</h2>
                <p>Save a payment method for fast and easy lesson payments.
                    Preply uses industry-standard encryption to protect your information.</p>
                {/* Account details */}
                {bankAccounts.map((account, key) => {
                    return (
                        <div className="enter_details mt-3" key={key}>
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="border-2 border-gray-800 rounded-md p-2">
                                        <AiFillBank color="#153D57" size={28} />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-md">{account.bank_name}</h2>
                                        <p className="text-sm ">A/C {account.card_number.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()}</p>
                                        <div className="flex">
                                            <span className="text-[#153D57] text-[14px] cursor-pointer mr-1"
                                                onClick={() => editBankModal(account)}>
                                                <AiFillEdit />
                                            </span>
                                            <span className="text-red-500 text-[14px] cursor-pointer"
                                                onClick={() => {
                                                    setShowModal(true)
                                                    setModalType("remove")
                                                    setAccountId(account.id)
                                                }}>
                                                <AiFillDelete />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-none">
                                    <input type="radio" className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    )
                })}
                {/* Account details */}

                {/* <Link to="">
                    <div className="flex gap-4 my-4 items-center">
                        <div className="border-2 border-dotted border-gray-800 rounded-md p-2">
                            <AiFillCreditCard color="#153D57" size={28} />
                        </div>
                        <p className="text-md font-semibold">Add Credit or Debit Card</p>
                    </div>
                </Link> */}
                <div className="flex gap-4 my-4 items-center">
                    <div className="border-2 border-dotted border-gray-800 rounded-md p-2 cursor-pointer" onClick={() => {
                        setShowModal(true)
                        setModalType("addBank")
                    }
                    }>
                        <AiFillBank color="#153D57" size={28} />
                    </div>
                    <p className="text-md font-semibold cursor-pointer"
                        onClick={() => {
                            setShowModal(true)
                            setModalType("addBank")
                        }}>Add bank account</p>
                </div>
            </div>
            {showModal ? modalType === "addBank" ?
                <BankAccountModal
                    modalTitle="Add Bank Account"
                    setModal={setShowModal}
                    setBankAccounts={setBankAccounts}
                    country={country}
                    setCountry={setCountry}
                    bankName={bankName}
                    setBankName={setBankName}
                    ibanNumber={ibanNumber}
                    setIbanNumber={setIbanNumber}
                    branch={branch}
                    setBranch={setBranch}
                    debitCardNumber={debitCardNumber}
                    setDebitCardNumber={setDebitCardNumber}
                    name={name}
                    setName={setName}
                    loading={loading}
                    setLoading={setLoading}
                    submitFunction={submitBankAccount}
                />
                : modalType === "remove" ?
                    <SmallCommonModal
                        setModal={setShowModal}
                        bodyText="Are you sure you want to delete this?"
                        submitFunction={deleteAccount} />
                    : modalType === "edit" &&
                    <BankAccountModal
                        modalTitle="Edit Bank Account"
                        setModal={setShowModal}
                        setBankAccounts={setBankAccounts}
                        country={country}
                        setCountry={setCountry}
                        bankName={bankName}
                        setBankName={setBankName}
                        ibanNumber={ibanNumber}
                        setIbanNumber={setIbanNumber}
                        branch={branch}
                        setBranch={setBranch}
                        debitCardNumber={debitCardNumber}
                        setDebitCardNumber={setDebitCardNumber}
                        name={name}
                        setName={setName}
                        loading={loading}
                        setLoading={setLoading}
                        submitFunction={submitBankAccount}
                    />
                : null}
        </>
    )
}

export default Payment;