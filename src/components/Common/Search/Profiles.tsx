import type { Profile } from '@utils/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { BiUser } from 'react-icons/bi'
import { formatNumber } from '@utils/functions/formatNumber'
import getProfilePicture from '@utils/functions/getProfilePicture'

import IsVerified from '../../UI/IsVerified'
import formatHandle from '@utils/functions/formatHandle'

interface Props {
  results: Profile[]
  loading: boolean
  clearSearch: () => void
}

const Profiles: FC<Props> = ({ results, loading, clearSearch }) => {
    return (
        <>
            {results?.map((profile: Profile) => (
                <div
                    onClick={() => clearSearch()}
                    key={profile.id}
                    className="relative pl-3 pr-4 cursor-default select-none hover:bg-gray-100 dark:hover:bg-gray-900"
                    role="button"
                >
                    <Link
                        href={`/${formatHandle(profile?.handle)}`}
                        key={profile?.handle}
                        className="flex flex-col justify-center py-2 space-y-1 rounded-xl"
                    >
                        <span className="flex items-center justify-between">
                            <div className="inline-flex items-center w-3/4 space-x-2">
                                <img
                                className="w-7 h-7 rounded-full"
                                src={getProfilePicture(profile, 'avatar')}
                                draggable={false}
                                alt="pfp"
                                />
                                <div className="flex items-center space-x-1">
                                <p className="text-base truncate line-clamp-1">
                                    <span>{profile?.name ?? formatHandle(profile?.handle)}</span>
                                </p>
                                    <IsVerified id={profile?.id} size="sm" />
                                </div>
                            </div>
                            <span className="inline-flex items-center space-x-1 text-xs whitespace-nowrap opacity-60">
                                <BiUser />
                                <span>{formatNumber(profile.stats.totalFollowers)}</span>
                            </span>
                        </span>
                    </Link>
                </div>
            ))}
            {!results?.length && !loading && (
                <div className="relative p-5 text-center cursor-default select-none">
                No results found.
                </div>
            )}
        </>
    )
}

export default Profiles