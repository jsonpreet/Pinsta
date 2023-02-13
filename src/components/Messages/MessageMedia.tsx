/* eslint-disable @next/next/no-img-element */
import Video from '@components/Common/Video'
import imageCdn from '@utils/functions/imageCdn'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import React, { FC } from 'react'

interface Props {
    message: any
    type: 'image' | 'video' | 'audio' | 'file'
}

const MessageMedia:FC<Props> = ({message, type}) => {
    return (
        <>
            {type === 'image' &&
                <img
                    onClick={() => window.open(sanitizeIpfsUrl(message.content))}
                    src={imageCdn(sanitizeIpfsUrl(message.content), 'thumbnail_sm')}
                    alt={message.contentFallback ?? ''}
                    className='w-full rounded-2xl cursor-pointer'
                />
            }
            {type === 'video' &&
                <Video src={sanitizeIpfsUrl(message.content)} />
            }
        </>
    )
}

export default MessageMedia