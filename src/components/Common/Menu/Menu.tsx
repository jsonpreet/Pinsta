import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { EXPLORE, HOME, LATEST } from '@utils/paths'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'


const HeaderMenu = () => {
    const router = useRouter()
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const isActivePath = (path: string) => router.pathname === path

    const MenuItems = [
        {
            route: HOME,
            label: 'Home'
        },
        {
            route: LATEST,
            label: 'Latest'
        },
        {
            route: EXPLORE,
            label: 'Explore'
        }
    ]

    const MenuLink = ({ isActive, route, children }: { isActive: boolean, route: string, children: React.ReactNode }) => {
        return (
            <Link
                href={route}
                className={clsx(
                    'flex items-center px-5 py-1.5 focus-visible:outline-none focus:outline-none rounded-full group',
                    isActive ?
                        'bg-gray-900 hover:bg-gray-900 dark:bg-white dark:hover:bg-white' :
                        'dark:hover:bg-white hover:bg-gray-900'
                )}
            >
                <span
                    className={clsx(
                        isActive ?
                            'dark:text-gray-900 text-white ' :
                            'dark:group-hover:text-gray-900 group-hover:text-white text-gray-900 dark:text-white font-semibold'
                    )}
                >
                    {children}
                </span>
            </Link>
        )
    }

    return (
        <>
            <div className="flex space-x-1 mx-4">
                {MenuItems && MenuItems.map((item) => (
                    <div key={item.route}>
                        <MenuLink isActive={isActivePath(item.route)} route={item.route}>{item.label}</MenuLink>
                    </div>
                ))}
            </div>
        </>
    )
}

export default HeaderMenu