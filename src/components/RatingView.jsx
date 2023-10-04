import star from '../../src/assets/star_.svg'
import halfStar from '../../src/assets/star-half.svg'
import { IoIosStar } from 'react-icons/io';
function RatingView({rating}) {
    let decimalPoint=rating>Math.round(rating)?rating%Math.round(rating):Math.round(rating)%rating
    const renderFullStaricons=()=>{
        let number=rating
            return(
                [...Array(Math.trunc(number))].map((i,ind)=>
                <span className='' key={ind}><img src={star} width="15" alt="" /></span>
                )    
            )
    }
    const noneStaricons=()=>{
      const totalStart=5
      const currentStar=totalStart-Math.ceil(rating)
            return(
                [...Array(Math.round(currentStar))].map((i,ind)=>
                <span className='' key={ind}><IoIosStar className='text-gray-400'/></span>
                )
                
            )
    }
    const Staricons=()=>{
            return(
                [...Array(Math.round(5))].map((i,ind)=>
                <span className='' key={ind}><IoIosStar className='text-gray-400'/></span>
                )
                
            )
    }
  return (
    <>
        {rating&&renderFullStaricons()  }
        {rating&&decimalPoint==0.5?<span className=''><img src={halfStar} width="15" alt="" /></span>:''}
        {rating&&noneStaricons()}

    </>
  )
}

export default RatingView