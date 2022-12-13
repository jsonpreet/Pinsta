import React from 'react'
import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <>
      <div className="grid h-screen place-items-center">
        <MetaTags />
        <div className="animate-pulse">
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