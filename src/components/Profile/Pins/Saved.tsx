import { NoDataFound } from '@components/UI/NoDataFound';
import { BoardType } from '@utils/custom-types';
import { Profile  } from '@utils/lens/generated'
import {FC, useEffect, useState} from 'react'
import Board from './Common/Board';
import { Loader } from '@components/UI/Loader';
import { PINSTA_API_URL } from '@utils/constants';
import { FetchProfileBoards, FetchProfilePins } from '@lib/db/actions';
import usePersistStore from '@lib/store/persist';
import AllPins from './All';
import { Analytics, TRACK } from '@utils/analytics';

interface Props {
    profile: Profile
}

const Saved: FC<Props> = ({ profile }) => {
    const { isFetched, isLoading, isError, data } = FetchProfileBoards(profile?.id)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const { isFetched: profilePinsFetched, isLoading: profilePinsLoading, isError: profilePinsError, refetch: refetchSavedPins, data: pins } = FetchProfilePins(profile?.id)
    
    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.SAVEDPIN)
    }, [])
    
    if (isLoading) {
        return (
            <>
                <div className='my-6'>
                    <Loader size='md' />
                </div>
            </>
        )
    } 

    if ((profilePinsFetched && isFetched && pins?.data?.length === 0 && data?.data?.length === 0) || (isError && profilePinsError)) {
        return <NoDataFound isCenter withImage text="No pins found" />
    }

    const boards = data?.data as BoardType[]
    return (
        <>
            <div className='flex flex-col space-y-6 px-4 md:px-0 pb-20 md:pb-0'>
                {isFetched ?
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mt-4 gap-4">
                        {boards?.map((board, index) => {
                            const showPrivateBoard = currentProfileId === board?.user_id ? false : board.is_private
                            if (showPrivateBoard) return null
                            return (
                                <Board key={index} profile={profile} board={board} />
                            )
                        })}
                    </div>
                    : null
                }
                {profilePinsFetched && pins?.data.length > 0 && <AllPins profile={profile} refetchSavedPins={refetchSavedPins} pins={pins?.data} />}
            </div>
        </>
    )
}

export default Saved