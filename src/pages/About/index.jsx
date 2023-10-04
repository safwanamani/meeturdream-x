import { React, useState, useEffect } from "react";
import Header from "../../components/Header";
import img1 from "../../assets/about1.png";
import img5 from "../../assets/about2.png";
import img2 from "../../assets/about4.png";
import img6 from "../../assets/about6.png";
import img7 from "../../assets/about7.jpg";
import passion from "../../assets/Passion.jpg";
import humble from "../../assets/Humble.jpg";
import integrity from "../../assets/Integrity.jpg";
import unique from "../../assets/Unique.jpg";
import api from "../../Api/GeneralApi";
import TestmonialCard from "./TestmonialCard";

const AboutUs = () => {
  const [teams, setTeams] = useState([]);
  const [teamDesc, setTeamDesc] = useState([]);
  useEffect(() => {
    var scrollTop = function () {
      window.scrollTo(0, 0);
    };
    scrollTop()
    getTeams();
  }, []);
  const getTeams = () => {
    api
      .getLeadershipTeams()
      .then((result) => {
        setTeams(result.data.data.team_list);
        setTeamDesc(result.data.data.team_description);
      })
      .catch((err) => {
        console.log("api error privacy policy  response", err);
      });
  };

  return (
    <>
      <Header screen="About" />
      <section className="lg:pt-28 pt-20 about__page relative">
        <div className="container mx-auto px-2 lg:px-0">
          <div className="text-center max-w-5xl mx-auto text-white pb-14 md:py-0">
            <p className="mb-2">About Us</p>
            <h1 className="xl:text-6xl lg:text-6xl md:text-6xl sm:text-5xl text-3xl lg:px-32 md:px-32 pb-5 sm:pb-8">
              We love to see you meet your dream.
            </h1>
            <p className="max-w-2xl mx-auto text-white">
              There is nothing more satisfying than watching people make their dreams come true. Whether it be meeting your favorite actor or learning from your favorite chef,
              we love to see you fulfill your dreams with our safe and secure platform.
            </p>
          </div>

          <div className="images pt-10 lg:w-3/4 mx-auto">
            <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-4 gap-4">
              <div className="">
                <img src={img1} className="w-full object-cover rounded-3xl mb-5" alt="" />
                <img src={img5} className="w-full rounded-3xl" alt="" />
              </div>
              <div className="">
                <img src={img2} className="img-responsive object-cover rounded-2xl" alt="" />
              </div>
              <div className="hidden lg:block">
                <img src={img6} className="w-full mb-5 rounded-3xl" alt="" />
                <img src={img7} className="w-full rounded-3xl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:pt-28 pt-10 sm:pb-0 pb-14">
        <div className="container mx-auto px-2 lg:px-0">
          <div className="lg:max-w-2xl md:max-w-xl mx-auto">
            <h1 className="head_1 mb-2"> {teamDesc.leadership_heading}</h1>

            <p>
              {teamDesc.leadership_description}
            </p>
          </div>

          <div className="lg:py-28 md:py-24 sm:py-24 py-10 pb-10">
            <div className="grid lg:grid-cols-3 max-w-8xl mx-auto sm:grid-cols-3 gap-24 sm:gap-10 lg:px-20">
              {teams.slice(0, 3).map((items, key) => (
                <div key={key} className="h-[300px]">
                  <img
                    src={items.image}
                    alt=""
                    className="img-responsive object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = "/assets/NoneProfile.png"
                    }}
                  />
                  <div className="pt-5">
                    <h6 className="text-xl font-semibold pb-2">{items.name}</h6>
                    <p>{items.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg_primary">
        <div className="container mx-auto px-2 lg:px-0">
          <div className="sm:py-24 py-10">
            <div className="flex pb-5">
              <h1 className="head_1 text-white">Testmonials</h1>
            </div>
            <TestmonialCard />
          </div>
        </div>
      </section>

      <section className="lg:pt-28 pt-10">
        <div className="container mx-auto px-2 lg:px-0">
          <div className="max-w-4xl mx-auto">
            <div>
              <h6 className="primary uppercase font-semibold mb-2">What we value</h6>
              <h1 className="head_1 mb-2">Things in we believe</h1>
              <p className="text-gray-500">
                We believe in creating a safe and supportive environment, encouraging open communication and collaboration. We believe that by working together and sharing our experiences, we can empower each other to overcome challenges and make a positive impact. Ultimately, It is our shared beliefs and values which makes us stronger.
              </p>
            </div>
            <div className="lg:py-20 py-10">
              <div className="sm:flex items-center lg:gap-6 gap-4 mb-8 text-center md:text-left">
                <div className=" max-w-[200px] max-h-[200px] flex-none mx-auto">
                  <img src={passion} alt="" className="w-full h-full rounded-lg" />

                </div>
                <div>
                  <h3 className="lg:text-2xl text-xl md:text-2xl font-semibold mb-2">
                    Passion
                  </h3>
                  <p>
                    We believe that our passion drives us to go the extra mile, pour our whole heart and soul into pursuing our dreams and achieve the impossible.
                  </p>
                </div>
              </div>
              <div className="sm:flex items-center lg:gap-6 gap-4 mb-8  text-center md:text-left">
                <div className="max-w-[200px] max-h-[200px] flex-none mx-auto">
                  <img src={humble} alt="" className="w-full h-full rounded-lg object-cover" />

                </div>                <div>
                  <h3 className="lg:text-2xl text-xl md:text-2xl font-semibold mb-2">
                    Humble
                  </h3>
                  <p>
                    We believe humility is a virtue. It keeps us humble and open to learning, allowing us to recognize the value of all mankind.
                  </p>
                </div>
              </div>
              <div className="sm:flex items-center lg:gap-6 gap-4 mb-8  text-center md:text-left">
                <div className="max-w-[200px] max-h-[200px] flex-none mx-auto">
                  <img src={integrity} alt="" className="w-full h-full rounded-lg" />

                </div>
                <div>
                  <h3 className="lg:text-2xl text-xl md:text-2xl font-semibold mb-2">
                    Integrity
                  </h3>
                  <p>
                    We believe in acting with integrity. To be honest and ethical in our decisions and strive to earn and maintain people's trust. We accept responsibility for our actions and strive to do the right thing, even when it's difficult.
                  </p>
                </div>
              </div>
              <div className="sm:flex items-center lg:gap-6 gap-4 mb-8  text-center md:text-left">
                <div className=" max-w-[200px] max-h-[200px] flex-none mx-auto">
                  <img src={unique} alt="" className="w-full h-full rounded-lg" />
                </div>
                <div>
                  <h3 className="lg:text-2xl text-xl md:text-2xl font-semibold mb-2">
                    Unique
                  </h3>
                  <p>
                    We believe in uniqueness. To embrace innovative solutions, creativity, and our differences. We believe that daring to be different is what sets us apart and helps us reach our fullest potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
