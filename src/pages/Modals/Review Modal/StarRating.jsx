import React,{useState} from 'react'

const StarRating = ({rating,setRating}) => {
  const [hover, setHover] = useState(0);
  return (

    <div className="flex justify-center items-center px-5 py-4">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (

          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "bg-transparent border-none outline-none cursor-pointer text-yellow-500" : "bg-transparent border-none outline-none cursor-pointer text-slate-500"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star text-5xl">&#9733;</span>
          </button>
        );
      })}
      
    </div>
  );
};

export default StarRating