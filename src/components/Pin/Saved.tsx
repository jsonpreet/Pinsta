import { Button } from '@components/UI/Button'
import DropMenu from '@components/UI/DropMenu'
import { Input } from '@components/UI/Input'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics } from '@utils/analytics'
import { BoardType, PinstaPublication } from '@utils/custom-types'
import Link from 'next/link'
import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
import { HiChevronDown, HiOutlineBookmark, HiPlus } from 'react-icons/hi'

interface Props {
    isSaved: boolean
    isFetched: boolean
    boards: any
    currentBoard: any | null
    savedTo: any
    setIsSaved: (isSaved: boolean) => void
    setCurrentBoard: (board: any | null) => void
    savePinToBoard: (board: any | null) => void
    setSearch: (search: string) => void
    setSharePopUpOpen: (isOpen: boolean) => void
    unSaveIt: (board: any | null) => void
    pin: PinstaPublication
    loading: boolean
    boardURL: string
    boardName: string
}

const Saved:FC<Props> = ({ currentBoard, isFetched, isSaved, boards, setIsSaved, setSearch, savePinToBoard, setCurrentBoard, savedTo, pin, loading, boardURL, boardName, setSharePopUpOpen, unSaveIt}) => {
    const isMirror = pin.__typename === 'Mirror'
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    return (
        <>
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
                                                        {
                                                            // @ts-ignore
                                                            savedTo?.find(item => item?.boardId === `${board?.id}`) && (
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
                                        
                                        // @ts-ignore
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
                            // @ts-ignore
                            unSaveIt()
                            Analytics.track('Unsaved Pin', {
                                pinId: isMirror ? pin?.mirrorOf?.id : pin.id,
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
                            // @ts-ignore
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
                !isMobile ?
                    <Button
                        onClick={() => {
                            // @ts-ignore
                            savePinToBoard()
                            Analytics.track('Save Pin', {
                                pinId: isMirror ? pin?.mirrorOf?.id : pin.id
                            })
                        }}
                    >
                        Save
                    </Button>
                : null
            }
        </>
    )
}

export default Saved