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

interface Props {
    profile: Profile
}

const SideNav: FC<Props> = ({ profile }) => {
    const router = useRouter()
    const isActivePath = (path: string) => router.pathname === path
    return (
        <>
            <div className=" bg-gray-50 border border-gray-200 rounded-xl dark:bg-theme">
                <div className="flex flex-col items-center py-4 space-y-2">
                    <ProfilePicture profile={profile} />
                </div>
                <div className="flex flex-col my-1 text-sm">
                    <Link
                    href={SETTINGS}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-gray-800 hover:text-white',
                        { 'bg-gray-800 text-white': isActivePath(SETTINGS) }
                    )}
                    >
                        <BiUser className="w-4 h-4" /> <span>Basic Info</span>
                    </Link>
                    <Link
                    href={SETTINGS_PERMISSIONS}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-gray-800 hover:text-white',
                        {
                        'bg-gray-800 text-white': isActivePath(SETTINGS_PERMISSIONS)
                        }
                    )}
                    >
                        <BsShieldLock className="w-4 h-4" /> <span>Permissions</span>
                    </Link>
                    <Link
                    href={SETTINGS_INTERESTS}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-gray-800 hover:text-white',
                        {
                        'bg-gray-800 text-white': isActivePath(SETTINGS_INTERESTS)
                        }
                    )}
                    >
                        <BsBookmarkCheck className="w-4 h-4" /> <span>Interests</span>
                    </Link>
                    <Link
                    href={SETTINGS_DANGER_ZONE}
                    className={clsx(
                        'flex items-center p-3 space-x-2 hover:bg-red-100 text-red-500 hover:dark:bg-red-900/60',
                        {
                        'bg-red-100 dark:bg-red-900/60':
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