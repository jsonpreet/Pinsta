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
import axios from '@utils/axios'
import { BoardType } from '@utils/custom-types'
import { Loader } from '@components/UI/Loader'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'

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
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const [isPrivate, setIsPrivate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isImgLoading, setImgLoading] = useState(true)
    const [newImage, setNewImage] = useState<any>(null)

    const onCancel = () => {
        reset()
        setLoading(false)
        setShow(false)
    }

    const reset = () => {
        form.reset()
    }

    const onCreate = async ({ boardName, boardDescription }: FormData) => {
        const request = {
            id: board?.id,
            name: boardName.trim(),
            slug: boardName.trim().toLowerCase().replace(/ /g, '-'),
            description: boardDescription,
            pfp: newImage ? newImage : board?.pfp,
            is_private: isPrivate,
            user: currentProfileId
        } as any
        
        setLoading(true)
        if (boardName.trim().toLowerCase() === board?.name.trim().toLowerCase()) {
            const response = await axios.post(`/api/boards`,
                { type: 'update', data: request }
            )
            if (response && response.status === 200) {
                setLoading(false)
                console.log('Board updated!')
                toast.success('Board updated successfully!')
            } else {
                setLoading(false)
                console.log('Error updating board', response)
                toast.error('Error on updating board!')
            }
        } else {
            const checkName = await axios.get(`/api/boards?type=checkName&name=${boardName}&profile=${currentProfileId}`)
            if (!checkName.data.success) {
                setLoading(false)
                toast.error('Board name already exists!')
                return
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
                >
                    <div className='grid grid-cols-2 gap-6 p-4'>
                        <div className='sm:rounded-tl-3xl relative w-full h-full flex flex-col items-center rounded-xl sm:rounded-bl-3xl '
                        >
                            {board?.pfp ?
                                <>
                                    <img 
                                        className='rounded-xl object-cover' 
                                        alt={board?.name}
                                        src={imageCdn(board?.pfp, 'thumbnail')} 
                                        onLoad={() => setImgLoading(false)}
                                    />
                                    {isImgLoading ?
                                        <span className='absolute bg-gray-100 dark:bg-gray-800 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center rounded-bl-3xl rounded-tl-3xl justify-center'>
                                            <Loader/>
                                        </span>
                                        : null
                                    }
                                </>
                            : null }
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
                                <div className="flex items-center justify-center mt-10">
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