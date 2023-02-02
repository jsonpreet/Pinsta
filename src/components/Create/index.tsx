/* eslint-disable @next/next/no-img-element */
import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@utils/analytics'
import { ALLOWED_IMAGE_TYPES, ALLOWED_MEDIA_TYPES } from '@utils/constants'
import useDragAndDrop from '@utils/hooks/useDragAndDrop'
import clsx from 'clsx'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { BsCloudUpload } from 'react-icons/bs'
import Details from './Details'
import Slider from '@components/Common/Slider/Slider'
import { usePublicationStore } from '@lib/store/publication'
import useUploadAttachments from '@hooks/useUploadAttachments'

const Create: NextPage = () => {
    const createPin = usePublicationStore((state) => state.createPin)
    const attachments = usePublicationStore((state) => state.attachments)
    const isUploading = usePublicationStore((state) => state.isUploading)
    const { handleUploadAttachments } = useUploadAttachments()

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

    // const validateFile = (attachments: FileList) => {
    //     if (!attachments) return
    //     const files = Array.from(attachments);

    //     if (files.length > 10) {
    //         const errorMessage = 'You can only upload 10 images at a time!'
    //         toast.error(errorMessage)
    //         return setFileDropError(errorMessage)
    //     }

    //     const previewAttachments: NewPinstaAttachment[] = files.map((file: any) => {
    //         const attachmentId = uuid();
    //         // @ts-ignore
    //         createdPin?.attachmentIds.push(attachmentId);
    //         return {
    //             id: attachmentId,
    //             type: file.type,
    //             altTag: '',
    //             previewItem: URL.createObjectURL(file)
    //         };
    //     });
        
    //     files?.map((file : File, index: number) => {
    //         if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    //             const errorMessage = 'Image format not supported!'
    //             toast.error(errorMessage)
    //             return setFileDropError(errorMessage)
    //         }
    //         if (file.size > 20000000) {
    //             const errorMessage = 'Image size too large!'
    //             toast.error(errorMessage)
    //             return setFileDropError(errorMessage)
    //         }
    //         addAttachments(previewAttachments);
            
    //         setCreatePin({
    //             previews: previewAttachments,
    //             files: files,
    //         })
    //     })
    // }

    const handleAttachment = async (files: FileList) => {

        try {
            // Count check
            if (files && ((isImageType(files) && files.length + attachments.length > 4))) {
                const errorMessage = 'You can only upload 4 images at a time!'
                toast.error(errorMessage);
                return setFileDropError(errorMessage)
            }

            // Type check
            if (isTypeAllowed(files as FileList)) {
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
                        <div className='flex flex-col w-full lg:w-1/3 bg-gray-100 dark:bg-gray-700 p-4 rounded-md h-full min-h-[200px] md:min-h-[400px]'>
                            {attachments.length > 0 ? (
                                <div className='relative flex flex-col w-full h-full min-h-[200px] md:min-h-[400px]'>
                                    <div className=' w-full h-full  min-h-[200px] md:min-h-[400px] flex flex-col justify-center items-center'>
                                        <Slider 
                                            images={attachments}
                                        />
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
                                        accept={ALLOWED_IMAGE_TYPES.join(',')}
                                    />
                                    <div className="text-xl text-center font-semibold">
                                        <span className="flex justify-center mb-6 opacity-80">
                                            <BsCloudUpload size={24} />
                                        </span>
                                        <span>
                                            Drag and drop <br /> click to upload <br />
                                        </span>
                                        <span className='text-sm'>
                                            (up to 4 images)
                                        </span>
                                    </div>
                                    <div>
                                        <p className='text-center'>
                                            We recommend using high quality images <br /> Max 20MB.
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