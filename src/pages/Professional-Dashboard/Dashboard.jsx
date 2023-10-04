import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import Header from "../../components/Header";
import ProfessionAttentCard from "./ProfessionAttend";
import profile from '../../assets/card.png';

const Dashboard = () => {
    return (
        <>
            <Header screen="" />
            <section className="bg_gray py-10">
                <div className="container mx-auto xl:px-24">
                    <h2 className="text-xl font-bold pb-5 ">Dashboard</h2>
                    <div className="wrap lg:flex md:flex lg:gap-4 gap-2">
                        <div className=" lg:w-4/6 md:w-4/6">
                            <div className="grid lg:grid-cols-3 lg:gap-4 gap-2">
                                <div className="bg-white lg:p-6 p-3">
                                    <h2 className="text-lg lg:text-2xl font-bold lg:mb-5">250 AED</h2>
                                    <p className="text-sm">Total Amount</p>
                                </div>
                                <div className="bg-white lg:p-6 p-3">
                                    <h2 className="text-lg lg:text-2xl font-bold lg:mb-5">2</h2>
                                    <p>Totol Sessions completed</p>
                                </div>
                                <div className="bg-white lg:p-6 p-3">
                                    <h2 className="text-lg lg:text-2xl font-bold lg:mb-5">4</h2>
                                    <p>Totol Sessions Cancelled</p>
                                </div>
                            </div>

                            <h2 className="text-lg font-bold py-4">Shedules</h2>
                            <div>
                                <ProfessionAttentCard />
                            </div>
                        </div>

                        <div className="lg:w-2/6 md:w-2/6">
                            <div className="bg-white lg:p-5 p-3">
                                <div className="text-center lg:py-8">
                                    <img src={profile} width="120" className="rounded-full mx-auto" alt="" />
                                    <h2 className="text-xl font-bold mt-4">Alessa P</h2>
                                    <h6 className="text-md font-semibold">Doctor</h6>
                                    <p>Dental Specialist</p>
                                </div>
                            </div>
                            <button className="bg_primary w-full flex justify-between rounded-sm text-white text-md py-3 px-3 mb-2 items-center mt-3">
                                Edit Profile
                                <span><AiOutlineArrowRight size={20} className="" /></span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Dashboard;