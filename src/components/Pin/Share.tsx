/* eslint-disable @next/next/no-img-element */
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsArrowLeftCircleFill } from 'react-icons/bs'
import { useDetectClickOutside } from 'react-detect-click-outside';
import { APP, PINSTA_SERVER_URL, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import { BoardType, PinstaPublication } from '@utils/custom-types'
import { exportPNG } from '@utils/functions/getExport'
import { HiOutlineDownload, HiOutlineLink } from 'react-icons/hi'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from 'next-share';
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { FiShare2 } from "react-icons/fi";
import formatHandle from '@utils/functions/formatHandle'
import { Analytics } from '@utils/analytics';
import { Loader } from '@components/UI/Loader'
import axios from 'axios'
import Saved from './Saved'


type Props = {
    pin: PinstaPublication,
    pinSaved?: boolean,
    savedTo?: any[],
    savedToBoards?: BoardType[]
}

const Share: FC<Props> = ({ pin, pinSaved, savedTo, savedToBoards }) => {
    const isMirror = pin.__typename === 'Mirror'
    const router = useRouter()
    const [isCopied, setIsCopied] = useState(false)
    const [sharePopUpOpen, setSharePopUpOpen] = useState(false)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    const [currentBoard, setCurrentBoard] = useState<BoardType>()
    const [loading, setLoading] = useState(false)
    const [isSaving, setSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [boardURL, setBoardURL] = useState(`${formatHandle(currentProfile?.handle)}${currentBoard ? `/${currentBoard?.slug}` : ''}`)
    const [boardName, setBoardName] = useState(currentBoard ? currentBoard?.name : 'Profile')

    const onCancel = () => {
        setShowCreateBoard(false)
    }

    const copied = () => {
        setIsCopied(true);
        Analytics.track('Pin link copied!', {
            pin: isMirror ? pin?.mirrorOf?.id : pin.id
        })
        toast.success('Copied! link to your clipboard to share');
    }

    const closeSharePopUp = () => {
        setSharePopUpOpen(false)
    }

    const unSaveIt = async () => {
        if (!currentProfileId) {
            toast.error(SIGN_IN_REQUIRED_MESSAGE);
            return
        }
        
        setLoading(true)
        const request = {
            board_id: currentBoard ?? null,
            user_id: currentProfileId,
            post_id: isMirror ? pin?.mirrorOf?.id : pin.id
        }
        return axios.post(`${PINSTA_SERVER_URL}/unsave-pin`,request).then((res) => {
            if (res.status === 200) {
                console.log('Pin removed!')
                toast.success('Pin removed!')
                setBoardURL(formatHandle(currentProfile?.handle))
                setBoardName('Profile')
                setLoading(false)
                onCancel()
                Analytics.track('Pin removed', {
                    pin: isMirror ? pin?.mirrorOf?.id : pin.id
                })
                setIsSaved(false)
            } else {
                setLoading(false)
                Analytics.track('Error on removing pin', {
                    pin: isMirror ? pin?.mirrorOf?.id : pin.id
                })
                toast.error('Error on removing pin!')
            }
        }).catch((err) => {
            setLoading(false)
            Analytics.track('Error on removing pin', {
                pin: isMirror ? pin?.mirrorOf?.id : pin.id
            })
            toast.error('Error on removing pin!')
        })
    }

    const savePinToBoard = async (board?: any) => {
        if (!currentProfileId) {
            toast.error(SIGN_IN_REQUIRED_MESSAGE);
            return
        }
        setLoading(true)
        const request = {
            board_id: board ? `${board.id}` : 0,
            user_id: currentProfileId,
            post_id: isMirror ? pin?.mirrorOf?.id : pin.id
        }
        return await axios.post(`${PINSTA_SERVER_URL}/save-pin`, request).then((res) => {
        if (res.status === 200) {
            setLoading(false)
            onCancel()
            setIsSaved(true)
            setBoardName(board?.name ?? 'Profile')
            setBoardURL(`${formatHandle(currentProfile?.handle)}${board ? `/${board?.slug}` : ''}`)
            Analytics.track('Pin Saved', {
                board: board?.name ?? 'Profile',
                pin: isMirror ? pin?.mirrorOf?.id : pin.id
            })
            toast.success(`Pin saved to ${board?.name ?? 'your profile'}`)
        } else {
                console.log('Error creating board', res)
                setLoading(false)
                Analytics.track('Error Pin Saved', {
                    board: board?.name ?? 'Profile',
                    pin: isMirror ? pin?.mirrorOf?.id : pin.id
                })
                toast.error('Error on saving pin!')
            }
        }).catch((err) => {
            console.log('Error creating board', err)
            setLoading(false)
            Analytics.track('Error Pin Saved', {
                board: board?.name ?? 'Profile',
                pin: isMirror ? pin?.mirrorOf?.id : pin.id
            })
            toast.error('Error on saving pin!')
        })
    }

    const shareRef = useDetectClickOutside({ onTriggered: closeSharePopUp, triggerKeys: ['Escape', 'x'], });

    const shareLink = `${APP.URL}/pin/${isMirror ? pin?.mirrorOf?.id : pin.id}`

    const tweetURL = 'Look at this... 👀' + shareLink

    // console.log('savedTo', savedTo)

    // console.log('check saved', savedTo?.find(item => item?.boardId === `16`))

    return (
        <>
            <div className='w-full backdrop-blur-3xl bg-opacity-50 top-0 flex flex-col md:flex-row justify-between items-center mb-6 relative z-10'>
                <div className='flex flex-row items-center w-full md:w-auto justify-between md:justify-center'>
                    <div className='flex back mr-4 lg:hidden'>
                        <button className='duration-75 delay-75 hover:text-red-500 text-gray-400' onClick={() => router.back()}> <BsArrowLeftCircleFill size={46}/> </button>
                    </div>
                    <div className='options mr-4'>
                        <button
                            onClick={() => {
                                Analytics.track(`download_pin_button_clicked_${isMirror ? pin?.mirrorOf?.id : pin.id}`)
                                    setSaving(true)
                                    {/* @ts-ignore */}
                                    exportPNG({ url: getThumbnailUrl(isMirror ? pin?.mirrorOf : pin) }, setSaving)
                                }
                            }
                            className='hover:bg-gray-900 hover:text-white bg-gray-100 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'
                        >
                            {isSaving ? <Loader size='md' /> : <HiOutlineDownload size={30} />}
                        </button>
                    </div>
                    <div className='relative z-10 mr-4'>
                        <button 
                        ref={shareRef} 
                        onClick={() => {
                            setSharePopUpOpen(!sharePopUpOpen)
                            Analytics.track(`share_pin_button_clicked_${isMirror ? pin?.mirrorOf?.id : pin.id}`)
                        }}
                        className='hover:bg-gray-900 hover:text-white bg-gray-100 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'
                        >
                            <FiShare2 size={24} />
                        </button>
                        {sharePopUpOpen && (
                            <div className='absolute z-50 top-16 w-20 -left-4 bg-white dark:bg-gray-700 dark:border-black rounded-full dropdown-shadow border border-gray-100 px-4 py-4'>
                                <div className='flex flex-col'>
                                    <div className='flex flex-col justify-between items-center'>
                                        <div>
                                            <FacebookShareButton
                                                url={shareLink}
                                                hashtag={'#pinsta'}>
                                                <FacebookIcon size={50} round />
                                            </FacebookShareButton>
                                        </div>
                                        <div>
                                            <TwitterShareButton
                                                url={tweetURL}
                                                hashtags={['pinsta', 'lens', 'lensprotocol', 'web3', 'decentralized', 'web3pinterest']}
                                                via='PinstaApp'>
                                                <TwitterIcon size={50} round />
                                            </TwitterShareButton>
                                        </div>
                                        <div>
                                            <WhatsappShareButton
                                                url={tweetURL}
                                                separator=":: "
                                                >
                                                <WhatsappIcon size={50} round />
                                            </WhatsappShareButton>
                                        </div>
                                        <div>
                                            <EmailShareButton
                                                url={shareLink}
                                                subject='Look at this... 👀 From Pineso.io'
                                                body='Look at this... 👀'>
                                                <EmailIcon size={50} round />
                                            </EmailShareButton>
                                        </div>
                                        {/* <div className='flex flex-col items-center'>
                                            <CopyToClipboard text={`${APP.URL}/pin/${pin.id}`} onCopy={() => copied()}>
                                                <button className='hover:bg-gray-900 hover:text-white bg-gray-100 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                                    <HiOutlineLink size={24} />
                                                </button>
                                            </CopyToClipboard>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='link'>
                        <CopyToClipboard text={`${APP.URL}/pin/${isMirror ? pin?.mirrorOf?.id : pin.id}`} onCopy={() => copied()}>
                            <button className='hover:bg-gray-900 hover:text-white bg-gray-100 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                <HiOutlineLink size={24} />
                            </button>
                        </CopyToClipboard>
                    </div>
                </div>
                <div className='space-x-5 items-center flex justify-between md:w-auto md:flex-none flex-1 w-full md:mt-0 mt-4 flex-row'>
                    <Saved
                        currentBoard={currentBoard}
                        savedTo={savedTo}
                        loading={loading}
                        boardURL={boardURL}
                        boardName={boardName}
                        isSaved={isSaved}
                        setCurrentBoard={setCurrentBoard}
                        savePinToBoard={savePinToBoard}
                        setIsSaved={setIsSaved}
                        setSharePopUpOpen={setSharePopUpOpen}
                        unSaveIt={unSaveIt}
                        pin={pin}
                    />
                </div>
            </div>
        </>
    )
}

export default Share