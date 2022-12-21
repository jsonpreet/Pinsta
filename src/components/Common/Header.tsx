import { Button } from '@components/Shared/Button'
import clsx from 'clsx'
import type { FC } from 'react'
import { useState } from 'react'

import Login from './Auth/Login'
import { BsSearch } from "react-icons/bs";
import GlobalSearchBar from './Search/GlobalSearchBar'
import { APP } from '@utils/constants';
import { HOME } from '@utils/paths';
import Link from 'next/link';

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const [showShowModal, setSearchModal] = useState(false)

  return (
    <div
      className={clsx(
        'sticky py-4 z-10 flex-shrink-0 flex w-full items-center drop-shadow-sm border-b border-gray-200 bg-white',
        className
      )}
    >
      <div className="w-full">
        <div className="flex px-8 items-center justify-between w-full">
          <div className="mr-8">
            <Link
              href={HOME}
              className="flex space-x-2 items-center"
            >
              <img
                src={`/logo.png`}
                draggable={false}
                className="w-8 h-8"
                alt={APP.Name}
              />
              <span className='font-bold text-3xl brandGradientText uppercase hidden md:inline-flex'>Pinsta</span>
            </Link>
          </div>
          <div className="hidden md:block w-[calc(100%-200px)]">
            <GlobalSearchBar />
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:space-x-3 md:w-40">
            <Button
              variant="material"
              onClick={() => setSearchModal(true)}
              className="!p-[10px] md:hidden"
            >
              <BsSearch className="w-4 h-4" aria-hidden="true" />
            </Button>
            
            <Login />
          </div>
        </div>
      </div>

      {/* <Modal
        title="Search"
        onClose={() => setSearchModal(false)}
        show={showShowModal}
        panelClassName="max-w-md h-full"
      >
        <div className="max-h-[80vh] overflow-y-auto no-scrollbar">
          <GlobalSearchBar onSearchResults={() => setSearchModal(false)} />
        </div>
      </Modal> */}
    </div>
  )
}

export default Header