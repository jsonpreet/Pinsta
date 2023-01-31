/* eslint-disable @next/next/no-img-element */
import React, { FC, useState } from 'react'
import clsx from 'clsx'
import SliderBtn from './buttons'
import { PinstaPublication } from '@utils/custom-types'
import Link from 'next/link'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { Analytics } from '@utils/analytics'
import imageCdn from '@utils/functions/imageCdn'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import { Loader } from '@components/UI/Loader'

interface Props {
    images: string[]
    pin: PinstaPublication
}

const ImageSlider: FC<Props> = ({ images, pin }) => {
    const [slideIndex, setSlideIndex] = useState(1)
    const [isLoading, setLoading] = useState(true)

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
            <div className="w-full overflow-hidden mx-auto h-full relative">
                {images.map((image, index) => {
                    return (
                        <div
                            key={index}
                            className={clsx( 'rounded-xl absolute top-0 h-full w-full flex flex-col justify-center items-center transition-opacity',
                                slideIndex === index + 1 ? "opacity-1" : "opacity-0"
                            )}
                        >
                            <img 
                                src={image} 
                                className='rounded-xl w-auto'
                                alt={`Pin by @${pin.profile.handle}`}
                                onLoad={() => setLoading(false)}
                            />
                            <Link 
                                href={sanitizeIpfsUrl(pin?.metadata?.media[index]?.original?.url)}
                                target='_blank'
                                onClick={() => {
                                    Analytics.track(`clicked_on_view_original_from_pin_${pin.id}`);
                                }}
                                rel='noopener noreferrer'
                                className='absolute bottom-2 z-30 left-2 bg-black/60 py-1 px-2 rounded-md text-white shadow font-semibold text-sm'
                            >
                                View Original
                            </Link>
                            {isLoading ? (
                                <span className='absolute bg-gray-100 dark:bg-gray-800 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center rounded-3xl justify-center'>
                                    <Loader/>
                                </span>
                                )
                            : null}
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

export default ImageSlider