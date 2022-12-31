import { Button } from '@components/UI/Button'
import { FetchProfileBoardPins } from '@lib/db/actions'
import { PINSTA_API_URL } from '@utils/constants'
import { Profile } from '@utils/lens/generated'
import axios from '@utils/axios'
import { FC } from 'react'
import { toast } from 'react-hot-toast'

interface Props {
    board: any
    profile: Profile
}

const Board: FC<Props> = ({ board, profile }) => {
    const { isLoading, isFetched, isError, data } = FetchProfileBoardPins(board.id, profile?.id)

    if (isFetched && isError) {
        toast.error('Something went wrong')
    }

    const deleteBoard = async (id: string) => {
        const res = await axios.post(`/boards`, {
            type: 'delete',
            data: {
                id: `${id}`,
            }
        })
        return res
    }

    const totalPins = isFetched ? data?.length : 0

    return (
        <>
            <div className="relative">
                <div className="relative">
                    <h3>{board.name}</h3>
                    <div className='pin-meta'>
                        <div className='pin-meta-item'>
                            <span className='totalPins'>{totalPins} Pins</span>
                        </div>
                        <div className='pin-meta-item'>
                            <span className='delete'>
                                <Button
                                    variant='danger'
                                    size='sm'
                                    onClick={() => {
                                        toast.promise(
                                            deleteBoard(board.id),
                                            {
                                                loading: 'Deleting board...',
                                                success: () => {
                                                    return 'Board deleted successfully'
                                                },
                                                error: () => {
                                                    return 'Something went wrong'
                                                },
                                            }
                                        )
                                    }}
                                >
                                    Delete
                                </Button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Board