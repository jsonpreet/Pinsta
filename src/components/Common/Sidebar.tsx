import clsx from 'clsx'
import useAppStore from "@lib/store"
import usePersistStore from "@lib/store/persist"
import { APP, LENS_CUSTOM_FILTERS } from "@utils/constants"
import { useNotificationCountQuery } from "@utils/lens"
import { EXPLORE, HOME, LATEST, MESSAGES, NOTIFICATIONS } from "@utils/paths"
import Link from "next/link"
import { useRouter } from "next/router"
import { HiBell, HiChatBubbleLeftEllipsis, HiClock, HiHome, HiUserGroup } from "react-icons/hi2";

const Sidebar = () => {
    const router = useRouter()
    const hasNewNotification = useAppStore((state) => state.hasNewNotification)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const notificationCount = usePersistStore((state) => state.notificationCount)
    const setNotificationCount = usePersistStore(
        (state) => state.setNotificationCount
    )
    const setHasNewNotification = useAppStore(
        (state) => state.setHasNewNotification
    )

    const isActivePath = (path: string) => router.pathname === path

    useNotificationCountQuery({
        variables: {
            request: {
                profileId: currentProfile?.id,
                customFilters: LENS_CUSTOM_FILTERS
            }
        },
        skip: !currentProfile?.id,
        onCompleted: (notificationsData) => {
            if (currentProfile && notificationsData) {
                const currentCount =
                notificationsData?.notifications?.pageInfo?.totalCount
                const totalCount = notificationsData?.notifications?.pageInfo
                ?.totalCount as number
                setHasNewNotification(notificationCount !== currentCount)
                setNotificationCount(totalCount)
            }
        }
    })
    return (
        <>
            <div className="flex flex-col w-52 py-4 bg-white h-screen items-start justify-start z-10 text-[14px] border-r border-gray-200 tracking-wide">
                <Link
                    href={HOME}
                    className="flex space-x-2 px-8 mt-1 items-center"
                >
                    <img
                        src={`/logo.png`}
                        draggable={false}
                        className="w-8 h-8"
                        alt={APP.Name}
                    />
                    <span className='font-bold text-3xl brandGradientText uppercase'>Pinsta</span>
                </Link>
                <div className="flex my-6 flex-col space-y-2 w-full">
                    <div>
                        <Link
                            href={HOME}
                            className={clsx(
                                'flex items-center px-8 py-2.5 group border-r-4 -mr-[2px]',
                                isActivePath(HOME) ?
                                    'bg-red-600 hover:bg-gray-700 border-red-700' : 'hover:bg-gray-700 border-transparent'
                            )}
                        >
                            <HiHome
                                size={20}
                                className={clsx(
                                    'mr-4',
                                    isActivePath(HOME) ? 'text-white' : 'group-hover:text-white text-gray-500'
                                )}
                            />
                            <span
                                className={clsx(
                                    isActivePath(HOME) ? 'text-white font-semibold' : 'group-hover:text-white text-gray-500'
                                )}
                            >
                                Home
                            </span>
                        </Link>
                    </div>
                    <div>
                        <Link
                            href={LATEST}
                            className={clsx(
                                'flex items-center px-8 py-2.5 border-r-4 group -mr-[2px]',
                                isActivePath(LATEST) ?
                                    'bg-red-600 hover:bg-gray-700 border-red-700' : 'hover:bg-gray-700 border-transparent'
                            )}
                        >
                            <HiClock 
                                size={20}
                                className={clsx(
                                    'mr-4',
                                    isActivePath(LATEST) ? 'text-white' : 'group-hover:text-white text-gray-500'
                                )}
                            />
                            <span
                                className={clsx(
                                    isActivePath(LATEST) ? 'text-white font-semibold' : 'group-hover:text-white text-gray-500'
                                )}
                            >
                                Recent
                            </span>
                        </Link>
                    </div>
                    <div>
                        <Link
                            href={EXPLORE}
                            className={clsx(
                                'flex items-center px-8 py-2.5 border-r-4 group -mr-[2px]',
                                isActivePath(EXPLORE) ?
                                    'bg-red-600 hover:bg-gray-700 border-red-700' : 'hover:bg-gray-700 border-transparent'
                            )}
                        >
                            <HiUserGroup 
                                size={20}
                                className={clsx(
                                    'mr-4',
                                    isActivePath(EXPLORE) ? 'text-white' : 'group-hover:text-white text-gray-500'
                                )}
                            />
                            <span
                                className={clsx(
                                    isActivePath(EXPLORE) ? 'text-white font-semibold' : 'group-hover:text-white text-gray-500'
                                )}
                            >
                                Following
                            </span>
                        </Link>
                    </div>
                    {currentProfileId ? (
                        <>
                            <div>
                                <Link
                                    href={MESSAGES}
                                    className={clsx(
                                        'flex items-center px-8 py-2.5 border-r-4 group -mr-[2px]',
                                        isActivePath(MESSAGES) ?
                                            'bg-red-600 hover:bg-gray-700 border-red-700' : 'hover:bg-gray-700 border-transparent'
                                    )}
                                >
                                    <HiChatBubbleLeftEllipsis 
                                        size={20}
                                        className={clsx(
                                            'mr-4',
                                            isActivePath(MESSAGES) ? 'text-white' : 'group-hover:text-white text-gray-500'
                                        )}
                                    />
                                    <span
                                        className={clsx(
                                            isActivePath(MESSAGES) ? 'text-white font-semibold' : 'group-hover:text-white text-gray-500'
                                        )}
                                    >
                                        Messages
                                    </span>
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={NOTIFICATIONS}
                                    className={clsx(
                                        'flex items-center px-8 py-2.5 border-r-4 group -mr-[2px]',
                                        isActivePath(NOTIFICATIONS) ?
                                            'bg-red-600 hover:bg-gray-700 border-red-700' : 'hover:bg-gray-700 border-transparent'
                                    )}
                                >
                                    <HiBell 
                                        size={20}
                                        className={clsx(
                                            'mr-4',
                                            isActivePath(NOTIFICATIONS) ?
                                                'text-white' :
                                                hasNewNotification ?
                                                    'text-red-600' :
                                                    'group-hover:text-white text-gray-500'
                                        )}
                                    />
                                    <span
                                        className={clsx(
                                            'relative',
                                            isActivePath(NOTIFICATIONS) ? 'text-white font-semibold' : 'group-hover:text-white text-gray-500'
                                        )}
                                    >
                                        Notifications
                                    </span>
                                </Link>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default Sidebar