import IsVerified from '@components/Common/IsVerified'
import Follow from '@components/Common/Follow'
import SuperFollow from '@components/Common/SuperFollow'
import Unfollow from '@components/Common/Unfollow'
import useAppStore from '@lib/store'
import { PinstaPublication } from '@utils/custom-types'
import formatHandle from '@utils/functions/formatHandle'
import { formatNumber } from '@utils/functions/formatNumber'
import getProfilePicture from '@utils/functions/getProfilePicture'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC, useState } from 'react'

type Props = {
  pin: PinstaPublication
}

const User: FC<Props> = ({ pin }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [following, setFollowing] = useState(pin?.profile?.isFollowedByMe);
    const followType = pin?.profile?.followModule?.__typename;
    return (
        <>
            <div className='flex justify-between w-full items-center'>
                <div className='flex justify-center'>
                    <div className='image bg-gray-300 dark:bg-gray-900 rounded-full w-12 h-12'>
                        <Link href={`/${formatHandle(pin.profile?.handle)}`}>
                            <Image
                                className={`rounded-full w-12 h-12`}
                                alt={`${formatHandle(pin.profile?.handle)}'s profile picture`}
                                width={48}
                                height={48}
                                src={getProfilePicture(pin.profile)}
                            />
                        </Link>
                    </div>
                    <div className='flex flex-col ml-2 items-start justify-center'>
                        <div>
                            <Link href={`/${formatHandle(pin.profile?.handle)}`} className='flex justify-center items-center'>
                                <span className="mr-1 dark:text-white text-black hover:text-red-500 font-semibold leading-none">{pin.profile.name ?? formatHandle(pin.profile?.handle)}</span>
                                <IsVerified id={pin?.id} />
                            </Link>
                        </div>
                        <div>
                            <span className='text-black dark:text-white text-sm leading-none'>{formatNumber(pin.profile.stats.totalFollowers)} Followers</span>
                        </div>
                    </div>
                </div>
                <div className='follow '>
                    {currentProfile && currentProfile?.id !== pin?.profile?.id && pin?.profile?.isFollowing && (
                        <div className="py-0.5 px-2 text-xs bg-gray-200 rounded-full dark:bg-gray-700">Follows you</div>
                    )}
                    {
                        followType !== 'RevertFollowModuleSettings' ? (
                        following ? (
                        <div className="flex space-x-2">
                            <Unfollow profile={pin?.profile} setFollowing={setFollowing} showText />
                            {followType === 'FeeFollowModuleSettings' && (
                                <SuperFollow profile={pin?.profile} setFollowing={setFollowing} again />
                            )}
                        </div>
                        ) : followType === 'FeeFollowModuleSettings' ? (
                        <div className="flex space-x-2">
                            <SuperFollow profile={pin?.profile} setFollowing={setFollowing} showText />
                        </div>
                        ) : (
                        <div className="flex space-x-2">
                            <Follow profile={pin?.profile} setFollowing={setFollowing} showText />
                        </div>
                            )
                        ): null
                    }
                </div>
            </div>
        </>
    )
}

export default User