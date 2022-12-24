import { Button } from '@components/Shared/Button'
import DropMenu, { NextLink } from '@components/Shared/DropMenu'
import { Menu } from '@headlessui/react'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import type { Profile } from '@utils/lens'
import { useAllProfilesLazyQuery } from '@utils/lens'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from '@utils/custom-types'
import { IS_MAINNET } from '@utils/constants'
import clearLocalStorage from '@utils/functions/clearLocalStorage'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { useAccount, useDisconnect } from 'wagmi'
import { BsChevronLeft, BsBell, BsGear, BsMoon, BsPersonCircle, BsPlusCircle, BsShuffle, BsSun, BsPower } from "react-icons/bs";
import { BiExit } from 'react-icons/bi'

const UserMenu = () => {
  //const setChannels = useAppStore((state) => state.setChannels)
  const setShowCreateChannel = useAppStore((state) => state.setShowCreateChannel)
  //const channels = useAppStore((state) => state.channels)
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
  const currentProfile = useAppStore((state) => state.currentProfile as Profile)
  const setCurrentProfileId = usePersistStore((state) => state.setCurrentProfileId)

  const { theme, setTheme } = useTheme()

  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message || error?.message)
    }
  })
  const [getChannels] = useAllProfilesLazyQuery()
  const { address } = useAccount()

  const logout = () => {
    setCurrentProfile(null)
    setCurrentProfileId(null)
    clearLocalStorage()
    disconnect?.()
  }

  const onSelectChannel = (channel: Profile) => {
    setCurrentProfile(channel)
    setCurrentProfileId(channel.id)
    setShowAccountSwitcher(false)
  }

  const onSelectSwitchChannel = async () => {
    try {
      setShowAccountSwitcher(true)
      const { data } = await getChannels({
        variables: {
          request: { ownedBy: [address] }
        },
        fetchPolicy: 'no-cache'
      })
      const allChannels = data?.profiles?.items as Profile[]
      //setChannels(allChannels)
    } catch {}
  }

  return (
    <>
      <Button
        variant='secondary'
      >
        <BsBell size={24} />
      </Button>
      <DropMenu
        trigger={
          <Button
            className="!p-0 flex-none"
          >
            <img
              className="object-cover focus:ring-0 focus-visible:outline-none focus:outline-none bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
              src={getProfilePicture(currentProfile)}
              alt={currentProfile.handle}
              draggable={false}
            />
          </Button>
        }
      >
        <div className="mt-1.5 w-56 divide-y focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow max-h-96 divide-gray-200 dark:divide-gray-800 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-800 dark:bg-gray-800 bg-white">
          {showAccountSwitcher ? (
            <>
              <button
                type="button"
                className="flex opacity-70 pl-2 outline-none items-center space-x-2"
                onClick={() => setShowAccountSwitcher(false)}
              >
                <BsChevronLeft className="w-3 h-3" />
                <span className="py-2 text-sm">Channels</span>
              </button>
              {/* <div className="py-1 text-sm">
                {channels?.map((channel) => (
                  <button
                    type="button"
                    className="flex w-full justify-between items-center px-2 py-1.5 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    key={channel.id}
                    onClick={() => onSelectChannel(channel)}
                  >
                    <span className="inline-flex items-center space-x-1.5">
                      <img
                        className="w-6 h-6 rounded-lg"
                        src={getProfilePicture(channel)}
                        alt={channel.handle}
                        draggable={false}
                      />
                      <span className="truncate whitespace-nowrap">
                        {channel.handle}
                      </span>
                    </span>
                    {selectedChannel?.id === channel.id && (
                      <CheckOutline className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div> */}
            </>
          ) : (
            <>
              <div className="flex flex-col bg-white focus:ring-0 focus:outline-none dark:bg-gray-800 space-y-1 text-sm transition duration-150 ease-in-out rounded-lg">
                <div className="inline-flex items-center p-3 py-3 space-x-2">
                  <img
                    className="object-cover rounded-full w-9 h-9"
                    src={getProfilePicture(currentProfile, 'avatar')}
                    alt={currentProfile.handle}
                    draggable={false}
                  />
                  <div className="grid">
                    <span className="text-xs opacity-70">Connected as</span>
                    <h6
                      title={currentProfile?.handle}
                      className="text-base truncate leading-4"
                    >
                      {currentProfile?.handle}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="py-1 text-sm">
                {currentProfile && (
                  <>
                    <Menu.Item
                      as={NextLink}
                      href={`/${currentProfile?.handle}`}
                      className="inline-flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-black duration-75 delay-75"
                    >
                      <BsPersonCircle className="w-4 h-4" />
                      <span className="truncate whitespace-nowrap">
                        My Profile
                      </span>
                    </Menu.Item>
                  </>
                )}
                {!IS_MAINNET && (
                  <button
                    type="button"
                    className="flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-black duration-75 delay-75"
                    onClick={() => setShowCreateChannel(true)}
                  >
                    <BsPlusCircle className="w-4 h-4" />
                    <span className="truncate whitespace-nowrap">
                      Create Profile
                    </span>
                  </button>
                )}
                <Link
                  href="/settings"
                  className="flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-black duration-75 delay-75"
                >
                  <BsGear className="w-4 h-4" />
                  <span className="truncate whitespace-nowrap">
                    Account Settings
                  </span>
                </Link>
                <button
                  type="button"
                  className="flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-black duration-75 delay-75"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <BsSun className="w-4 h-4" />
                  ) : (
                    <BsMoon className="w-4 h-4" />
                  )}
                  <span className="truncate whitespace-nowrap">
                    {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 space-x-2 hover:bg-gray-100 dark:hover:bg-black duration-75 delay-75"
                  onClick={() => logout()}
                >
                  <BiExit className="w-4 h-4" />
                  <span className="truncate whitespace-nowrap">Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </DropMenu>
    </>
  )
}

export default UserMenu