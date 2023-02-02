/* eslint-disable @next/next/no-img-element */
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { FC, useEffect, useState } from 'react'
import Modal from '@components/UI/Modal'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
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
import { Analytics, TRACK } from '@utils/analytics'
import clsx from 'clsx'
import { Toggle } from '@components/UI/Toggle'

type Props = {
    pin?: PinstaPublication,
    setIsSaved?: any
    savePinToBoard?: any
    refetch?: any
    setCreatePin?: any
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

const CreateBoardModal: FC<Props> = ({ pin, setIsSaved, savePinToBoard, refetch, setCreatePin }) => {
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

    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.CREATE_BOARD)
    }, [])

    const onCreate = async ({ boardName, boardDescription }: FormData) => {
        let slug = boardName.trim().toLowerCase().replace(/ /g, '-')
        const request = {
            name: boardName.trim(),
            slug: slug.replaceAll(/[^a-zA-Z ]/g,"-"),
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
                Analytics.track('Board name already exists!', {
                    board_name: boardName,
                })
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
                if (refetch) {
                    refetch()
                }
                if (setCreatePin) {
                    setCreatePin({board: res.data.data})
                }
                if(savePinToBoard){
                    savePinToBoard(res.data.data)
                } else {
                    onCancel()
                    setLoading(false)
                }
                Analytics.track('Board Created', {
                    board_id: res.data.data.id,
                    board_name: res.data.data.name,
                })
                return 
            } else {
                setLoading(false)
                Analytics.track('Board Creation Failed')
                console.log('Error creating board', res)
                toast.error('Error on creating board!')
                return 
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err)
            Analytics.track('Board Creation Failed')
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
                    size={pin ? 'md' : 'sm'}
                    className='md:mb-0 mb-20'
                >
                    <div className={clsx(
                        'grid gap-6 p-4',
                        { 'grid-cols-1 md:grid-cols-2': pin }
                    )}
                    >
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

export default CreateBoardModal