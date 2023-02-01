/* eslint-disable @next/next/no-img-element */
import React, { FC, useState } from 'react'
import clsx from 'clsx'
import SliderBtn from './buttons'
import { BsTrash } from 'react-icons/bs'
import { usePublicationStore } from '@lib/store/publication'
import { NewPinstaAttachment } from '@utils/custom-types'

interface Props {
    images: NewPinstaAttachment[]
}

const Slider: FC<Props> = ({ images }) => {
    const [slideIndex, setSlideIndex] = useState(1)
    const removeAttachments = usePublicationStore((state) => state.removeAttachments)

    const nextSlide = () => {
        if(slideIndex !== images.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === images.length){
            setSlideIndex(1)
        }
    }

    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(images.length)
        }
    }

    return (
        <>
            <div className="w-full mx-auto h-full relative">
                {images.map((image, index) => {
                    return (
                        <div
                            key={index}
                            className={clsx( 'rounded-xl absolute top-0 h-full w-full flex flex-col justify-center items-center transition-opacity',
                                slideIndex === index + 1 ? "opacity-1" : "opacity-0"
                            )}
                        >
                            <div 
                                className='relative'
                            >
                                
                                <img 
                                    // @ts-ignore
                                    src={image?.previewItem} 
                                    className='rounded-xl w-auto'
                                    alt=''
                                />
                                <div className='absolute top-0 right-0'>
                                    <button
                                        // @ts-ignore
                                        onClick={() => removeAttachments([image?.id])}
                                        className='w-8 h-8 flex items-center justify-center text-red-500 bg-clip-padding backdrop-blur-xl backdrop-filter bg-white rounded-full hover:text-gray-900'
                                    >
                                        <BsTrash size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {images.length > 1 && (
                    <div
                        className='top-0 bottom-0 m-auto absolute z-10 flex justify-between items-center w-full'
                    >
                        <SliderBtn direction="prev" moveSlide={prevSlide} />
                        <SliderBtn direction="next" moveSlide={nextSlide} />
                    </div>
                )}
            </div>
        </>
    )
}

export default Slider