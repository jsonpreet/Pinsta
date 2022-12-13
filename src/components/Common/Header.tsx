import { Button } from '@components/Shared/Button'
import Modal from '@components/Shared/Modal'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import { useNotificationCountQuery } from '@utils/lens'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useState } from 'react'
import { LENS_CUSTOM_FILTERS } from '@utils/constants'

import Login from './Auth/Login'
import { BsSearch, BsBell } from "react-icons/bs";
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const { pathname } = useRouter()
  const [showShowModal, setSearchModal] = useState(false)
  const showFilter =
    pathname === '/' || pathname === '/explore' || pathname === '/feed'

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
    <div
      className={clsx(
        'sticky top-0 py-2.5 left-0 right-0 z-10 flex w-full items-center header-glassy',
        className
      )}
    >
      <div className="w-full">
        <div className="flex ultrawide:px-6 px-4 items-center justify-between w-full">
          <div className="md:w-[330px]">
            <Link href="/" className="flex space-x-2 items-center">
              <img
                src={`/logo.png`}
                draggable={false}
                className="w-10 h-10"
                alt="Pinsta"
              /> <span className='font-bold text-4xl brandGradientText uppercase'>Pinsta</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <GlobalSearchBar />
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:space-x-3 md:w-96">
            <Button
              variant="material"
              onClick={() => setSearchModal(true)}
              className="!p-[10px] md:hidden"
            >
              <BsSearch className="w-4 h-4" aria-hidden="true" />
            </Button>
            {currentProfileId ? (
              <>
                <Link
                  href="/"
                  className="relative pr-1"
                >
                  <Button variant="material" className="!p-[9px]">
                    <BsBell className="w-4 h-4" />
                    {hasNewNotification && (
                      <span className="absolute flex w-2 h-2 bg-red-500 rounded-full -top-1 -right-0.5" />
                    )}
                  </Button>
                </Link>
              </>
            ) : null}
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
  )
}

export default Header