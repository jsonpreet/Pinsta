/* eslint-disable @next/next/no-img-element */
import { Button } from '@components/UI/Button'
import { FetchProfileBoardPins } from '@lib/db/actions'
import { Profile } from '@utils/lens/generated'
import axios from '@utils/axios'
import { FC, useState } from 'react'
import { toast } from 'react-hot-toast'
import imageCdn from '@utils/functions/imageCdn'
import { BsPencilSquare, BsTrash } from 'react-icons/bs'
import dayjs from 'dayjs';
import formatTime from '@utils/functions/formatTime'
// @ts-ignore
import dayjsTwitter from 'dayjs-twitter';
import EditBoardModal from '@components/Common/Modals/EditBoard'
import Link from 'next/link'
import formatHandle from '@utils/functions/formatHandle'

dayjs.extend(dayjsTwitter);

interface Props {
    board: any
    profile: Profile
}

const Board: FC<Props> = ({ board, profile }) => {
    const { isLoading, isFetched, isError, data } = FetchProfileBoardPins(board.id, profile?.id)
    const [showEditBoard, setShowEditBoard] = useState(false)

    if (isFetched && isError) {
        toast.error('Something went wrong')
    }

    const deleteBoard = async (id: string) => {
        return await axios.post(`/boards`, {
            type: 'delete',
            data: {
                id: `${id}`,
            }
        })
    }

    const totalPins = isFetched ? data?.length : 0

    return (
        <>
            <EditBoardModal board={board} show={showEditBoard} setShow={setShowEditBoard} />
            <div className="relative group">
                <Link
                    href={`/${formatHandle(profile?.handle)}/${board.slug}`}
                >
                    <div
                        className='mb-4 relative h-56 overflow-hidden rounded-lg'
                        style={{ backgroundImage: `url(${board?.pfp ? imageCdn(board?.pfp, 'thumbnail') : '/patterns/2.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                        <img
                            alt={board.name}
                            src={board?.pfp ? imageCdn(board?.pfp, 'thumbnail') : '/patterns/2.png'}
                            className='w-full hidden rounded-lg'
                        />  
                        <div className='absolute group-hover:flex space-x-3 hidden top-2 right-4'>
                            <div>
                                <button
                                    className='!p-0 !w-8 !h-8 !rounded-full bg-white/70 hover:bg-gray-800 text-gray-800 hover:text-white flex items-center justify-center'
                                    onClick={() => setShowEditBoard(true)}
                                >
                                    <BsPencilSquare size={17} />
                                </button>
                            </div>
                            <div>
                                <Button
                                    variant='danger'
                                    className='!p-0 !w-8 !h-8 !rounded-full'
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
                                    <BsTrash size={17} />
                                </Button>
                            </div>
                        </div>
                    </div>  
                    <div className='flex flex-col space-y-1'>
                        <h3 className='font-semibold text-base group-hover:text-red-500'>{board.name}</h3>
                        <div className='flex text-sm'>
                            <span>{`${totalPins} ${totalPins > 1 ? `Pins` : `Pin`}`}</span>
                            <span className='middot'></span>
                            <span title={formatTime(board.created_at)}>
                                {/* @ts-ignore */}
                                {dayjs(new Date(board.created_at)).twitter()}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default Board