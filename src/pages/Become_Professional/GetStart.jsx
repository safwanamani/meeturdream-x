import React from 'react'
import image1 from "../../assets/instructor-1x-v3 1.png"
import bg1 from "../../assets/Rectangle 2179.png"
import image3 from "../../assets/instructor-1x-v3 1 (1).png"
import Qustion from '../../components/Qustion'
import { Link } from 'react-router-dom'

const GetStart = () => {
    return (
        <>
           
                {/* get started*/}
                <section className="container mx-auto">
                    <div className="lg:flex md:flex items-center md:gap-4">
                        <div className="lg:w-1/2 md:w-1/2">
                            <div className="text-center justify-center flex">
                                <img src={image1} alt="" className="lg:max-w-3xl" />
                            </div>
                        </div>
                        <div className="lg:w-1/2 md:w-1/2">
                            <div className="lg:pr-32 lg:pt-10 lg:text-left md:text-left sm:text-center text-center sm:mt-5 mt-5">
                                <h1 className="head_1 mb-3 capitalize">Session slots of your choice</h1>
                                <p className="mb-6">Tired of working 9-5? With MEETURDREAM work at your time of convenience.</p>
                                <Link to="/profession-signup"><button className="btn_primary rounded-full">Get Started</button></Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* image*/}
                
            <section className="lg:py-28 py-10">
                <img src={bg1} alt="" className="w-full " />
            </section>

                {/* <div className='lg:py-28 py-10'>
                    <div className='background'></div>
                </div> */}
     

            {/* get started-2*/}
            <section className="container mx-auto">
                <div className="lg:flex md:flex items-center md:gap-4">
                    <div className="lg:w-1/2 md:w-1/2">
                        <div className="text-center justify-center flex">
                            <img src={image3} alt="" className="lg:max-w-3xl" />
                        </div>
                    </div>
                    <div className="lg:w-1/2 md:w-1/2">
                        <div className="lg:pr-32 lg:pt-10 lg:text-left md:text-left sm:text-center text-center sm:mt-5 mt-5">
                            <h1 className="head_1 mb-3">Fee of your choice</h1>
                            <p className="mb-6">Earn by charging a fee of your choice with admin approval.</p>
                            <Link to="/profession-signup"><button className="btn_primary rounded-full">Get Started</button></Link>
                        </div>
                    </div>
                </div>
            </section>
            <Qustion />
        </>
    )
}

export default GetStart