/* eslint-disable @next/next/no-img-element */
import { Profile } from '@utils/lens/generated'
import { FC, useState } from 'react'
import dayjs from 'dayjs';
import formatTime from '@utils/functions/formatTime'
// @ts-ignore
import dayjsTwitter from 'dayjs-twitter';
import formatHandle from '@utils/functions/formatHandle';
import Link from 'next/link';
import getProfilePicture from '@utils/functions/getProfilePicture';
import IsVerified from '@components/UI/IsVerified';
import useAppStore from '@lib/store';
import usePersistStore from '@lib/store/persist';
import DropMenu from '@components/UI/DropMenu';
import { BiDotsHorizontalRounded, BiDotsVerticalRounded } from 'react-icons/bi';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import EditBoardModal from '@components/Common/Modals/EditBoard';
import Axios from '@utils/axios';
import { toast } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { APP } from '@utils/constants';
import { HiOutlineLink } from 'react-icons/hi';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from 'next-share';
import { FiShare2 } from 'react-icons/fi';
import { useRouter } from 'next/router';

dayjs.extend(dayjsTwitter);

type Props = {
    board: any,
    profile: Profile
}

const BoardInfo: FC<Props> = ({ board, profile }) => {
    const router = useRouter()
    const currentProfile = useAppStore((state) => state.currentProfile)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const [showEditBoard, setShowEditBoard] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [sharePopUpOpen, setSharePopUpOpen] = useState(false)

    const copied = () => {
        setIsCopied(true);
        toast.success('Copied! link to your clipboard to share');
    }

    const closeSharePopUp = () => {
        setSharePopUpOpen(false)
    }

    const deleteBoard = async (id: string) => {
        const toastId = toast.loading('Deleting board...')
        
        await Axios.post(`/delete-board`, { user_id: currentProfileId, board_id: id }).then((res) => {
            if (res.data.status === 204) {
                toast.success('Board deleted successfully', { id: toastId })
                router.push('/')
            } else {
                toast.error('Something went wrong', {id: toastId})
            }
        })
    }

    const shareRef = useDetectClickOutside({ onTriggered: closeSharePopUp, triggerKeys: ['Escape', 'x'], });

    const shareLink = `${APP.URL}/${formatHandle(profile?.handle)}/${board?.slug}`

    const tweetURL = 'Look at this... 👀' + shareLink

    return (
        <>
            <EditBoardModal board={board} show={showEditBoard} setShow={setShowEditBoard} />
            <div className='flex flex-col w-full max-w-7xl space-y-2 mx-auto justify-center items-center py-8'>
                <div className='flex items-center space-x-2'>
                    <h2 className='text-4xl font-bold'>{board?.name}</h2>
                    {currentProfile?.id === profile?.id && (
                        <>
                            <DropMenu
                                trigger={
                                    <button className='flex items-center justify-center'>
                                        <BiDotsVerticalRounded size={21} />
                                    </button>
                                }
                            >
                                <div className='mt-1.5 w-44 focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow overflow-hidden rounded-xl dark:bg-gray-800 bg-white'>
                                    <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-700'>
                                        <button 
                                            className='flex items-center space-x-2 px-5 py-3 w-full hover:bg-gray-100'
                                            onClick={() => setShowEditBoard(true)}
                                        >
                                            <BsPencilSquare size={18} />
                                            <span>Edit</span>
                                        </button>
                                        <button 
                                            className='flex items-center space-x-2 px-5 py-3 w-full hover:bg-gray-100'
                                            onClick={() => deleteBoard(board?.id)}
                                        >
                                            <BsTrash size={18} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </DropMenu>
                        </>
                    )}
                </div>
                <span className='text-gray-500 text-base ml-2'>{board?.description}</span>
                <div className='flex items-center text-sm'>
                    <span>{`${board?.pins?.length} ${board?.pins?.length > 1 ? `Pins` : `Pin`}`}</span>
                    <span className='middot'></span>
                    <span title={formatTime(board.created_at)}>
                        {/* @ts-ignore */}
                        {dayjs(new Date(board.created_at)).twitter()}
                    </span>
                </div>
                <div className='flex flex-col items-center justify-center space-y-3'>
                    <div className='mt-6'>
                        <Link
                            href={`/${formatHandle(profile?.handle)}`}
                        >
                            <img
                                src={getProfilePicture(profile, 'avatar_lg')}
                                className="w-14 h-14 rounded-full"
                                alt={formatHandle(profile?.handle)}
                            />
                        </Link>    
                    </div>
                    <h3 className='flex items-center space-x-1'>
                        <span>Collection by</span>
                        <Link
                            href={`/${formatHandle(profile?.handle)}`}
                            className='items-center flex'
                        >
                            <span className="font-semibold capitalize hover:underline">{profile?.name ?? formatHandle(profile?.handle)}</span>
                            <IsVerified id={profile?.id} size='sm' />
                        </Link>
                    </h3>
                    <div className='relative z-10'>
                        <button ref={shareRef} onClick={() => setSharePopUpOpen(!sharePopUpOpen)} className='hover:bg-gray-900 hover:text-white bg-gray-100 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 duration-75 delay-75 flex justify-center items-center text-center px-5 space-x-2 py-2 rounded-full'>
                            <FiShare2 size={16} />
                            <span>Share</span>
                        </button>
                        {sharePopUpOpen && (
                            <div className='absolute z-50 top-12 left-0 md:-left-[120px] bg-white dark:bg-gray-700 dark:border-black rounded-full dropdown-shadow border border-gray-100 px-4 py-4'>
                                <div className='flex justify-between md:flex-row flex-col space-x-0 space-y-4 md:space-y-0 md:space-x-6 items-center'>
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
                                            hashtags={['pinsta', 'pinstaxyz', 'lensprotocol', 'web3', 'decentralized', 'web3socialmedia']}
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
                                            subject='Look at this... 👀 From Pinsta.xyz'
                                            body='Look at this... 👀'>
                                            <EmailIcon size={50} round />
                                        </EmailShareButton>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <CopyToClipboard text={shareLink} onCopy={() => copied()}>
                                            <button className='hover:bg-gray-900 hover:text-white bg-gray-100 dark:bg-gray-700 dark:hover:bg-white dark:hover:text-gray-900 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'>
                                                <HiOutlineLink size={24} />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoardInfo