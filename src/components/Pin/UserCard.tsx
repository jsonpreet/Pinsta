import IsVerified from '@components/Common/IsVerified'
import { PinstaPublication } from '@utils/custom-types'
import { formatNumber } from '@utils/functions/formatNumber'
import getProfilePicture from '@utils/functions/getProfilePicture'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

type Props = {
  pin: PinstaPublication
}

const UserCard: FC<Props> = ({ pin }) => {
    console.log('pin', pin)
    return (
        <>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-center'>
                    <div className='image bg-gray-300 shadow rounded-full w-12 h-12'>
                        {/* <UserImage classes='w-12 shadow h-12' username={profile?.Username} profile={profile} /> */}
                        <Link href={`/${pin.profile.handle}`}>
                            <Image
                                className={`rounded-full border border-gray-200 w-12 shadow h-12`}
                                alt={`${pin.profile.handle}'s profile picture`}
                                width={48}
                                height={48}
                                src={getProfilePicture(pin.profile)}
                            />
                        </Link>
                    </div>
                    <div className='flex flex-col ml-2 items-start justify-center'>
                        <div>
                            <Link href={`/${pin.profile.handle}`} className='flex flex-row justify-center items-center'>
                                <span className="mr-1 text-black hover:text-red-500 font-semibold leading-none">{pin.profile.name ?? pin.profile.handle}</span>
                                <IsVerified id={pin?.id} />
                            </Link>
                        </div>
                        <div>
                            <span className='text-black text-sm leading-none'>{formatNumber(pin.profile.stats.totalFollowers)} Followers</span>
                        </div>
                    </div>
                </div>
                <div className='follow -mt-2'>
                    {/* <Follow user={user} profile={profile} /> */}
                </div>
            </div>
        </>
    )
}

export default UserCard