/* eslint-disable @next/next/no-img-element */
import DropMenu from '@components/UI/DropMenu'
import { Analytics, TRACK } from '@utils/analytics'
import Link from 'next/link'
import React from 'react'
import { BsFillPatchQuestionFill } from 'react-icons/bs'
import { FaDiscord, FaTwitter } from "react-icons/fa";

const HelpMenu = () => {
    return (
        <>
            <DropMenu
                trigger={
                <button
                    className="!p-0 flex-none ml-1"
                    onClick={() => {
                        Analytics.track(TRACK.CLICK_HELP_MENU.OPEN)
                    }}
                >
                    <BsFillPatchQuestionFill size={24} />
                </button>
                }
            >
                <div className="mt-1.5 w-44 focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow max-h-96 overflow-hidden py-1 border border-gray-100 rounded-xl dark:border-gray-700 dark:bg-gray-800 bg-white">
                    <div className="flex flex-col items-center divide-y divide-gray-100 dark:divide-gray-700">
                        <Link
                            onClick={() => {
                                Analytics.track(TRACK.CLICK_HELP_MENU.LENSTER)
                            }}
                            href="/lenster"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='flex space-x-2 items-center py-2 px-4 w-full hover:bg-gray-100 duration-75 delay-75'
                        >
                            <img
                                src='/brands/lenster.svg'
                                alt='Lenster'
                                width={18}
                            />
                            <span>Lenster</span>
                        </Link>
                        <Link
                            onClick={() => {
                                Analytics.track(TRACK.CLICK_HELP_MENU.DISCORD)
                            }}
                            href="/discord"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='flex space-x-2 items-center py-2 px-4 w-full hover:bg-gray-100 duration-75 delay-75'
                        >
                            <FaDiscord size={18} />
                            <span>Discord</span>
                        </Link>
                        <Link
                            onClick={() => {
                                Analytics.track(TRACK.CLICK_HELP_MENU.TWITTER)
                            }}
                            href="/twitter"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='flex space-x-2 items-center py-2 px-4 w-full hover:bg-gray-100 duration-75 delay-75'
                        >
                            <FaTwitter size={18} />
                            <span>Twitter</span>
                        </Link>
                    </div>
                </div>
            </DropMenu>

        </>
    )
}

export default HelpMenu