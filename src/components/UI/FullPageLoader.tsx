/* eslint-disable @next/next/no-img-element */
import React from 'react'

const FullPageLoader = () => {
  return (
    <>
      <div className="grid h-screen place-items-center">
        <div className="animate-bounce">
          <img
            src='/logo.png'
            draggable={false}
            className="w-12 h-12"
            alt="Pinsta"
          />
        </div>
      </div>
    </>
  )
}

export default FullPageLoader