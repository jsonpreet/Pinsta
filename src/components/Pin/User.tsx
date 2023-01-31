import IsVerified from '@components/UI/IsVerified'
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
import { Analytics } from '@utils/analytics'
import { RiArrowLeftRightFill } from 'react-icons/ri'

type Props = {
  pin: PinstaPublication
}

const User: FC<Props> = ({ pin }) => {
    const isMirror = pin.__typename === 'Mirror'
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [following, setFollowing] = useState(isMirror ? pin?.mirrorOf?.profile?.isFollowedByMe : pin?.profile?.isFollowedByMe);
    const followType = isMirror ? pin?.mirrorOf?.profile?.followModule?.__typename : pin?.profile?.followModule?.__typename;
    const profile = isMirror ? pin?.mirrorOf?.profile : pin?.profile;
    const mirrorProfile = isMirror ? pin?.profile : null;
    return (
        <>
            {isMirror ? 
                <>
                    <div className='flex justify-start text-sm space-x-1 pb-4 w-full items-center'>
                        <RiArrowLeftRightFill
                            size={18}
                        />
                        <span>
                            mirrored by
                            <Link
                                href={`/${formatHandle(mirrorProfile?.handle)}`}
                                className='ml-1 font-semibold'
                            >
                                {mirrorProfile?.name ?? formatHandle(mirrorProfile?.handle)}
                            </Link>
                        </span>
                    </div>    
                </>
            : null}
            <div className='flex justify-between w-full items-center'>
                <div className='flex justify-center'>
                    <div className='image bg-gray-300 dark:bg-gray-900 rounded-full w-12 h-12'>
                        <Link 
                            onClick={() => {
                                Analytics.track('clicked_from_pin_profile_image_link', {
                                    profileId: profile?.id,
                                    profileHandle: profile?.handle,
                                });
                            }}
                            href={`/${formatHandle(profile?.handle)}`}
                        >
                            <Image
                                className={`rounded-full w-12 h-12`}
                                alt={`${formatHandle(profile?.handle)}'s profile picture`}
                                width={48}
                                height={48}
                                src={getProfilePicture(profile, 'avatar')}
                            />
                        </Link>
                    </div>
                    <div className='flex flex-col ml-2 items-start justify-center'>
                        <div>
                            <Link 
                                onClick={() => {
                                    Analytics.track('clicked_from_pin_profile_link', {
                                        profileId: profile?.id,
                                        profileHandle: profile?.handle,
                                    });
                                }}
                                href={`/${formatHandle(profile?.handle)}`} 
                                className='flex justify-center items-center'
                            >
                                <span className="dark:text-white text-black hover:text-red-500 font-semibold leading-none">{profile?.name ?? formatHandle(profile?.handle)}</span>
                                <IsVerified id={profile?.id} size='sm' />
                            </Link>
                        </div>
                        <div>
                            <span className='text-black dark:text-white text-sm leading-none'>{formatNumber(profile?.stats?.totalFollowers)} Followers</span>
                        </div>
                    </div>
                </div>
                <div className='follow'>
                    {currentProfile && currentProfile?.id !== profile?.id && profile?.isFollowing && (
                        <div className="py-0.5 px-2 text-xs bg-gray-200 rounded-full dark:bg-gray-700">Follows you</div>
                    )}
                    {
                        currentProfile && currentProfile?.id !== profile?.id &&
                        followType !== 'RevertFollowModuleSettings' ? (
                        following ? (
                            <div className="flex space-x-2">
                                <Unfollow profile={profile} setFollowing={setFollowing} showText />
                                {followType === 'FeeFollowModuleSettings' && (
                                    <SuperFollow profile={profile} setFollowing={setFollowing} again />
                                )}
                            </div>
                        ) : followType === 'FeeFollowModuleSettings' ? (
                            <div className="flex space-x-2">
                                <SuperFollow profile={profile} setFollowing={setFollowing} showText />
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Follow profile={profile} setFollowing={setFollowing} showText />
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