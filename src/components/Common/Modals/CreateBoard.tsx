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
import { PINSTA_API_URL } from '@utils/constants'
import axios from '@utils/axios'

const formSchema = z.object({
    boardName: z
        .string()
        .min(3, { message: 'Name should be atleast 3 characters' })
        .max(50, { message: 'Name should not exceed 50 characters' })
        .regex(/^[A-za-z0-9]+$/, {
            message: 'Name should only contain alphanumeric characters'
        }),
        
    boardDescription: z
        .string()
        .max(260, { message: 'Description should not exceed 260 characters' }),
})
type FormData = z.infer<typeof formSchema>

const CreateBoardModal: FC = () => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    const showCreateBoard = useAppStore((state) => state.showCreateBoard)
    const [isPrivate, setIsPrivate] = useState(false)
    const [loading, setLoading] = useState(false)

    const onCancel = () => {
        reset()
        setShowCreateBoard(false)
    }

    const reset = () => {
        form.reset()
    }

    const onCreate = async ({ boardName, boardDescription }: FormData) => {
        const request = {
            name: boardName,
            description: boardDescription,
            is_private: isPrivate,
            user: currentProfileId
        } as any
        setLoading(true)

        return axios.post(`${PINSTA_API_URL}/api/boards`, 
            {type: 'create', data: request}
        ).then((res) => {
            console.log(res)
            if (res.status === 200) {
                console.log('Board created!')
                toast.success('Board created successfully!')
                setLoading(false)
                onCancel()
            } else {
                setLoading(false)
                console.log('Error creating board')
                toast.error('Error on creating board!')
            }
        }).catch((err) => {
            setLoading(false)
            console.log('Error creating board', err.message)
            toast.error('Error on creating board!')
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
                >
                    <div className="flex flex-col space-y-4 w-full p-8">
                        <Form
                            form={form}
                            onSubmit={({ boardName, boardDescription }) => {
                                onCreate({ boardName, boardDescription });
                            }}
                        >
                            <div className="flex flex-col space-y-2">
                                <Input
                                    label="Board Name"
                                    type="text"
                                    placeholder="Miami"
                                    {...form.register('boardName')}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mt-4">
                                <TextArea
                                    label="Board Description"
                                    placeholder="Tell us something about you!"
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
                </Modal>
            )}        
        </>
    )
}

export default CreateBoardModal