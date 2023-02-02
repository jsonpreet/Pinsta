/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FC, useState } from 'react'
import type { PinstaPublication } from '@utils/custom-types'
import imageCdn from '@utils/functions/imageCdn'
import formatHandle from '@utils/functions/formatHandle'
import { Loader } from '@components/UI/Loader'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import { Tooltip } from '@components/UI/Tooltip'
import { v4 as uuid } from 'uuid';
import getAttributeFromTrait from '@utils/functions/getAttributeFromTrait'
import getVideoCoverUrl from '@utils/functions/getVideoCoverUrl'
import { BsFillPlayFill } from 'react-icons/bs'

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication
}

const VideoCard: FC<Props> = ({pin}) => {
    const [loading, setLoading] = useState(true)
    const isCover = pin.metadata.cover?.original?.url ? true : false;
    const thumbnailUrl = imageCdn(getVideoCoverUrl(pin), 'thumbnail_sm')
    console.log('video pin', pin)
    // @ts-ignore
    const createdIn = getAttributeFromTrait(pin?.metadata?.attributes, 'createdIn')
    return (
        <>
            <div>
                {isCover
                    ?
                    <img
                        alt={`Pin by ${formatHandle(pin.profile?.handle)}`}
                        src={thumbnailUrl}
                        onLoad={() => setLoading(false)}
                        className={clsx('rounded-lg border w-full dark:border-gray-700 border-gray-100', {
                            'h-60': loading
                        })}
                    />
                : null}
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
                    </div>
                )}
                {loading ?
                    <span className='absolute bg-gray-100 dark:bg-gray-700 top-0 rounded-lg left-0 right-0 bottom-0 h-full w-full flex items-center justify-center'>
                        <Loader/>
                    </span>
                    : 
                    <span className='absolute top-0 rounded-lg left-0 right-0 bottom-0 h-full w-full flex items-center justify-center'>
                        <BsFillPlayFill className='text-white text-4xl'/>
                    </span>
                }
            </div>
        </>
    )
}

export default VideoCard