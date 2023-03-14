import useAppStore from '@lib/store'
import React from 'react'
import { BiFilterAlt } from 'react-icons/bi'
import { BsCameraVideo, BsImages } from 'react-icons/bs'
import { CiGrid42 } from "react-icons/ci";
import clsx from 'clsx'

const Filters = () => {
    const setShowTrendingTags = useAppStore((state) => state.setShowTrendingTags)
    const showTrendingTags = useAppStore((state) => state.showTrendingTags)
    const setSelectedFocus = useAppStore((state) => state.setSelectedFocus)
    const selectedFocus = useAppStore((state) => state.selectedFocus)

    return (
        <>
            <div className="flex space-x-0 items-center">
                <div className="flex items-center">
                    <button 
                        className={clsx(
                            'flex space-x-1 items-center justify-center rounded-tl-md rounded-bl-md bg-gray-100 hover:bg-gray-900 hover:text-white focus:outline-none px-3 py-1.5',
                            showTrendingTags ? 'bg-gray-900 text-white' : null
                        )}
                        onClick={() => {
                            //setSelectedFocus('all')
                            setShowTrendingTags(!showTrendingTags)
                        }}
                    >
                        <BiFilterAlt size='17' />
                    </button>
                </div>
                <div className="flex items-center">
                    <button 
                        className={clsx(
                            'flex space-x-1 items-center justify-center bg-gray-100 hover:bg-gray-900 hover:text-white focus:outline-none px-3 py-1.5',
                            selectedFocus === 'all' ? 'bg-gray-900 text-white' : null
                        )}
                        onClick={() => {
                            //setShowTrendingTags(false)
                            setSelectedFocus('all')
                        }}
                    >
                        <CiGrid42 size='17' />
                    </button>
                    <button 
                        className={clsx(
                            'flex space-x-1 items-center justify-center bg-gray-100 hover:bg-gray-900 hover:text-white focus:outline-none px-3 py-1.5',
                            selectedFocus === 'images' ? 'bg-gray-900 text-white' : null
                        )}
                        onClick={() => {
                            //setShowTrendingTags(false)
                            setSelectedFocus('images')
                        }}
                    >
                        <BsImages size='17' />
                    </button>
                    <button 
                        className={clsx(
                            'flex space-x-1 items-center justify-center bg-gray-100  rounded-tr-md rounded-br-md hover:bg-gray-900 hover:text-white focus:outline-none px-3 py-1.5',
                            selectedFocus === 'videos' ? 'bg-gray-900 text-white' : null
                        )}
                        onClick={() => {
                            //setShowTrendingTags(false)
                            setSelectedFocus('videos')
                        }}
                    >
                        <BsCameraVideo size='17' />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Filters