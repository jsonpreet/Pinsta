/* eslint-disable @next/next/no-img-element */
import { Loader } from '@components/UI/Loader'
import { Analytics } from '@utils/analytics'
import { PinstaPublication } from '@utils/custom-types'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import getTextNftUrl from '@utils/functions/getTextNftUrl'
import useAppStore from '@lib/store'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import getTextImage from '@utils/functions/getTextImage'

interface Props {
    pin: PinstaPublication
}

const Attachments: FC<Props> = ({ pin }) => {
    const [isLoading, setLoading] = useState(true)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const [thumbnail, setThumbnail] = useState<string | null>(null)

    useEffect(() => {
        Analytics.track(`viewed_pin_${pin.id}`)
        getThumbnail(pin)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getThumbnail = async (pin: PinstaPublication) => {
        if (pin?.metadata?.media.length > 0 && pin?.metadata?.media[0] !== null) {
            if (pin?.metadata?.media[0]?.original.mimeType === 'image/gif') {
                setThumbnail(getThumbnailUrl(pin));
            } else {
                setThumbnail(imageCdn(getThumbnailUrl(pin), 'thumbnail_lg'));
            }
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
            
            <div
                className='w-full h-full relative md:min-h-[500px] flex flex-col justify-start items-center rounded-xl sm:rounded-bl-3xl sm:rounded-tl-3xl p-4'
            >
                <div className='sticky top-4 w-full flex flex-col justify-center items-center'>
                    <div className='relative'>
                        {thumbnail ?
                            <img
                                className='rounded-xl object-cover'
                                alt={`Pin by @${pin.profile.handle}`}
                                src={thumbnail}
                                onLoad={() => setLoading(false)}
                            />
                            : null
                        }
                        {!isLoading && pin?.metadata?.media.length > 0 && pin?.metadata?.media[0] !== null && (
                            <Link 
                                href={getThumbnailUrl(pin)}
                                target='_blank'
                                onClick={() => {
                                    Analytics.track(`clicked_on_view_original_from_pin_${pin.id}`);
                                }}
                                rel='noopener noreferrer'
                                className='absolute bottom-2 z-30 left-2 bg-black/60 py-1 px-2 rounded-md text-white shadow font-semibold text-sm'
                            >
                                View Original
                            </Link>
                        )}
                    </div>
                </div>
                {isLoading ? (
                    <span className='relative bg-gray-100 dark:bg-gray-800 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center rounded-3xl justify-center'>
                        <Loader/>
                    </span>
                    )
                : null}
            </div>
        </>
    )
}

export default Attachments