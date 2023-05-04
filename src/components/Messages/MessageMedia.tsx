/* eslint-disable @next/next/no-img-element */
import Video from '@components/Common/Video'
import imageCdn from '@utils/functions/imageCdn'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import React, { FC } from 'react'

interface Props {
    message: any
    type: 'image' | 'video' | 'audio' | 'file'
}

const MessageMedia: FC<Props> = ({ message, type }) => {
    console.log(message)
    return (
        <>
            {type === 'image' &&
                <img
                    onClick={() => window.open(sanitizeIpfsUrl(message.content))}
                    src={sanitizeIpfsUrl(message.content)}
                    alt={message.contentFallback ?? ''}
                    className='w-full rounded-2xl cursor-pointer'
                />
            }
            {type === 'video' &&
                <Video src={sanitizeIpfsUrl(message.content)} ratio='16to9' />
            }
        </>
    )
}

export default MessageMedia