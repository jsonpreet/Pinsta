import MessageIcon from '@components/Messages/MessageIcon'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics } from '@utils/analytics'
import { EXPLORE, HOME, LATEST, SEARCH } from '@utils/paths'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FiCompass, FiHome, FiSearch, FiZap } from 'react-icons/fi'

const MobileMenu = () => {
    const router = useRouter()
    const setShowSearchModal = useAppStore((state) => state.setShowSearchModal)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)

    const isActivePath = (path: string) => router.pathname === path

    const MenuItems = [
        {
            route: HOME,
            label: 'Home',
            icon: <FiHome size={22} />
        },
        {
            route: LATEST,
            label: 'Latest',
            icon: <FiZap size={22} />
        },
        {
            route: EXPLORE,
            label: 'Explore',
            icon: <FiCompass size={22} />
        }
    ]

    const MenuLink = ({ isActive, route, children }: { isActive: boolean, route: string, children: React.ReactNode }) => {
        return (
            <Link
                onClick={() => {
                    Analytics.track(`clicked_on_menu_link_${route}`)
                }}
                href={route}
                className={clsx(
                    'flex items-center px-4 py-2 focus-visible:outline-none focus:outline-none rounded-full group duration-75 delay-75',
                    isActive ?
                        'bg-white hover:bg-white' :
                        'hover:bg-white'
                )}
            >
                <span
                    className={clsx(
                        isActive ?
                            'text-gray-900 ' :
                            'group-hover:text-gray-900 text-white font-semibold duration-75 delay-75'
                    )}
                >
                    {children}
                </span>
            </Link>
        )
    }

    return (
        <>
            <div
                className={clsx(
                    "fixed w-full dropdown-shadow rounded-full mx-auto p-2 bg-gradient-to-r from-[#df3f95] to-[#ec1e25] bottom-4 left-0 right-0 z-50",
                    currentProfileId && currentProfile ? ' max-w-[84%]' : 'max-w-[74%]'
                )}
            >
                <div className='flex justify-center space-x-2'>
                    {MenuItems && MenuItems.map((item) => (
                        <div key={item.route}>
                            <MenuLink isActive={isActivePath(item.route)} route={item.route}>
                                {item.icon}
                            </MenuLink>
                        </div>
                    ))}
                    <button 
                        onClick={() => {
                            setShowSearchModal(true)
                            Analytics.track('clicked_on_menu_link_search')
                        }}
                        className='flex items-center px-4 py-2 focus-visible:outline-none focus:outline-none rounded-full group duration-75 delay-75 hover:bg-white'
                    >
                        <FiSearch size={22} className='group-hover:text-gray-900 text-white font-semibold duration-75 delay-75' />
                    </button>
                    {
                        currentProfileId && currentProfile ?
                            <MessageIcon />
                            : null
                    }
                    
                </div>
            </div>
        </>
    )
}

export default MobileMenu