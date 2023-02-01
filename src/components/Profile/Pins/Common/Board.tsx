/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react'
import dayjs from 'dayjs';
import formatTime from '@utils/functions/formatTime'
// @ts-ignore
import dayjsTwitter from 'dayjs-twitter';
import EditBoardModal from '@components/Common/Modals/EditBoard'
import Link from 'next/link'
import formatHandle from '@utils/functions/formatHandle'
import usePersistStore from '@lib/store/persist'
import BoardThumbnails from './Thumbnails'
import { Profile } from '@utils/lens/generated';

dayjs.extend(dayjsTwitter);

interface Props {
    board: any
    profile: Profile
}

const Board: FC<Props> = ({ board, profile }) => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const [showEditBoard, setShowEditBoard] = useState(false)
    if (board?.pins?.length === 0) {
        return null
    }

    return (
        <>
            <EditBoardModal board={board} show={showEditBoard} setShow={setShowEditBoard} />
            <div className="relative group">
                <Link
                    href={`/${formatHandle(profile?.handle)}/${board.slug}`}
                >
                    <BoardThumbnails board={board} setShowEditBoard={setShowEditBoard} />
                    <div className='flex flex-col space-y-1 mt-4'>
                        <h3 className='font-semibold text-base group-hover:text-red-500'>{board.name}</h3>
                        <div className='flex text-sm'>
                            <span>{`${board?.pins?.length} ${board?.pins?.length > 1 ? `Pins` : `Pin`}`}</span>
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