import { Button } from '@components/UI/Button'
import clsx from 'clsx'
import type { FC } from 'react'
import { useState } from 'react'
import Login from '@components/Common/Auth/Login'
import { BsSearch } from "react-icons/bs";
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
          'fixed py-3 z-30 top-0 left-0 right-0 flex-shrink-0 flex w-full items-center header-glassy bg-white',
          className
        )}
      >
        <div className="w-full">
          <div className="flex px-8 items-center justify-between w-full">
            <div className='flex items-center'>
              <div className="mr-1">
                <Link
                  href={HOME}
                  className="flex space-x-2 items-center"
                >
                  <img
                    src={`/logo.png`}
                    draggable={false}
                    className="w-8 h-8"
                    alt={APP.Name}
                  />
                  <span className='font-black text-3xl tracking-wider text-gray-800 dark:text-white uppercase hidden md:inline-flex'>Pinsta</span>
                </Link>
              </div>
              <Menu/>
            </div>
            <div className="hidden md:block w-[calc(100%-600px)]">
              <GlobalSearchBar />
            </div>
            <div className="flex flex-row items-center justify-end space-x-2 md:space-x-3">
              <Button
                variant="material"
                onClick={() => setSearchModal(true)}
                className="!p-[10px] md:hidden"
              >
                <BsSearch className="w-4 h-4" aria-hidden="true" />
              </Button>
              {!currentProfileId && !currentProfile ?
                <ThemeSwitch />
                :
                <>
                  <CreateMenu/>
                  <Notifications/>
                </>
              }   
              <Login />
            </div>
          </div>
        </div>

        {/* <Modal
          title="Search"
          onClose={() => setSearchModal(false)}
          show={showShowModal}
          panelClassName="max-w-md h-full"
        >
          <div className="max-h-[80vh] overflow-y-auto no-scrollbar">
            <GlobalSearchBar onSearchResults={() => setSearchModal(false)} />
          </div>
        </Modal> */}
      </div>
    </>
  )
}

export default Header