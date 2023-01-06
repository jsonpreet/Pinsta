/* eslint-disable @next/next/no-img-element */
import { PinstaPublication } from '@utils/custom-types'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import { usePublicationsByIdsQuery } from '@utils/lens/generated'
import React, { FC } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@components/UI/Button'
import axios from '@utils/axios'
import { BsPencilSquare, BsTrash } from 'react-icons/bs'
import usePersistStore from '@lib/store/persist'

interface Props {
    board: any
    setShowEditBoard: (show: boolean) => void
}

const BoardThumbnails: FC<Props> = ({ board, setShowEditBoard }) => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const postIds = board?.pins?.length > 0 ? board?.pins?.map((pin: { post_id: string }) => pin.post_id) : []
    // const postIds = board?.pins?.length > 0 ? board?.pins[0].post_id : []

    const request = {
        publicationIds: postIds,
        limit: 3,
    }

    const { data, loading, error, fetchMore } = usePublicationsByIdsQuery({
        variables: { request }
    });
    
    const pins = data?.publications?.items as PinstaPublication[]
    

    const deleteBoard = async (id: string) => {
        return await axios.post(`/delete-board`, { user_id: currentProfileId, board_id: id})
    }

    return (
        <>
            <div className='relative z-10 flex w-[240px] h-[160px] bg-gray-100 dark:bg-gray-800 rounded-lg'>
                <div className='w-[160px] flex h-[160px]'>
                    {pins && pins.length > 0 && (
                        <div
                            className='w-full h-full bg-cover bg-center rounded-l-lg'
                            style={{ backgroundImage: `url(${imageCdn(getThumbnailUrl(pins[0]), 'thumbnail_sm')})` }}
                        ></div>
                    )}
                </div>
                <div className='w-1/3'>
                    <div className='h-1/2 border-l-2 border-b-2 border-white dark:border-gray-900'>
                        {pins && pins.length > 1 && (
                            <div
                                className='w-full h-full bg-cover bg-center rounded-tr-lg'
                                style={{ backgroundImage: `url(${imageCdn(getThumbnailUrl(pins[1]), 'thumbnail_sm')})` }}
                            ></div>
                        )}
                    </div>
                    <div className='h-1/2 border-l-2 border-white dark:border-gray-900'>
                        {pins && pins.length > 2 && (
                            <div
                                className='w-full h-full bg-cover bg-center rounded-br-lg'
                                style={{ backgroundImage: `url(${imageCdn(getThumbnailUrl(pins[2]), 'thumbnail_sm')})` }}
                            ></div>
                        )}
                    </div>
                </div>
                {/* <div className='absolute group-hover:flex space-x-3 hidden bottom-2 z-50 right-4'>
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
                </div> */}
            </div>
        </>
    )
}

export default BoardThumbnails