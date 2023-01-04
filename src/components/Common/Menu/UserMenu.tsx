/* eslint-disable @next/next/no-img-element */
import { Button } from '@components/UI/Button'
import DropMenu, { NextLink } from '@components/UI/DropMenu'
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
import { BsChevronLeft, BsBell, BsGear, BsMoon, BsPersonCircle, BsPlusCircle, BsShuffle, BsSun, BsPower, BsCheck } from "react-icons/bs";
import { BiExit } from 'react-icons/bi'
import formatHandle from '@utils/functions/formatHandle'
import { MdSwitchAccount } from 'react-icons/md'
import IsVerified from '../../UI/IsVerified'
import { Analytics } from '@utils/analytics'

const UserMenu = () => {
  const setProfiles = useAppStore((state) => state.setProfiles)
  const setShowCreateAccount = useAppStore((state) => state.setShowCreateAccount)
  const profiles = useAppStore((state) => state.profiles)
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
  const [getProfiles] = useAllProfilesLazyQuery()
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
      const { data } = await getProfiles({
        variables: {
          request: { ownedBy: [address] }
        },
        fetchPolicy: 'no-cache'
      })
      const allProfiles = data?.profiles?.items as Profile[]
      setProfiles(allProfiles)
    } catch {}
  }

  return (
    <>
      <DropMenu
        trigger={
          <Button
            className="!p-0 flex-none"
            onClick={() => {
              Analytics.track(`clicked_on_profile_menu`, { profile: currentProfile?.handle})
            }}
          >
            <img
              className="object-cover focus:ring-0 focus-visible:outline-none focus:outline-none bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
              src={getProfilePicture(currentProfile, 'avatar')}
              alt={currentProfile.handle}
              draggable={false}
            />
          </Button>
        }
      >
        <div className="mt-1.5 w-64 divide-y focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow max-h-96 divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-700 dark:bg-gray-800 bg-white">
          {showAccountSwitcher ? (
            <>
              <button
                type="button"
                className="flex opacity-70 pl-2 outline-none items-center space-x-2"
                onClick={() => setShowAccountSwitcher(false)}
              >
                <BsChevronLeft className="w-3 h-3" />
                <span className="py-2 text-sm">Profiles</span>
              </button>
              <div className="py-1 text-sm">
                {profiles?.map((profile) => (
                  <button
                    type="button"
                    className="flex w-full justify-between items-center p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    key={profile.id}
                    onClick={() => onSelectChannel(profile)}
                  >
                    <span className="inline-flex items-center space-x-1.5">
                      <img
                        className="w-6 h-6 rounded-lg"
                        src={getProfilePicture(profile)}
                        alt={profile.handle}
                        draggable={false}
                      />
                      <span className="truncate whitespace-nowrap">
                        {profile.handle}
                      </span>
                    </span>
                    {currentProfile?.id === profile.id && (
                      <BsCheck className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col bg-white focus:ring-0 focus:outline-none dark:bg-gray-800 space-y-1 text-sm transition duration-150 ease-in-out rounded-lg">
                <div className="inline-flex items-center p-3 py-3 space-x-2">
                  <img
                    className="object-cover rounded-full w-9 h-9"
                    src={getProfilePicture(currentProfile, 'avatar')}
                    alt={`${formatHandle(currentProfile?.handle)}'s profile picture`}
                    draggable={false}
                  />
                  <div className="grid">
                    <span className="text-xs opacity-70">Connected as</span>
                    <h6
                      title={currentProfile?.name ?? formatHandle(currentProfile?.handle)}
                      className="text-base flex space-x-1 items-center truncate leading-4"
                    >
                        <span>{currentProfile?.name ?? formatHandle(currentProfile?.handle)}</span>
                        <IsVerified id={currentProfile?.id} size='xs'/>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="py-1 text-sm">
                {currentProfile && (
                  <>
                    <Menu.Item
                      as={NextLink}
                      href={`/${formatHandle(currentProfile?.handle)}`}
                      className="inline-flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-900 duration-75 delay-75"
                    >
                      <BsPersonCircle className="w-4 h-4" />
                      <span className="truncate whitespace-nowrap">
                        My Profile
                      </span>
                    </Menu.Item>
                    <button
                      type="button"
                      className="inline-flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => onSelectSwitchChannel()}
                    >
                      <MdSwitchAccount className="w-4 h-4" />
                      <span className="truncate whitespace-nowrap">
                        Switch channel
                      </span>
                    </button>
                  </>
                )}
                {!IS_MAINNET && (
                  <button
                    type="button"
                    className="flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-900 duration-75 delay-75"
                    onClick={() => setShowCreateAccount(true)}
                  >
                    <BsPlusCircle className="w-4 h-4" />
                    <span className="truncate whitespace-nowrap">
                      Create Profile
                    </span>
                  </button>
                )}
                <Link
                  href="/settings"
                  className="flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-900 duration-75 delay-75"
                >
                  <BsGear className="w-4 h-4" />
                  <span className="truncate whitespace-nowrap">
                    Account Settings
                  </span>
                </Link>
                <button
                  type="button"
                  className="flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-900 duration-75 delay-75"
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
                  className="flex items-center w-full px-3 py-2 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-900 duration-75 delay-75"
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