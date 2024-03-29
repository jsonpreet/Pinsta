import { Button } from '@components/UI/Button'
import DropMenu from '@components/UI/DropMenu'
import useAppStore from '@lib/store'
import { Analytics } from '@utils/analytics'
import { CREATE } from '@utils/paths'
import Link from 'next/link'
import { FC } from 'react'
import { BsPinAngle } from 'react-icons/bs'
import { HiPlus } from 'react-icons/hi'
import { MdOutlineSpaceDashboard } from 'react-icons/md'

// Create Menu Icon with dropdown

const CreateMenu: FC = () => {
    const setShowCreateBoard = useAppStore((state) => state.setShowCreateBoard)
    return (
        <>
            <Link
                href={CREATE}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
                <HiPlus size='1.5rem' />
            </Link>
            {/* <DropMenu
                trigger={
                    <Button
                        onClick={() => {
                            Analytics.track(`clicked_on_create_menu_link`)
                        }}
                        variant='light'
                        className='flex items-center justify-center w-10 h-10 rounded-full'
                    >
                        <HiPlus size='1.5rem' />
                    </Button>
                }
            >
                <div className="py-2 mt-1.5 w-44 divide-y focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow max-h-96 divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-700 dark:bg-gray-800 bg-white">
                    <button
                        onClick={() => setShowCreateBoard(true)}
                        disabled={true}
                        className="inline-flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-900 duration-75 delay-75"
                    >
                        <MdOutlineSpaceDashboard size={24} />
                        <span>Create Idea Pin</span>
                    </button>
                    <Link
                        href={CREATE}
                        className="inline-flex items-center w-full p-3 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-900 duration-75 delay-75"
                    >
                        <BsPinAngle size={24} />
                        <span>Create Pin</span>
                    </Link>
                </div>
            </DropMenu> */}
        </>
    )
}

export default CreateMenu