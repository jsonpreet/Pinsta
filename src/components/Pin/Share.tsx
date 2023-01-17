/* eslint-disable @next/next/no-img-element */
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsArrowLeftCircleFill, BsClipboardPlus } from 'react-icons/bs'
import { useDetectClickOutside } from 'react-detect-click-outside';
import { APP, PINSTA_SERVER_URL, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import { BoardPinsType, BoardType, PinstaPublication } from '@utils/custom-types'
import { exportPNG } from '@utils/functions/getExport'
import { HiChevronDown, HiOutlineBookmark, HiOutlineDownload, HiOutlineLink, HiPlus } from 'react-icons/hi'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from 'next-share';
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { Button } from '@components/UI/Button'
import { FiShare2 } from "react-icons/fi";
import { FetchProfileBoards } from '@lib/db/actions'
import DropMenu from '@components/UI/DropMenu'
import { Input } from '@components/UI/Input'
import CreateBoardModal from '@components/Common/Modals/CreateBoard'
import Link from 'next/link'
import formatHandle from '@utils/functions/formatHandle'
import { Analytics } from '@utils/analytics';
import { Loader } from '@components/UI/Loader'
import { isMobile } from 'react-device-detect'
import axios from 'axios'


type Props = {
    pin: PinstaPublication,
    pinSaved?: boolean,
    savedTo?: any[],
    savedToBoards?: BoardType[]
}

const Share: FC<Props> = ({ pin, pinSaved, savedTo, savedToBoards }) => {
    const router = useRouter()
    const [isCopied, setIsCopied] = useState(false)
    const [sharePopUpOpen, setSharePopUpOpen] = useState(false)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    const [currentBoard, setCurrentBoard] = useState<BoardType>()
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSaving, setSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [boardURL, setBoardURL] = useState(`${formatHandle(currentProfile?.handle)}${currentBoard ? `/${currentBoard?.slug}` : ''}`)
    const [boardName, setBoardName] = useState(currentBoard ? currentBoard?.name : 'Profile')

    const { data:boards, isError, isFetched, isLoading, refetch: refetchBoards } = FetchProfileBoards(currentProfileId)

    const onCancel = () => {
        setShowCreateBoard(false)
    }

    const copied = () => {
        setIsCopied(true);
        Analytics.track('Pin link copied!', {
            pin: pin.id
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
            post_id: pin.id
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
                    pin: pin.id
                })
                setIsSaved(false)
            } else {
                setLoading(false)
                Analytics.track('Error on removing pin', {
                    pin: pin.id
                })
                toast.error('Error on removing pin!')
            }
        }).catch((err) => {
            setLoading(false)
            Analytics.track('Error on removing pin', {
                pin: pin.id
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
            post_id: pin.id
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
                pin: pin.id
            })
            toast.success(`Pin saved to ${board?.name ?? 'your profile'}`)
        } else {
                console.log('Error creating board', res)
                setLoading(false)
                Analytics.track('Error Pin Saved', {
                    board: board?.name ?? 'Profile',
                    pin: pin.id
                })
                toast.error('Error on saving pin!')
            }
        }).catch((err) => {
            console.log('Error creating board', err)
            setLoading(false)
            Analytics.track('Error Pin Saved', {
                board: board?.name ?? 'Profile',
                pin: pin.id
            })
            toast.error('Error on saving pin!')
        })
    }

    const shareRef = useDetectClickOutside({ onTriggered: closeSharePopUp, triggerKeys: ['Escape', 'x'], });

    const shareLink = APP.URL+'/pin/'+pin.id

    const tweetURL = 'Look at this... 👀' + shareLink

    // console.log('savedTo', savedTo)

    // console.log('check saved', savedTo?.find(item => item?.boardId === `16`))

    return (
        <>
            <CreateBoardModal refetch={refetchBoards} pin={pin} savePinToBoard={savePinToBoard} setIsSaved={setIsSaved} />
            <div className='w-full backdrop-blur-3xl bg-opacity-50 top-0 flex flex-col md:flex-row justify-between items-center mb-6 relative z-10'>
                <div className='flex flex-row items-center justify-center'>
                    <div className='flex back mr-4 lg:hidden'>
                        <button className='duration-75 delay-75 hover:text-red-500 text-gray-400' onClick={() => router.back()}> <BsArrowLeftCircleFill size={46}/> </button>
                    </div>
                    <div className='options mr-4'>
                        <button
                            onClick={() => {
                                Analytics.track(`download_pin_button_clicked_${pin.id}`)
                                    setSaving(true)
                                    exportPNG({ url: getThumbnailUrl(pin) }, setSaving)
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
                            Analytics.track(`share_pin_button_clicked_${pin.id}`)
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
                                                hashtag={'#pinesoio'}>
                                                <FacebookIcon size={50} round />
                                            </FacebookShareButton>
                                        </div>
                                        <div>
                                            <TwitterShareButton
                                                url={tweetURL}
                                                hashtags={['pinesoio', 'deso', 'desoprotocol', 'web3', 'decentralized', 'web3socialmedia']}
                                                via='pinesoio'>
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
                        <CopyToClipboard text={`${APP.URL}/pin/${pin.id}`} onCopy={() => copied()}>
                            <button className='hover:bg-gray-900 hover:text-white bg-gray-100 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                <HiOutlineLink size={24} />
                            </button>
                        </CopyToClipboard>
                    </div>
                </div>
                <div className='space-x-5 items-center flex justify-between md:w-auto md:flex-none flex-1 w-full md:mt-0 mt-4 flex-row'>
                    {currentProfileId ?
                        !isSaved ?
                            <div className='flex-1'>
                                <DropMenu
                                    trigger={
                                        <button className='flex justify-center items-center text-center rounded-full'>
                                            <span className='text-base font-semibold'>{currentBoard?.name ?? `Profile`}</span>
                                            <HiChevronDown size={24} />
                                        </button>
                                    }
                                    position={isMobile ? 'left': 'right'}
                                >
                                    <div className='mt-1.5 w-72 divide-y focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow max-h-96 divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-700 dark:bg-gray-800 bg-white'>
                                        {isFetched && boards.data?.length > 0 ?
                                        <>
                                            {boards.data.length > 5 && (
                                                <div className='flex flex-col p-5'>
                                                    <div>
                                                        <Input
                                                            type="text"
                                                            placeholder="Search"
                                                            onChange={(e) => setSearch(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-700'>
                                                {boards.data.map((board : BoardType, index : number) => (
                                                    <button
                                                        key={index}
                                                        className='flex flex-row items-center justify-between px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100 text-gray-700 dark:hover:text-white duration-75 delay-75 focus-visible:outline-none focus:outline-none focus:ring-0'
                                                        onClick={() => {
                                                            savePinToBoard(board)
                                                            setCurrentBoard(board)
                                                        }}
                                                    >
                                                        <div className='flex flex-row items-center space-x-3 justify-start text-left'>
                                                            <div>
                                                                <span 
                                                                    className='w-8 h-8 rounded-md flex justify-center items-center text-center text-gray-500 font-semibold bg-gray-200 dark:bg-gray-400'>
                                                                    <HiPlus size={18} />
                                                                </span>
                                                            </div>
                                                            <div className='flex flex-col'>
                                                                <span className='font-semibold text-sm'>
                                                                    {board.name}
                                                                </span>
                                                                {savedTo?.find(item => item?.boardId === `${board?.id}`) && (
                                                                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                                        Saved here already!
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                        :
                                            <div className='flex py-5 px-5 text-center'>
                                                <h3>No boards found, Create a New Board</h3>
                                            </div>
                                        }
                                        <div>
                                            <button 
                                                className='flex items-center justify-between w-full px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100 text-gray-700 dark:hover:text-white duration-75 delay-75 focus-visible:outline-none focus:outline-none focus:ring-0'
                                                onClick={() => savePinToBoard()}
                                            >
                                                <span className='flex text-left items-center space-x-3'>
                                                <HiOutlineBookmark size={28} />
                                                    <div className='flex flex-col'>
                                                        <span>
                                                            Save to Profile
                                                        </span>
                                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                            Quick save and organize later
                                                        </span>
                                                    </div>
                                                </span>
                                            </button>
                                        </div>
                                        <div className='py-4 px-5 items-center justify-center flex'>
                                            <Button
                                                variant='dark'
                                                onClick={() => {
                                                    setShowCreateBoard(true)
                                                    setSharePopUpOpen(false)
                                                }}
                                            >
                                                Create Board
                                            </Button>
                                        </div>
                                    </div>
                                </DropMenu>
                            </div>
                            : 
                                <div className='flex-1'>
                                    <Link 
                                        href={`/${boardURL}`}
                                    >
                                        <span className='text-base font-semibold'>{boardName}</span>
                                    </Link>
                                </div>
                            : null
                    }
                    {currentProfileId ?
                        (isSaved) ?
                            <Button
                                variant='dark'
                                loading={loading}
                                onClick={() => {
                                    unSaveIt()
                                    Analytics.track('Unsaved Pin', {
                                        pinId: pin?.id,
                                        boardId: currentBoard?.id,
                                        boardName: currentBoard?.name
                                    })
                                }}
                            >
                                Saved
                            </Button> :
                            <Button
                                loading={loading}
                                onClick={() => {
                                    savePinToBoard()
                                    Analytics.track('Save Pin', {
                                        pinId: pin?.id,
                                        boardId: currentBoard?.id,
                                        boardName: currentBoard?.name
                                    })
                                }}
                            >
                                Save
                            </Button>
                        :
                        <Button
                            onClick={() => {
                                savePinToBoard()
                                Analytics.track('Save Pin', {
                                    pinId: pin?.id
                                })
                            }}
                        >
                            Save
                        </Button>
                    }
                </div>
            </div>
        </>
    )
}

export default Share