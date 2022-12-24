import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsArrowLeftCircleFill } from 'react-icons/bs'
import { useDetectClickOutside } from 'react-detect-click-outside';
import { APP } from '@utils/constants'
import { PinstaPublication } from '@utils/custom-types'
import { exportPNG } from '@utils/functions/getExport'
import { HiOutlinePaperAirplane } from 'react-icons/hi2'
import { HiOutlineDownload, HiOutlineLink } from 'react-icons/hi'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, FacebookIcon, RedditShareButton, RedditIcon, TelegramShareButton, TelegramIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon, EmailShareButton, EmailIcon } from 'next-share';
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { Button } from '@components/Shared/Button'
import { FiShare2 } from "react-icons/fi";


type Props = {
    pin: PinstaPublication
}

const Share: FC<Props> = ({ pin }) => {
    const router = useRouter()
    const [isSaved, setIsSaved] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [sharePopUpOpen, setSharePopUpOpen] = useState(false)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)

    const copied = () => {
        setIsCopied(true);
        toast.success('Copied! link to your clipboard to share');
    }

    const closeSharePopUp = () => {
        setSharePopUpOpen(false)
    }

    const dontSave = () => {
        toast.error('Oops! Sorry, This NFT is on Sale');
    }

    const saveIt = async () => {
        console.log('save it')
        toast.error('Save is not enabled!');
        //const response = await savePost(post, user);
    }

    const shareRef = useDetectClickOutside({ onTriggered: closeSharePopUp, triggerKeys: ['Escape', 'x'], });

    const shareLink = APP.URL+'/pin/'+pin.id

    const tweetURL = 'Look at this... 👀' + shareLink
    
    return (
        <>
            <div className='w-full backdrop-blur-3xl bg-opacity-50 top-0 flex flex-row justify-between items-center border-b border-gray-50 pb-4 mb-4 relative'>
                <div className='flex flex-row items-center justify-center'>
                    <div className='flex back mr-4 lg:hidden'>
                        <button className='duration-75 delay-75 hover:text-[#ec05ad] text-gray-400' onClick={() => router.back()}> <BsArrowLeftCircleFill size={48}/> </button>
                    </div>
                    <div className='options mr-4'>
                        <button
                            onClick={() => exportPNG({ url: getThumbnailUrl(pin) })}
                            className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'
                        >
                            <HiOutlineDownload size={30} />
                        </button>
                    </div>
                    <div className='share mr-4'>
                        <button ref={shareRef} onClick={() => setSharePopUpOpen(!sharePopUpOpen)} className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                            <FiShare2 size={24} />
                        </button>
                        {sharePopUpOpen && (
                            <div className='absolute z-50 top-16 max-w-sm w-full left-0 bg-white rounded-lg shadow-xl border border-gray-100 px-4 py-4'>
                                <div className='flex flex-col'>
                                    <div className='flex flex-row justify-between items-center'>
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
                                        <div className='flex flex-col items-center'>
                                            <CopyToClipboard text={`${APP.URL}/pin/${pin.id}`} onCopy={() => copied()}>
                                                <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                                    <HiOutlineLink size={24} />
                                                </button>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='link'>
                        <CopyToClipboard text={`${APP.URL}/pin/${pin.id}`} onCopy={() => copied()}>
                            <button className='hover:bg-black hover:text-white bg-gray-100 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                <HiOutlineLink size={24} />
                            </button>
                        </CopyToClipboard>
                    </div>
                </div>
                <div className='save flex flex-row'>
                    {currentProfileId ?
                        (isSaved) ?
                            <Button
                                onClick={() => saveIt()}
                            >
                                Saved
                            </Button> :
                            <Button
                                onClick={() => saveIt()}
                            >
                                Save
                            </Button>
                        :
                        <Button
                            onClick={() => saveIt()}
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