import { React, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import api from "../../Api/GeneralApi";

const TestmonialCard = () => {

  const [testimonials, setTestimonial] = useState([]);
  useEffect(() => {
    getTestimonial();
  },[]);
  const getTestimonial = () => {
      api
          .getTestimonials()
          .then((result) => {
            setTestimonial(result.data.data.testinomials);
          })
          .catch((err) => {
              console.log("api error Faq response", err);
          });
  };

  return (
    <>
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        breakpoints={{
          // when window width is >= 640px
          320: {
            slidesPerView: 1,
          },
          // when window width is >= 768px
          567: {
            slidesPerView: 2,
          },
          991: {
            slidesPerView: 3,
          },
        }}
      >

        {testimonials.map(items => (
          <SwiperSlide >
            <div className="bg-white p-10 rounded-sm">
              <p className="text-lg">{items.description}</p>
              <div className="pt-5">
                <div className="flex gap-4 items-center">
                  <img
                    src={items.image}
                  
                    className="rounded-full h-[60px] w-[60px] object-cover"
                    alt=""
                  />
                  <div>
                    <h2 className="font-bold text-lg capitalize">{items.name}</h2>
                    <p>{items.role_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>
    </>
  );
};

export default TestmonialCard;
