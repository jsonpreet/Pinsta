import { NoDataFound } from '@components/UI/NoDataFound';
import { Board as BoardType } from '@utils/custom-types';
import { Profile  } from '@utils/lens/generated'
import {FC, useEffect, useState} from 'react'
import Board from './Common/Board';
import { Loader } from '@components/UI/Loader';
import { PINSTA_API_URL } from '@utils/constants';
import { FetchProfileBoards } from '@lib/db/actions';

interface Props {
    profile: Profile
}

const Saved: FC<Props> = ({ profile }) => {
    const { isFetched, isLoading, isError, data } = FetchProfileBoards(profile?.id)
    
    if(isFetched && data.length === 0) return <NoDataFound isCenter withImage text="No pins found" />

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
    
    return (
        <>
            <div className="grid grid-cols-6 gap-4">
                {boards.map((board, index)  => (
                    <Board key={index} profile={profile} board={board} />
                ))}
            </div>
        </>
    )
}

export default Saved