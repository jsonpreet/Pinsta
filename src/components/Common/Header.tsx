import { Button } from '@components/Shared/Button'
import clsx from 'clsx'
import type { FC } from 'react'
import { useState } from 'react'

import Login from './Auth/Login'
import { BsSearch } from "react-icons/bs";
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const [showShowModal, setSearchModal] = useState(false)

  return (
    <div
      className={clsx(
        'sticky py-4 z-10 flex-shrink-0 flex w-full items-center drop-shadow-sm border-b border-gray-200 -left-64 bg-white',
        className
      )}
    >
      <div className="w-full">
        <div className="flex px-8 items-center justify-between w-full">
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