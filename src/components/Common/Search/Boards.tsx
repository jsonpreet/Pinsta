/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { BiSearch } from 'react-icons/bi'
import { BoardType } from '@utils/custom-types'

interface Props {
  results: BoardType[]
  loading: boolean
  clearSearch: () => void
}

const Boards: FC<Props> = ({ results, loading, clearSearch }) => {
    return (
        <>
            {results?.map((board: BoardType) => (
                <div
                    onClick={() => clearSearch()}
                    key={board.id}
                    className="relative px-4 md:rounded-none rounded-lg cursor-default select-none hover:bg-gray-100 dark:hover:bg-gray-800"
                    role="button"
                >
                    <Link
                        href={`/${board?.handle}/${board?.slug}`}
                        key={board?.id}
                        className="flex flex-col justify-center py-2 space-y-1 rounded-xl"
                    >
                        <span className="flex items-center justify-between">
                            <div className="inline-flex items-center w-3/4 space-x-2">
                                <div 
                                    className="w-7 h-7 flex items-center justify-center"
                                >
                                    <BiSearch size={18} />
                                </div>
                                <div className="flex items-center">
                                    <p className="text-sm truncate line-clamp-1">
                                        <span>{board?.name}</span>
                                    </p>
                                </div>
                            </div>
                        </span>
                    </Link>
                </div>
            ))}
        </>
    )
}

export default Boards