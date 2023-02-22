import { usePublicationStore } from '@lib/store/publication'
import formatBytes from '@utils/functions/formatBytes'
import React, { FC, useEffect, useRef } from 'react'
import { BsTrash } from 'react-icons/bs'

interface Props {
    videoRef: React.MutableRefObject<HTMLVideoElement | null>
}

const Video:FC<Props> = ({videoRef}) => {
    const createPin = usePublicationStore((state) => state.createPin)
    const setCreatePin = usePublicationStore((state) => state.setCreatePin)
    const attachments = usePublicationStore((state) => state.attachments)
    const removeAttachments = usePublicationStore((state) => state.removeAttachments)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onloadeddata = onDataLoaded
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoRef])

    const onDataLoaded = async (event: Event) => {
        if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
            setCreatePin({
                durationInSeconds: videoRef.current.duration.toFixed(2),
            })
        }
        if (event.target) {
            const currentVideo = document.getElementsByTagName('video')[0]
            currentVideo.preload = 'metadata';
            //console.log('durationInSeconds', currentVideo.duration.toFixed(2))
        }
    }


    return (
        <>
            <video
                ref={videoRef}
                className="w-full rounded-md aspect-[9/16] bg-black"
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload noplaybackrate"
                // @ts-ignore
                poster={createPin?.videoThumbnail}
                controls
                // @ts-ignore
                src={createPin?.videoPreview}
            >
                <source
                // @ts-ignore
                    src={createPin?.videoPreview}
                    type={'video/mp4'}
                />
            </video>
            <div className="py-0.5 absolute top-2 px-2 z-10 left-2 text-xs uppercase bg-brand-200 text-black rounded-full">
                {createPin?.file?.size && (
                    <span className="whitespace-nowrap font-semibold">
                        {formatBytes(createPin?.file?.size)}
                    </span>
                )}
            </div>
            <div className='absolute top-2 right-2'>
                <button
                    // @ts-ignore
                    onClick={() => {
                        removeAttachments([attachments[0]?.id])
                        setCreatePin({ file: null, isVideoPublication: false, videoThumbnail: null, durationInSeconds: 0})
                    }}
                    className='w-8 h-8 flex items-center justify-center text-red-500 bg-clip-padding backdrop-blur-xl backdrop-filter bg-white rounded-full hover:text-gray-900'
                >
                    <BsTrash size={18} />
                </button>
            </div>
        </>
    )
}

export default Video