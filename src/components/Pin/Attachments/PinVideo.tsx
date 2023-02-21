import Video from '@components/Common/Video'
import { ALLOWED_APP_IDS } from '@utils/constants'
import { PinstaPublication } from '@utils/custom-types'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import React, { FC } from 'react'

interface Props {
    pin: PinstaPublication
}

const PinVideo:FC<Props> = ({pin}) => {
    const url = sanitizeIpfsUrl(pin?.metadata?.media[0].original?.url);
    return (
        <>
            <div className='sticky top-4 w-full flex flex-col justify-center items-center'>
                <div className="w-full rounded-xl overflow-hidden mx-auto relative">
                    <Video
                        //ratio={`${ALLOWED_APP_IDS.includes(pin?.appId) ? '9to16' : '16to9'}`}
                        ratio={`9to16`}
                        src={url}
                        showControls={true}
                    />
                </div>
            </div>
        </>
    )
}

export default PinVideo