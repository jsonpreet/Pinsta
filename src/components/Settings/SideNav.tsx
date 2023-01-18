import { Profile } from '@utils/lens/generated'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import clsx from 'clsx'
import { BiUser } from 'react-icons/bi'
import { BsBookmarkCheck, BsShieldLock } from 'react-icons/bs'
import { IoWarningOutline } from "react-icons/io5";
import ProfilePicture from './ProfilePicture'
import { SETTINGS, SETTINGS_DANGER_ZONE, SETTINGS_INTERESTS, SETTINGS_PERMISSIONS } from '@utils/paths'
import IsVerified from '@components/UI/IsVerified'

interface Props {
    profile: Profile
}

const SideNav: FC<Props> = ({ profile }) => {
    const router = useRouter()
    const isActivePath = (path: string) => router.pathname === path
    return (
        <>
            <div className=" bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-xl dark:bg-theme">
                <div className="flex flex-col items-center py-4 space-y-2">
                    <ProfilePicture profile={profile} />
                    <div className='flex flex-col items-center'>
                        {profile ? <h3 className='font-semibold'>{profile?.name}</h3> : null}
                        <h6 className="flex items-center">
                            <span>{profile?.handle}</span>
                            <IsVerified id={profile?.id} size="xs" />
                        </h6>
                    </div>
                </div>
                <div className="flex flex-col my-1 text-sm">
                    <Link
                    href={SETTINGS}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white',
                        { 'bg-gray-800 dark:bg-gray-700 text-white': isActivePath(SETTINGS) }
                    )}
                    >
                        <BiUser className="w-4 h-4" /> <span>Basic Info</span>
                    </Link>
                    <Link
                    href={SETTINGS_PERMISSIONS}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white',
                        {
                        'bg-gray-800 dark:bg-gray-700 text-white': isActivePath(SETTINGS_PERMISSIONS)
                        }
                    )}
                    >
                        <BsShieldLock className="w-4 h-4" /> <span>Permissions</span>
                    </Link>
                    <Link
                    href={SETTINGS_INTERESTS}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white',
                        {
                        'bg-gray-800 dark:bg-gray-700 text-white': isActivePath(SETTINGS_INTERESTS)
                        }
                    )}
                    >
                        <BsBookmarkCheck className="w-4 h-4" /> <span>Interests</span>
                    </Link>
                    <Link
                    href={SETTINGS_DANGER_ZONE}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-red-100 text-red-500 dark:hover:bg-gray-700',
                        {
                        'bg-red-100  dark:bg-gray-700':
                            isActivePath(SETTINGS_DANGER_ZONE)
                        }
                    )}
                    >
                        <IoWarningOutline className="w-4 h-4" /> <span>Danger Zone</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SideNav