import CreateBoardModal from '@components/Common/Modals/CreateBoard'
import { Button } from '@components/UI/Button'
import DropMenu from '@components/UI/DropMenu'
import { Input } from '@components/UI/Input'
import { FetchProfileBoards } from '@lib/db/actions'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { usePublicationStore } from '@lib/store/publication'
import { BoardType } from '@utils/custom-types'
import React, { FC, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { HiChevronDown, HiOutlineBookmark, HiPlus } from 'react-icons/hi'

const ProfileBoards: FC = () => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    const setCreatePin = usePublicationStore((state) => state.setCreatePin)
    const createdPin = usePublicationStore((state) => state.createPin)
    const [search, setSearch] = useState('')
    const { data:boards, isError, isFetched, isLoading, refetch } = FetchProfileBoards(currentProfileId)
    return (
        <>
            <CreateBoardModal refetch={refetch} setCreatePin={setCreatePin} />
            <DropMenu
                trigger={
                    <button className='flex justify-center items-center text-center rounded-full'>
                        <span className='text-base font-semibold'>{createdPin?.board?.name || `Profile`}</span>
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
                                        setCreatePin({
                                            ...createdPin,
                                            board: board
                                        })
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
                            onClick={() => 
                                setCreatePin({
                                    ...createdPin,
                                    board: null
                                })
                            }
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
                            }}
                        >
                            Create Board
                        </Button>
                    </div>
                </div>
            </DropMenu>
        </>
    )
}

export default ProfileBoards