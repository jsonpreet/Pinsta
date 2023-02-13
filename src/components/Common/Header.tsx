/* eslint-disable @next/next/no-img-element */
import { Button } from '@components/UI/Button'
import clsx from 'clsx'
import type { FC } from 'react'
import { useState } from 'react'
import Login from '@components/Common/Auth/Login'
import { BsBell, BsSearch } from "react-icons/bs";
import GlobalSearchBar from '@components/Common/Search/GlobalSearchBar'
import { APP } from '@utils/constants';
import { HOME } from '@utils/paths';
import Link from 'next/link';
import { Menu } from '@components/Common/Menu'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import ThemeSwitch from '@components/Common/ThemeSwitch'
import Notifications from '@components/Notifications/Menu'
import CreateMenu from '@components/Common/Menu/CreateMenu'
import { Analytics } from '@utils/analytics'
import HelpMenu from './Menu/Help'
import { isBrowser } from 'react-device-detect';
import MessageIcon from '@components/Messages/MessageIcon'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const [showShowModal, setSearchModal] = useState(false)
  const currentProfileId = usePersistStore((state) => state.currentProfileId)
  const currentProfile = useAppStore((state) => state.currentProfile)


  return (
    <>
      <div
        className={clsx(
          'relative py-3 z-50 top-0 left-0 right-0 flex-shrink-0 flex w-full items-center header-glassy bg-white',
          className
        )}
      >
        <div className="w-full">
          <div className="flex px-4 md:px-8 items-center justify-between w-full">
            <div className='flex items-center'>
              <div className="mr-1">
                <Link
                  onClick={() => {
                    Analytics.track('clicked_on_header_logo')
                  }}
                  href={HOME}
                  className="flex space-x-2 items-center"
                >
                  <img
                    src={`/logo.png`}
                    draggable={false}
                    className="w-8 h-8"
                    alt={APP.Name}
                  />
                  <span className='font-black text-xl lg:text-3xl tracking-wider text-gray-800 dark:text-white uppercase inline-flex'>Pinsta</span>
                </Link>
              </div>
              <Menu/>
            </div>
            <div className="hidden md:block flex-1 mr-6">
              <GlobalSearchBar />
            </div>
            <div className="flex flex-row items-center justify-end space-x-2 md:space-x-3">
              {currentProfileId && currentProfile ?
                <>
                  <CreateMenu/>
                  { isBrowser ? 
                    <Notifications />
                  : 
                    <div>
                      <Link
                        href="/notifications"
                        className="mx-2 flex space-x-1 relative"
                      >
                        <span>
                          <BsBell size={24} />
                        </span>
                      </Link>
                    </div>
                  }
                  <MessageIcon/>
                </>
              
              :  <ThemeSwitch /> //<ThemeSwitch />
              }   
              <Login />
              <HelpMenu/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header