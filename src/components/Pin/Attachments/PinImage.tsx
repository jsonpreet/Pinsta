/* eslint-disable @next/next/no-img-element */
import ImageSlider from '@components/Common/Slider'
import { Loader } from '@components/UI/Loader'
import useAppStore from '@lib/store'
import { Analytics } from '@utils/analytics'
import { PinstaPublication } from '@utils/custom-types'
import getTextImage from '@utils/functions/getTextImage'
import imageCdn from '@utils/functions/imageCdn'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import React, { FC, useEffect, useState } from 'react'

interface Props {
    pin: PinstaPublication
}

const PinImage: FC<Props> = ({ pin }) => {
    const currentProfile = useAppStore((state) => state.currentProfile)
    const [thumbnail, setThumbnail] = useState<string | null>(null)
    const [thumbnails, setThumbnails] = useState<string[]>([])
    const [isLoading, setLoading] = useState(true)
    const slideImageLoading = useAppStore((state) => state.slideImageLoading)
    const setSlideImageLoading = useAppStore((state) => state.setSlideImageLoading)

    useEffect(() => {
        setSlideImageLoading(true)
        Analytics.track(`viewed_pin_only_images${pin.id}`)
        getThumbnail(pin)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getThumbnail = async (pin: PinstaPublication) => {
        if (pin?.metadata?.media?.length > 0) {
            const list = pin?.metadata?.media.map(
                (media) => imageCdn(sanitizeIpfsUrl(media.original.url), 'thumbnail_lg')
            );
            setThumbnails(list);
        } else {
            const textNFTImageUrl = await getTextImage(
                pin?.metadata?.content,
                pin?.profile?.handle,
                new Date().toLocaleString()
            );
            setThumbnail(textNFTImageUrl);
        }
    };
    return (
        <>
            {thumbnail ?
                <img
                    className='rounded-xl object-cover'
                    alt={`Pin by @${pin.profile.handle}`}
                    src={thumbnail}
                    onLoad={() => setLoading(false)}
                />
                : null
            }
            <div className='sticky top-4 w-full flex flex-col justify-center items-center'>
                <ImageSlider
                    images={thumbnails}
                    pin={pin}
                />
            </div>
            
            {(thumbnail && isLoading) || (thumbnails?.length > 0 && slideImageLoading) ? (
                <span className='relative bg-gray-100 dark:bg-gray-800 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center rounded-3xl justify-center'>
                    <Loader/>
                </span>
                )
            : null}
        </>
    )
}

export default PinImage