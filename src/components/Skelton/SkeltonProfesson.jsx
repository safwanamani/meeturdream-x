import React from 'react'
import Skeleton from "react-loading-skeleton";
function SkeltonProfesson() {
  return (
    <div className="w-[200px] flex-none relative mx-auto">
      <Skeleton height={160} />
      <p className="text-sm font-bold w-[100px] mx-auto"> <Skeleton /></p>
    </div>
  )
}

export default SkeltonProfesson