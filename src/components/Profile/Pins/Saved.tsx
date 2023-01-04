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

interface Props {
    profile: Profile
}

const Saved: FC<Props> = ({ profile }) => {
    const { isFetched, isLoading, isError, data } = FetchProfileBoards(profile?.id)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    
    //if(isFetched && data.length === 0) return <NoDataFound isCenter withImage text="No pins found" />

    if (isLoading) {
        return (
            <>
                <div className='my-6'>
                    <Loader size='md' />
                </div>
            </>
        )
    } 

    const boards = data as BoardType[]
    console.log(boards)
    return (
        <>
            <div className='flex flex-col space-y-6'>
                {isFetched ?
                    <div className="grid grid-cols-6 gap-4">
                        {boards.map((board, index) => {
                            {
                                const showPrivateBoard = currentProfileId === profile?.id && board.is_private === true ? true : false
                                if (showPrivateBoard) return null
                            }
                            return (
                                <Board key={index} profile={profile} board={board} />
                            )
                        })}
                    </div>
                    : null
                }
                <AllPins profile={profile} />
            </div>
        </>
    )
}

export default Saved