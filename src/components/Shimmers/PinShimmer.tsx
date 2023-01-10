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

const PinShimmer = () => {
  return (
    <>
      <div className='max-w-[1024px] md:shadow-[rgba(13,_38,_76,_0.10)_0px_9px_15px] bg-white md:rounded-3xl mx-auto md:mb-0 mb-4'>
        <div className='flex flex-col lg:flex-row overflow-visible'>
          <div className='relative flex-none w-full lg:w-2/4'>
            <div className='w-full h-full relative md:min-h-[500px] flex flex-col items-center rounded-xl p-4 bg-gray-300 dark:bg-gray-700 ranimate-pulse' />
          </div>
          <div className='content flex flex-col items-start w-full lg:w-2/4 py-6 px-6'>
            <div className='w-full top-0 flex flex-col md:flex-row justify-between items-center mb-6 relative z-10'>
              <div className='flex flex-row space-x-4 items-center justify-center'>
                <div className='w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
                <div className='w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
                <div className='w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />

              </div>
              <div className='flex flex-row items-center justify-center'>
                <div className='w-20 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              </div>
            </div>
            <div className='flex justify-between w-full items-center'>
              <div className='flex space-x-2 items-center justify-center'>
                <div className='w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
                <div className='w-20 h-4 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />

              </div>
              <div className='flex justify-center'>
                <div className='w-20 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              </div>
            </div>
            <div className='flex w-full flex-col space-y-2 mt-4'>
              <div className='w-full h-4 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-4 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-4 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-4 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-4 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-20 h-4 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
            </div>
            <div className='flex w-full space-x-2 mt-4'>
              <div className='w-full h-6 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-6 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-6 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-6 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
              <div className='w-full h-6 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PinShimmer