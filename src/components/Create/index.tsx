/* eslint-disable @next/next/no-img-element */
import MetaTags from '@components/Common/MetaTags'
import useAppStore, { UPLOADED_FORM_DEFAULTS } from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import { ALLOWED_IMAGE_TYPES } from '@utils/constants'
import useDragAndDrop from '@utils/hooks/useDragAndDrop'
import clsx from 'clsx'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { BsCloudUpload, BsTrash } from 'react-icons/bs'
// @ts-ignore
import fileReaderStream from 'filereader-stream'
import Details from './Details'

const Create: NextPage = () => {
    const setCreatePin = useAppStore((state) => state.setCreatePin)
    const createdPin = useAppStore((state) => state.createdPin)
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

    const uploadImage = (file: File) => {
        try {
            if (file) {
                const preview = URL.createObjectURL(file)
                setCreatePin({
                    stream: fileReaderStream(file),
                    preview,
                    imageType: file?.type || 'image/jpeg',
                    file
                })
            }
        } catch (error) {
            toast.error('Error uploading file')
            console.log('[Error Upload Image]', error)
        }
    }

    const validateFile = (file: File) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file?.type)) {
            const errorMessage = 'Image format not supported!'
            toast.error(errorMessage)
            return setFileDropError(errorMessage)
        }
        if (file?.size > 20000000) {
            const errorMessage = 'Image size too large!'
            toast.error(errorMessage)
            return setFileDropError(errorMessage)
        }
        uploadImage(file)
    }

    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setDragOver(false)
        validateFile(e?.dataTransfer?.files[0])
    }

    const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) validateFile(e?.target?.files[0])
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
                        <div className='flex flex-col w-full lg:w-1/3 bg-gray-100 p-4 rounded-md h-full min-h-[200px] md:min-h-[400px]'>
                            {createdPin && createdPin?.preview ? (
                                <div className='relative flex flex-col flex-none w-full h-full min-h-[200px] md:min-h-[400px]'>
                                    <img
                                        src={createdPin?.preview}
                                        className='object-cover rounded-md'
                                        alt='uploaded'
                                    />
                                    <div className='absolute top-2 right-2'>
                                        <button
                                            onClick={() => setCreatePin(UPLOADED_FORM_DEFAULTS)}
                                            className='w-8 h-8 flex items-center justify-center text-red-500 bg-clip-padding backdrop-blur-xl backdrop-filter bg-white rounded-full hover:text-gray-900'
                                        >
                                            <BsTrash size={18} />
                                        </button>
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
                                        'border-dashed border-2 h-full w-full rounded-md flex justify-between p-4 md:p-10 flex-col border-gray-200 space-y-6 md:space-y-0 min-h-[200px] md:min-h-[400px]',
                                        { '!border-red-400': dragOver }
                                    )}
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="dropImage"
                                        onChange={onChooseFile}
                                        accept={ALLOWED_IMAGE_TYPES.join(',')}
                                    />
                                    <div className="text-xl text-center font-semibold">
                                        <span className="flex justify-center mb-6 opacity-80">
                                            <BsCloudUpload size={24} />
                                        </span>
                                        <span>
                                            Drag and drop <br /> click to upload
                                        </span>
                                    </div>
                                    <div>
                                        <p className='text-center'>
                                            We recommend using high quality images <br /> Max 20MB.
                                        </p>
                                    </div>
                                    {/* <div>
                                        <label
                                            htmlFor="chooseVideo"
                                            className="px-8 py-4 text-lg text-white bg-indigo-500 cursor-pointer rounded-full"
                                        >
                                            or choose video
                                            <input
                                                id="chooseVideo"
                                                onChange={onChooseFile}
                                                type="file"
                                                className="hidden"
                                                accept={ALLOWED_IMAGE_TYPES.join(',')}
                                            />
                                        </label>
                                    </div> */}
                                    {fileDropError && (
                                        <div className="font-medium text-red-500">{fileDropError}</div>
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