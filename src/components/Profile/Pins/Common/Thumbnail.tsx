/* eslint-disable @next/next/no-img-element */
import { PinstaPublication } from '@utils/custom-types'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import { usePublicationsByIdsQuery } from '@utils/lens/generated'
import React, { FC } from 'react'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import { THUMBNAIL_SM } from '@utils/constants'

interface Props {
    board: any
    setShowEditBoard: (show: boolean) => void
}

const BoardThumbnail: FC<Props> = ({ board, setShowEditBoard }) => {
    
    return (
        <>
            <div className='relative z-10 flex w-full h-60 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden'>
                <div className='flex w-full h-full'>
                    <div
                        className='w-full h-full bg-cover bg-center'
                        style={{ backgroundImage: `url(${imageCdn(board?.pfp, THUMBNAIL_SM)})` }}
                    ></div>
                </div>
            </div>
        </>
    )
}

export default BoardThumbnail