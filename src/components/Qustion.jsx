import { React, useEffect, useState } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import api from "../Api/GeneralApi";
import HTMLRenderer from "react-html-renderer";

const Qustion = () => {
  const [Faq, setFaq] = useState([]);
  useEffect(() => {
      getFaq();
  },[]);
  const getFaq = () => {
      api
          .getFaq()
          .then((result) => {
            setFaq(result.data.data.faq);
          })
          .catch((err) => {
              console.log("api error Faq response", err);
          });
  };
  return (

    <section className='head p-5 md:p-20 fag '>
      <div className='container mx-auto'>
        <div>
          <h1 className='head_1 mb-2'>Frequently asked questions ?</h1>
          <p className="">If you have any further question please contact  us</p>
        </div>

        <div className='mt-6 faq__accordion'>
          <Accordion className='md:grid md:grid-cols-2 gap-4'>

            {Faq.map((items,i) => (
              <AccordionTab header={items.question} className='' key={i}>
                {/* <p>{items.answer}</p> */}
                <HTMLRenderer html={items.answer} />
              </AccordionTab>

            ))}

          </Accordion>

        </div>


        {/* <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-7 '>
          {Faq.map(items => (
            <div className='flex items-center justify-between border-2 border-black/50 rounded-lg p-4 md:p-6'>{items.title}
              <BsPlusLg size={15} className="cursor-pointer" />
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}

export default Qustion