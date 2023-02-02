/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FC, useState } from 'react'
import type { PinstaPublication } from '@utils/custom-types'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import formatHandle from '@utils/functions/formatHandle'
import { Loader } from '@components/UI/Loader'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import { Tooltip } from '@components/UI/Tooltip'
import { v4 as uuid } from 'uuid';
import getAttributeFromTrait from '@utils/functions/getAttributeFromTrait'

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication
}

const ImageCard: FC<Props> = ({pin}) => {
    const [loading, setLoading] = useState(true)
    const thumbnailUrl = pin?.metadata?.media[0]?.original.mimeType === 'image/gif' ? getThumbnailUrl(pin) : imageCdn(getThumbnailUrl(pin), 'thumbnail_sm')
    // @ts-ignore
    const createdIn = getAttributeFromTrait(pin?.metadata?.attributes, 'createdIn')

    const splicedMedia = pin?.metadata?.media?.length > 3 ? pin?.metadata?.media?.slice(0, 4) : pin?.metadata?.media
    return (
        <>
            <div>
                <img
                    alt={`Pin by ${formatHandle(pin.profile?.handle)}`}
                    src={thumbnailUrl}
                    onLoad={() => setLoading(false)}
                    className={clsx('rounded-lg border w-full dark:border-gray-700 border-gray-100', {
                        'h-60': loading
                    })}
                />
                {createdIn === 'wav3s' && (
                    <div className="absolute top-2 z-20 right-2 w-full flex items-end justify-end">
                    <Tooltip
                        content="Promoted on Wav3s"
                        placement="bottom"
                    >
                        <img
                        src='/dollar.png'
                        className="w-6 h-6 rounded-full"
                        alt='Promoted on Wav3s'
                        />
                    </Tooltip>
                    {/* <div className="flex flex-row items-center justify-center w-8 h-8 rounded-full bg-black/70">
                        <BiDollarCircle size={24} className="text-white" />
                    </div> */}
                    </div>
                )}
                {pin?.metadata?.media.length > 1 ? (
                    <span
                    className={clsx(
                        'absolute bottom-0 z-20 left-0 w-full p-2 flex flex-row items-center justify-start overflow-hidden'
                    )}
                    >
                    {
                        splicedMedia.map((media: any, index: number) => {
                            if (index == 0) return null
                            const thumbnailUrl = imageCdn(sanitizeIpfsUrl(media.original.url), 'avatar')
                            if(index === 4 && pin?.metadata?.media?.length > 4){
                                return (
                                    <>
                                        <div
                                            key={uuid()}
                                            className={clsx(
                                                'rounded-full shadow-md border w-8 h-8 overflow-hidden dark:border-gray-700 border-gray-50 -ml-3'
                                            )}
                                        >
                                            <span 
                                                className="flex items-center justify-center w-full h-full bg-black bg-opacity-50"
                                            >
                                                <span className="text-white dark:text-gray-800 font-bold text-sm">+{pin?.metadata?.media?.length - 4}</span>
                                            </span>
                                        </div>
                                    </>
                                )
                            }
                            return (
                                <>
                                    <div
                                        key={uuid()}
                                        className={clsx(
                                            'rounded-full border-2 shadow-md w-8 h-8 overflow-hidden dark:border-gray-700 border-gray-50',
                                            pin?.metadata?.media.length > 1 && index !== 1 ? '-ml-3' : ''
                                        )}
                                    >
                                        <img 
                                            alt={`Pin by ${formatHandle(pin.profile?.handle)}`}
                                            src={thumbnailUrl}
                                            className={clsx(
                                                'rounded-full w-8 h-8'
                                            )}
                                        />
                                    </div>
                                </>
                            )
                        })
                    }
                    </span>
                ) :
                    null
                }
                {loading ?
                    <span className='absolute bg-gray-100 dark:bg-gray-700 top-0 rounded-lg left-0 right-0 bottom-0 h-full w-full flex items-center justify-center'>
                        <Loader/>
                    </span>
                    : null
                }
            </div>
        </>
    )
}

export default ImageCard