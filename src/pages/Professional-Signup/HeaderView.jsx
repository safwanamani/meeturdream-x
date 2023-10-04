import React from 'react'
function HeaderView({professionalSignUpViewIndex}) {
    const doShowWhiteBackground=(indexNumber)=>{
        if(indexNumber==professionalSignUpViewIndex){
          return 'flex justify-center items-center text-[14px] font-bold bg-white rounded-full w-[30px] h-[30px]  text-[#153D57] mb-1'
        }
        else{
          return 'flex justify-center items-center text-[14px] font-bold border rounded-full w-[30px] h-[30px]  text-[#d8d8d8] mb-1'
        }
      }
  return (
    <div className='hidden md:block'>
    <div className='flex items-start bg-[#153D57] text-white justify-center xl:gap-4 lg:gap-2 pt-5 pb-3'>
          <div className='flex flex-col items-center'>
            <div className={doShowWhiteBackground(0)}> 1</div>
            <span className=' text-[#EAEAEA] text-[12px]'>Profile</span>
          </div>
          <div className='w-28 h-px bg-[#DADADA] mt-4'></div>
          <div className='flex flex-col items-center'>
            <div className={doShowWhiteBackground(1)}> 2</div>
            <span className=' text-[#EAEAEA] text-[12px]'>Education</span>
          </div>
          <div className='w-28 h-px bg-[#DADADA] mt-4'></div>

          <div className='flex flex-col items-center'>
            <div className={doShowWhiteBackground(2)}> 3</div>
            <span className=' text-[#EAEAEA] text-[12px]'>Certification</span>
          </div>
          <div className='w-28 h-px bg-[#DADADA] mt-4'></div>
          <div className='flex flex-col items-center'>
            <div className={doShowWhiteBackground(3)}> 4</div>
            <span className=' text-[#EAEAEA] text-[12px]'>Description</span>
          </div>
          <div className='w-28 h-px bg-[#DADADA] mt-4'></div>
          <div className='flex flex-col items-center justify-center text-center'>
            <div className={doShowWhiteBackground(4)}> 5</div>
            <span className=' text-[#EAEAEA] text-[12px]'>Pricing & <br></br> Availability</span>
          </div>
          <div className='w-28 h-px bg-[#DADADA] mt-4'></div>
          <div className='flex flex-col items-center'>
            <div className={doShowWhiteBackground(5)}> 6</div>
            <span className=' text-[#EAEAEA] text-[12px]'>Refer</span>
          </div>
        </div>
        </div>
  )
}

export default HeaderView