import React from "react";

const UserCardData = ({items}) => ( 

    <>
    { items.user_profile_detail===null?
    <div className="block md:flex items-center gap-4">
    <div className="w-[100px] h-[100px] flex-none relative">
        <img src="/assets/NoneProfile.png" className="img-responsive rounded-sm" alt=""
        onError={(e) => {
            e.target.src = "/assets/NoneProfile.png"
        }} />
    </div>
    <div className='lg:flex md:flex lg:items-center sm:items-start lg:gap-5 lg:justify-between w-full'>
        <h2 className='text-xl font-bold inline-flex items-center'>{items.name}</h2>
    </div>
    </div>
    :
<div className="block md:flex items-center gap-4">
<div className="w-[100px] h-[100px] flex-none relative">
    <img src={items.user_profile_detail.image_url} className="img-responsive rounded-sm" alt=""
    onError={(e) => {
        e.target.src = "/assets/NoneProfile.png"
    }} />
</div>
<div className='lg:flex md:flex lg:items-center sm:items-start lg:gap-5 lg:justify-between w-full'>
    <h2 className='text-xl font-bold inline-flex items-center'>{items.name}</h2>
</div>
</div>
    }
    
    </>
  
)

export default UserCardData;