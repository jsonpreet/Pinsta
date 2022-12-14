import React from 'react'

export const CardShimmer = () => {
  return (
    <div className="w-full rounded-xl">
      <div className="flex flex-col space-x-2 animate-pulse">
        <div className="bg-gray-300 rounded-xl aspect-w-16 aspect-h-9 dark:bg-gray-700" />
      </div>
    </div>
  )
}

const PinCardShimmer = ({height} : { height: number}) => {
  return (
      <div style={{ height: `${height}px`}} className={`mb-4 block bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse`}/>
  )
}

export default PinCardShimmer