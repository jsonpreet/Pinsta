import CreateBoardModal from '@components/Common/Modals/CreateBoard'
import { Button } from '@components/UI/Button'
import DropMenu from '@components/UI/DropMenu'
import { Input } from '@components/UI/Input'
import useDebounce from '@hooks/useDebounce'
import { FetchProfileBoards } from '@lib/db/actions'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { usePublicationStore } from '@lib/store/publication'
import { Analytics } from '@utils/analytics'
import { PINSTA_SERVER_URL } from '@utils/constants'
import { BoardType } from '@utils/custom-types'
import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { HiChevronDown, HiOutlineBookmark, HiPlus } from 'react-icons/hi'

const ProfileBoards: FC = () => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    const setCreatePin = usePublicationStore((state) => state.setCreatePin)
    const createdPin = usePublicationStore((state) => state.createPin)
    const [search, setSearch] = useState('')
    const [showLoader, setLoader] = useState(false)
    const debouncedValue = useDebounce<string>(search, 500)
    const [showResults, setShowResults] = useState(false)
    const [searchBoards, setSearchBoards] = useState([])
    const [splicedBoards, setSplicedBoards] = useState<any>([])

    const { data: boards, isError, isFetched, isLoading, refetch } = FetchProfileBoards(currentProfileId)

    useEffect(() => {
        if (isFetched) {
            setSplicedBoards(boards?.data.length > 5 ? boards?.data.splice(0, 5) : boards.data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetched])

    const boardSearch = async (payload : {query: string, user_id: string}) => {
        Analytics.track('User Board Search!', {
            query: payload.query,
            user_id: payload.user_id,
        })
        return await axios.post(`${PINSTA_SERVER_URL}/user-board-search`, payload).then((res) => {
            if (res.data.data && res.data.data.length > 0) {
                setShowResults(true)
                setSearchBoards(res.data.data)
                return
            }
        }).catch((err) => {
            console.log(err)
            return
        })
    }

    const onDebounce = () => {
        if (search.trim().length) {
            boardSearch({
                query: search,
                user_id: currentProfile?.id,
            })
        }
    }

    useEffect(() => {
        onDebounce()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue])

    const onSearch = ((e: any) => {
        if (e.target.value.length > 0) {
            setLoader(true)
            setShowResults(true);
            setSearch(e.target.value)
        } else {
            setLoader(false)
            setShowResults(false)
            setSearch('')
        }
    });


    const BoardItem = ({ board }: { board: BoardType }) => {
        return (
            <>
                <button
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
            </>
        )
    }
    

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
                <div className='mt-1.5 w-72 divide-y focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow overflow-hidden max-h-[26rem] divide-gray-100 dark:divide-gray-700 border border-gray-100 rounded-xl dark:border-gray-700 dark:bg-gray-800 bg-white'>
                    {isFetched && boards.data?.length > 0 ?
                        <>
                            {boards.data.length > 4 ? (
                                <div className='flex flex-col p-5'>
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Search"
                                            value={search}
                                            onChange={onSearch}
                                        />
                                    </div>
                                </div>
                            ): null}
                            <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-700 overflow-scroll h-48'>
                                {showResults && searchBoards.length > 0 && searchBoards.map((board: BoardType, index: number) => (
                                    <BoardItem key={index} board={board} />
                                ))}
                                {!showResults && !showLoader && splicedBoards.map((board : BoardType, index : number) => (
                                    <BoardItem key={index} board={board} />
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