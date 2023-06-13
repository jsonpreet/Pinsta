/* eslint-disable @next/next/no-img-element */
import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@utils/analytics'
import { ALLOWED_IMAGE_TYPES, ALLOWED_MEDIA_TYPES, ALLOWED_VIDEO_TYPES } from '@utils/constants'
import useDragAndDrop from '@utils/hooks/useDragAndDrop'
import clsx from 'clsx'
import { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { BsCloudUpload } from 'react-icons/bs'
import Details from './Details'
import Slider from '@components/Common/Slider/Slider'
import { usePublicationStore } from '@lib/store/publication'
import useUploadAttachments from '@utils/hooks/useUploadAttachments'
import { generateVideoThumbnails } from '@utils/functions/generateVideoThumbnails'
import { getFileFromDataURL } from '@utils/functions/getFileFromDataURL'
import { uploadToIPFS } from '@utils/functions/uploadToIPFS'
import Video from './Video'

const Create: NextPage = () => {
    const createPin = usePublicationStore((state) => state.createPin)
    const setCreatePin = usePublicationStore((state) => state.setCreatePin)
    const attachments = usePublicationStore((state) => state.attachments)
    const isUploading = usePublicationStore((state) => state.isUploading)
    const { handleUploadAttachments } = useUploadAttachments()
    const videoRef = useRef<HTMLVideoElement>(null)

    const {
        dragOver,
        setDragOver,
        onDragOver,
        onDragLeave,
        fileDropError,
        setFileDropError
    } = useDragAndDrop()

    useEffect(() => {
        Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.DROPZONE })
    }, [])

    useEffect(() => {
        if (createPin?.file) {
            if (createPin?.isVideoPublication) {
                generateThumbnails(createPin?.file)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createPin?.file])

    const hasVideos = (files: FileList) => {
        let videos = 0;
        let images = 0;

        // @ts-ignore
        for (const file of files) {
            if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
                setCreatePin({
                    isVideoPublication: true, file: file, videoPreview: URL.createObjectURL(file)
                })
                videos = videos + 1;
            } else {
                images = images + 1;
            }
        }

        if (videos > 0) {
            if (videos > 1) {
                return true;
            }

            return images > 0 ? true : false;
        }

        return false;
    };

    const isTypeAllowed = (files: FileList) => {
        // @ts-ignore
        for (const file of files) {
            if (ALLOWED_MEDIA_TYPES.includes(file.type)) {
                return true;
            }
        }

        return false;
    };

    const isImageType = (files: FileList) => {
        // @ts-ignore
        for (const file of files) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                return false;
            }
        }

        return true;
    };

    const handleAttachment = async (files: FileList) => {

        try {
            // Count check
            if (files && (hasVideos(files) || (isImageType(files) && files.length + attachments.length >= 10))) {
                const errorMessage = 'Please choose either 1 video or up to 10 photos.'
                toast.error(errorMessage);
                return setFileDropError(errorMessage)
            }

            // Type check
            if (isTypeAllowed(files as FileList)) {
                
                setCreatePin({ 
                    buttonText: 'Uploading',
                })
                await handleUploadAttachments(files);
            } else {
                const errorMessage = 'File format not allowed.'
                toast.error(errorMessage);
                return setFileDropError(errorMessage)
            }
        } catch {
            const errorMessage = 'Something went wrong while uploading!'
            toast.error(errorMessage);
            return setFileDropError(errorMessage)
        }
    };

    useEffect(() => {
        if (attachments.length > 0 && !isUploading) {
            setCreatePin({ 
                buttonText: 'Create Pin',
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attachments])
    

    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setDragOver(false)
        const { files } = e?.dataTransfer;
        if (files?.length) handleAttachment(files)
    }

    const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { files } = e.target;
        if (files?.length) handleAttachment(files)
    }

    const generateThumbnails = async (fileToGenerate: File) => {
        try {
            const thumbnailArray = await generateVideoThumbnails(
                fileToGenerate,
                1,
            )
            const thumbnailList: Array<{
                ipfsUrl: string
                url: string
                isNSFWThumbnail: boolean
            }> = []
            thumbnailArray.forEach((t) => {
                thumbnailList.push({ url: t, ipfsUrl: '', isNSFWThumbnail: false })
            })
            //setThumbnails(thumbnailList)
            //setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
            const imageFile = getFileFromDataURL(
                thumbnailList[0]?.url,
                'thumbnail.jpeg'
            )
            const ipfsResult = await uploadToIPFS(imageFile)
            setCreatePin({ 
                videoThumbnail: ipfsResult?.url,
                thumbnailType: 'image/jpeg',
            })
        } catch (error) {
            console.error('[Error Generate Thumbnails]', error)
        }
    }

    return (
        <>
            <style jsx global>
            {`
                body {
                    background-color: rgb(244, 244, 245);
                }
            `}
            </style>
            <MetaTags title='Create Pin' />
            <div className='w-full max-w-[1024px] mt-0 md:mt-10 dark:bg-gray-800 md:shadow-[rgba(13,_38,_76,_0.10)_0px_9px_15px] bg-white md:rounded-3xl mx-auto mb-0'>
                <div className='flex flex-col items-center justify-center w-full h-full min-h-auto md:min-h-[400px] p-6 md:p-10'>
                    <div className='flex md:flex-row flex-col space-x-0 space-y-10 md:space-y-0 md:space-x-10 w-full h-full min-h-auto md:min-h-[400px]'>
                        <div className={clsx('flex flex-col w-full lg:w-1/3 bg-gray-100 dark:bg-gray-700 rounded-md h-full min-h-[200px] md:min-h-[400px]', 
                            createPin?.isVideoPublication ? 'p-0' : 'p-4'
                        )}>
                            {attachments.length > 0 ? (
                                <div className='relative flex flex-col w-full rounded-md h-full min-h-[200px] md:min-h-[400px]'>
                                    <div className=' w-full h-full rounded-md min-h-[200px] md:min-h-[400px] flex flex-col justify-center items-center'>
                                        {createPin?.isVideoPublication ? 
                                            <Video videoRef={videoRef} />
                                        : 
                                            <Slider 
                                                images={attachments}
                                            />
                                        }
                                    </div>
                                </div>
                            ) : (
                            <label
                                className='relative flex flex-col flex-none w-full cursor-pointer h-full'
                                htmlFor="dropImage"
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                            >
                                <div
                                    className={clsx(
                                        'border-dashed border-2 h-full w-full rounded-md flex justify-between p-4 md:p-10 flex-col border-gray-200 dark:border-gray-400 space-y-6 md:space-y-0 min-h-[200px] md:min-h-[400px]',
                                        { '!border-red-400': dragOver }
                                    )}
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="dropImage"
                                        onChange={onChooseFile}
                                        multiple={true}
                                        accept={ALLOWED_MEDIA_TYPES.join(',')}
                                    />
                                    <div className="text-xl text-center font-semibold">
                                        <span className="flex justify-center mb-6 opacity-80">
                                            <BsCloudUpload size={24} />
                                        </span>
                                        <span>
                                            Drag and drop <br /> click to upload <br />
                                        </span>
                                        <span className='text-sm'>
                                            (up to 10 images, 1 video)
                                        </span>
                                    </div>
                                    <div>
                                        <p className='text-center'>
                                            We recommend using high quality images <br /> Max 20MB, <br />100MB Video.
                                        </p>
                                    </div>
                                    {fileDropError && (
                                        <div className="font-medium text-red-500 text-center dark:text-red-400">
                                            {fileDropError}
                                        </div>
                                    )}
                                </div>
                            </label>
                            )
                        }
                        </div>
                        <div className='relative flex flex-col w-full lg:w-2/3 space-y-6 min-h-[200px] md:min-h-[400px]'>
                            <Details/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create