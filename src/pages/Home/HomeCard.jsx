
import api from '../../Api/GeneralApi'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setProfessionList, setDirectSearchProfession } from '../../features/redux/professionFilter';
import SkeltonProfesson from '../../components/Skelton/SkeltonProfesson';
import { generateTempArray } from '../../utilities/common-helpers';
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
const Card = () => {
    const [categaryList, setCategaryList] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getCategaries = () => {
        api.getAreaOfDomainForProfessionals().then((data) => {
            setCategaryList(data.data)
        })
    }
    useEffect(() => {
        getCategaries();
    }, [])
    const getProfessionSearch = (data) => {
        dispatch(setDirectSearchProfession(true))
        dispatch(setProfessionList(data))
        navigate("/search")
    }
    return (
        <>
            {categaryList.length > 0 ?
                <Swiper style={{
                    zIndex: 0
                }}
                    spaceBetween={5}
                    breakpoints={
                        {
                            320: {
                                width: 320,
                                slidesPerView: 2,
                            },
                            640: {
                                width: 640,
                                slidesPerView: 3,
                            },
                            768: {
                                width: 768,
                                slidesPerView: 3,
                            }
                        }
                    }
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    speed={2700}
                    modules={[Autoplay]}>
                    {
                        categaryList.map((items, i) =>
                            <SwiperSlide key={i}>
                                <div className="text-center p-3 bg-white shadow-sm rounded-md hover:shadow-md cursor-pointer  border-gray-500" key={i} onClick={() => getProfessionSearch(items)}>
                                    <img src={items.icon_url} alt="" className="mx-auto h-[200px] w-full object-cover" />
                                    <div className='h-10 overflow-hidden'>
                                    <h4 className="pt-4 font-semibold leading-7">{items.category_name}</h4>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
                :
                <div className="lg:flex md:flex sm:flex p-3 bg-white shadow-lg shadow-gray-500/400 mt-4 xl:items-center lg:items-start sm:items-start gap-6">
                    {
                        generateTempArray(4).map((item) => (
                            <SkeltonProfesson />
                        ))
                    }
                </div>
            }
        </>
    )
}

export default Card;