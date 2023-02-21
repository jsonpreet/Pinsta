/* eslint-disable @next/next/no-img-element */
import { Analytics } from '@utils/analytics'
import { PinstaPublication } from '@utils/custom-types'
import { FC, useEffect } from 'react'
import useAppStore from '@lib/store'
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from '@utils/constants'
import PinImage from './PinImage'
import PinVideo from './PinVideo'

interface Props {
    pin: PinstaPublication
}

const Attachments: FC<Props> = ({ pin }) => {
    const currentProfile = useAppStore((state) => state.currentProfile)

    const isVideo = ALLOWED_VIDEO_TYPES.includes(pin?.metadata?.media[0]?.original.mimeType)
    const isImage = ALLOWED_IMAGE_TYPES.includes(pin?.metadata?.media[0]?.original.mimeType)

    useEffect(() => {
        Analytics.track(`viewed_pin_${pin.id}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div
                className='w-full h-full relative md:min-h-[500px] flex flex-col justify-start items-center rounded-xl sm:rounded-bl-3xl sm:rounded-tl-3xl p-4'
            >
                {isImage ? (
                    <PinImage pin={pin} />
                ) : null}
                {isVideo ? (
                    <PinVideo pin={pin} />
                ) : null}
            </div>
        </>
    )
}

export default Attachments