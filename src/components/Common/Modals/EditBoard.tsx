/* eslint-disable @next/next/no-img-element */
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { FC, useEffect, useRef, useState } from 'react'
import Modal from '@components/UI/Modal'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { Button } from '@components/UI/Button'
import { Input } from '@components/UI/Input'
import z from 'zod'
import { TextArea } from '@components/UI/TextArea'
import { Form, useZodForm } from '@components/UI/Form'
import { toast } from 'react-hot-toast'
import { BoardType } from '@utils/custom-types'
import { Loader } from '@components/UI/Loader'
import imageCdn from '@utils/functions/imageCdn'
import formatHandle from '@utils/functions/formatHandle'
import { ALLOWED_IMAGE_TYPES, PINSTA_SERVER_URL } from '@utils/constants'
import axios from 'axios'
import { Analytics, TRACK } from '@utils/analytics'
import { Toggle } from '@components/UI/Toggle'
import clsx from 'clsx'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import { BsUpload } from 'react-icons/bs'
import { uploadToIPFS } from '@utils/functions/uploadToIPFS'

type Props = {
    board?: BoardType,
    show?: boolean
    setShow?: any
}

const formSchema = z.object({
    boardName: z
        .string()
        .min(3, { message: 'Name should be atleast 3 characters' })
        .max(100, { message: 'Name should not exceed 50 characters' }),
        
    boardDescription: z
        .string()
        .max(260, { message: 'Description should not exceed 260 characters' }),
})
type FormData = z.infer<typeof formSchema>

const EditBoardModal: FC<Props> = ({ board, show, setShow }) => {
    const currentProfile = useAppStore((state) => state.currentProfile)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const [isPrivate, setIsPrivate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isImgLoading, setImgLoading] = useState(true)
    const [newImage, setNewImage] = useState<any>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<any>(null)
    const [imageUploading, setImageUploading] = useState(false)

    const onCancel = () => {
        reset()
        setLoading(false)
        setShow(false)
    }

    const reset = () => {
        form.reset()
    }

    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.EDIT_BOARD)
    }, [])

    const onCreate = async ({ boardName, boardDescription }: FormData) => {
        let slug = boardName.trim().toLowerCase().replace(/ /g, '-')
        const request = {
            id: board?.id,
            name: boardName.trim(),
            slug: slug.replaceAll(/[^a-zA-Z ]/g,"-"),
            description: boardDescription,
            pfp: newImage ? newImage : board?.pfp,
            is_private: isPrivate,
            user_id: currentProfileId,
            handle: formatHandle(currentProfile?.handle)
        } as any
        
        setLoading(true)
        if (boardName.trim().toLowerCase() === board?.name.trim().toLowerCase()) {
            const response = await axios.post(`${PINSTA_SERVER_URL}/update-board`, request)
            if (response && response.status === 200) {
                setLoading(false)
                Analytics.track('Board updated!', {
                    board_id: board?.id,
                    board_name: boardName,
                })
                console.log('Board updated!')
                toast.success('Board updated successfully!')
            } else {
                setLoading(false)
                Analytics.track('Error updating board', {
                    board_id: board?.id,
                    board_name: boardName,
                })
                console.log('Error updating board', response)
                toast.error('Error on updating board!')
            }
        } else {
            return await axios.post(`${PINSTA_SERVER_URL}/check-board-name`, { name: boardName, user_id: currentProfileId }).then((res) => {
                if (res.data.data && res.data.data[0] !== undefined) {
                    setLoading(false)
                    Analytics.track('Error updating board', {
                        board_name: boardName,
                    })
                    toast.error('Board name already exists!')
                    return
                }
            }).catch((err) => {
                setLoading(false)
                console.log(err)
                Analytics.track('Error updating board', {
                    board_id: board?.id,
                    board_name: boardName,
                })
                toast.error('Error on updating board!')
                return
            })
        }
    }

    const handleImageUpload = () => {
        imageRef.current?.click()
    }

    const handleUpload = async(e: any) => {
        const file = e.target.files[0]
        if (file) {
            if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setImageUploading(true)
                const { url } = await uploadToIPFS(file)
                if (!url) {
                    setImageUploading(false)
                    toast.error('Error uploading image')
                    return
                }
                setImage(url)
                // const reader = new FileReader()
                // reader.readAsDataURL(file)
                // reader.onloadend = () => {
                //     setImage(reader.result)
                //     setImgLoading(false)
                //     setImageUploading(false)
                // }
                // reader.onerror = () => {
                //     console.error('AHHHHHHHH!!')
                //     setImageUploading(false)
                // }
            } else {
                toast.error('File type not supported')
            }
        }
    }


    const form = useZodForm({
        schema: formSchema,
        defaultValues: {
            boardName: board?.name ?? '',
            boardDescription: board?.description ?? ''
        }
    });

    const buttonText = loading ? 'Updating...' : 'Update Board'

    return (
        <>
            {show && (
                <Modal
                    title='Edit Board'
                    show={show}
                    icon={<MdOutlineSpaceDashboard size={24} />}
                    onClose={() => onCancel()}
                    size='md'
                    className='md:mb-0 mb-20'
                >
                    <div className={'grid gap-6 p-4 grid-cols-1 md:grid-cols-2'}
                    >
                        <div className='relative w-full h-full flex flex-col items-center rounded-xl'>
                            {board?.pfp ?
                                <img 
                                    className='rounded-xl object-cover' 
                                    alt={board?.name}
                                    src={imageCdn(board?.pfp, 'thumbnail')} 
                                    onLoad={() => setImgLoading(false)}
                                />
                            :
                                <div>
                                    
                                </div>
                            }
                            {isImgLoading ?
                                <span className='absolute bg-gray-100 dark:bg-gray-800 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center rounded-xl justify-center'>
                                    <Loader/>
                                </span>
                                : null
                            }
                            <input 
                                ref={imageRef}
                                type='file'
                                accept={ALLOWED_IMAGE_TYPES.join(',')}
                                className='hidden'
                                onChange={handleUpload}
                            />
                            <div className='absolute bottom-2 right-2 flex flex-col items-center justify-center z-20'>
                                <Button
                                    onClick={handleImageUpload}
                                    variant='light'
                                >
                                    <span>{imageUploading ? 'Uploading' : 'Change'}</span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4 w-full">
                            <Form
                                form={form}
                                onSubmit={({ boardName, boardDescription }) => {
                                    onCreate({ boardName, boardDescription });
                                }}
                            >
                                <div className="flex flex-col space-y-2">
                                    <Input
                                        label="Name"
                                        type="text"
                                        placeholder="Art"
                                        {...form.register('boardName')}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2 mt-4">
                                    <TextArea
                                        label="Description"
                                        placeholder="Tell something more!"
                                        {...form.register('boardDescription')}
                                    />
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    <div>
                                        <Toggle on={isPrivate} setOn={setIsPrivate} />
                                    </div>
                                    <label htmlFor="boardVisibility" className="text-sm font-medium text-gray-700 dark:text-gray-200">Keep this board secret</label>
                                </div>
                                <div className="flex items-center justify-center mt-5 md:mt-10">
                                    <Button 
                                        loading={loading}
                                    >
                                        {buttonText}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Modal>
            )}        
        </>
    )
}

export default EditBoardModal