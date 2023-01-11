/* eslint-disable @next/next/no-img-element */
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { FC, useState } from 'react'
import Modal from '@components/UI/Modal'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { Switch } from '@headlessui/react'
import { Button } from '@components/UI/Button'
import { Input } from '@components/UI/Input'
import z from 'zod'
import { TextArea } from '@components/UI/TextArea'
import { Form, useZodForm } from '@components/UI/Form'
import { toast } from 'react-hot-toast'
import { BoardType, PinstaPublication } from '@utils/custom-types'
import { Loader } from '@components/UI/Loader'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import formatHandle from '@utils/functions/formatHandle'
import axios from 'axios'
import { PINSTA_SERVER_URL } from '@utils/constants'

type Props = {
    pin?: PinstaPublication,
    setIsSaved?: any
    savePinToBoard?: any
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

const CreateBoardModal: FC<Props> = ({ pin, setIsSaved, savePinToBoard }) => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    const showCreateBoard = useAppStore((state) => state.showCreateBoard)
    const [isPrivate, setIsPrivate] = useState(false)
    const setCurrentBoard = usePersistStore((state) => state.setCurrentBoard)
    const [loading, setLoading] = useState(false)
    const [isImgLoading, setImgLoading] = useState(true)

    const onCancel = () => {
        reset()
        setLoading(false)
        setShowCreateBoard(false)
    }

    const reset = () => {
        form.reset()
    }

    const onCreate = async ({ boardName, boardDescription }: FormData) => {
        const request = {
            name: boardName.trim(),
            slug: boardName.trim().toLowerCase().replace(/ /g, '-'),
            description: boardDescription,
            pfp: pin ? getThumbnailUrl(pin) : '',
            is_private: isPrivate,
            handle: formatHandle(currentProfile?.handle),
            user_id: currentProfileId
        } as any
        
        setLoading(true)

        return await axios.post(`${PINSTA_SERVER_URL}/check-board-name`, { name: boardName, user_id: currentProfileId }).then((res) => {
            if (res.data.data && res.data.data[0] !== undefined) {
                setLoading(false)
                toast.error('Board name already exists!')
                return
            } else {
                createBoard(request)
                return 
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err)
            toast.error('Error on creating board!')
            return
        })
    }

    const createBoard = async (request: BoardType) => {
        return await axios.post(`${PINSTA_SERVER_URL}/create-board`, request).then((res) => {
            if (res.status === 200) {
                console.log('Board created!')
                toast.success('Board created successfully!')
                setCurrentBoard(res.data.data)
                savePinToBoard(res.data.data)
                return 
            } else {
                setLoading(false)
                console.log('Error creating board', res)
                toast.error('Error on creating board!')
                return 
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err)
            toast.error('Error on creating board!')
            return
        })
    }

    const form = useZodForm({
        schema: formSchema,
        defaultValues: {
            boardName: '',
            boardDescription: ''
        }
    });

    const buttonText = loading ? 'Creating...' : 'Create Board'

    return (
        <>
            {showCreateBoard && (
                <Modal
                    title='Create Board'
                    show={showCreateBoard}
                    icon={<MdOutlineSpaceDashboard size={24} />}
                    onClose={() => onCancel()}
                    size='md'
                    className='md:mb-0 mb-20'
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
                        {pin ?
                            <div
                                className='relative w-full h-full flex flex-col items-center rounded-xl max-h-96 overflow-hidden'
                            >
                                <img
                                    className='rounded-xl object-cover'
                                    alt={`Pin by @${pin?.profile?.handle}`}
                                    src={imageCdn(getThumbnailUrl(pin), 'thumbnail')}
                                    onLoad={() => setImgLoading(false)}
                                />
                                {isImgLoading ?
                                    <span className='absolute bg-gray-100 dark:bg-gray-800 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center rounded-xl justify-center'>
                                        <Loader />
                                    </span>
                                    : null
                                }
                            </div>
                            : null
                        }
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
                                        <Switch
                                            checked={isPrivate}
                                            onChange={setIsPrivate}
                                            className={`${
                                                isPrivate ? 'bg-red-600' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                        >
                                            <span className="sr-only">Keep this board secret</span>
                                            <span
                                                className={`${
                                                isPrivate ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                            />
                                        </Switch>
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

export default CreateBoardModal