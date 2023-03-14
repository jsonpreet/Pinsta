import MetaTags from '@components/Common/MetaTags'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import BoardInfo from './Info'
import BoardPins from './Pins'
import formatHandle from '@utils/functions/formatHandle'
import useAppStore from '@lib/store'
import { Profile, useProfileQuery } from '@utils/lens/generated'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Analytics, TRACK } from '@utils/analytics'
import truncate from '@utils/functions/truncate'

interface Props {
    board: any
}

const Board: NextPage<Props> = ({ board }) => {
    const { query } = useRouter()
    const username = query.username ?? ''
    const handle = formatHandle(username as string, true);
    const currentProfile = useAppStore((state) => state.currentProfile)
    
    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.BOARD)
    }, [])

    const { data, loading, error } = useProfileQuery({
        variables: {
        request: { handle },
            who: currentProfile?.id ?? null
        },
        skip: !handle
    })


    const postIds = board?.pins?.map((pin: { post_id: string }) => pin.post_id)

    //if (!data?.profile) return <Custom404 />
    
    const userProfile = data?.profile as Profile

    return (
        <>
            <MetaTags
                title={`${truncate(board?.name, 60)} :: Pinsta`}
                description={truncate(board?.description as string, 100)}
            />
            <div className='flex flex-col'>
                {userProfile ?
                    <>
                        <BoardInfo profile={userProfile} board={board} />
                        <BoardPins postIds={postIds} board={board} />
                    </>
                    : <TimelineShimmer/>
                }
            </div>
        </>
    )
}

export default Board