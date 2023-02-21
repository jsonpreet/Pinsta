/* eslint-disable @next/next/no-img-element */
import React, { FC, useState } from 'react'
import SliderBtn from './buttons'
import { PinstaPublication } from '@utils/custom-types'
import { Analytics } from '@utils/analytics'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import { Loader } from '@components/UI/Loader'
import useAppStore from '@lib/store'
import clsx from 'clsx'

interface Props {
    images: string[]
    pin: PinstaPublication
}

const ImageSlider: FC<Props> = ({ images, pin }) => {
    const [slideIndex, setSlideIndex] = useState(1)
    const setSlideImageLoading = useAppStore((state) => state.setSlideImageLoading)
    const slideImageLoading = useAppStore((state) => state.slideImageLoading)
    const [isLoading, setLoading] = useState(false)
    //const slideImageLoading = true

    const nextSlide = () => {
        setLoading(true)
        if(slideIndex !== images.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === images.length){
            setSlideIndex(1)
        }
    }

    const prevSlide = () => {
        setLoading(true)
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(images.length)
        }
    }

    return (
        <>
            <div className="w-full overflow-hidden mx-auto relative">
                <img 
                    src={images[slideIndex - 1]} 
                    className='rounded-xl w-full mx-auto'
                    alt={!isLoading && !slideImageLoading ? `Pin by @${pin?.profile?.handle}` : ''}
                    onLoad={() => {
                        setSlideImageLoading(false)
                        setLoading(false)
                    }}
                />
                {!isLoading && !slideImageLoading ? (
                    <a 
                        href={sanitizeIpfsUrl(pin?.metadata?.media[slideIndex - 1]?.original?.url)}
                        target='_blank'
                        onClick={() => {
                            Analytics.track(`clicked_on_view_original_from_pin_${pin?.id}`);
                        }}
                        rel='noopener noreferrer'
                        className='absolute bottom-2 z-30 left-2 bg-black/60 py-1 px-2 rounded-md text-white shadow font-semibold text-sm'
                    >
                        View Original
                    </a>
                ) : null}
                {images.length > 1 && (
                    <div
                        className='top-0 bottom-0 m-auto absolute z-10 flex justify-between items-center w-full'
                    >
                        <SliderBtn direction="prev" moveSlide={prevSlide} />
                        <SliderBtn direction="next" moveSlide={nextSlide} />
                    </div>
                )}
                
                {images.length > 1 && isLoading ? (
                    <span
                        className={clsx(
                            'top-0 absolute flex bg-black/50 left-0 right-0 bottom-0 h-full w-full items-center rounded-xl justify-center'
                        )}
                    >
                        <Loader/>
                    </span>
                    )
                : null}
            </div>
        </>
    )
}

export default ImageSlider