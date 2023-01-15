
import { Listbox, Transition } from '@headlessui/react'
import useAppStore from '@lib/store'
import { CREATOR_CATEGORIES } from '@utils/data/categories'
import React, { Fragment } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { BsCheck } from 'react-icons/bs'

const Category = () => {
    const createdPin = useAppStore((state) => state.createdPin)
    const setCreatePin = useAppStore((state) => state.setCreatePin)

    return (
        <>
            <div className="flex items-center mb-1 space-x-1.5">
                <div className="text-[11px] font-semibold text-gray-500">
                    Category
                </div>
            </div>
            <Listbox
                value={createdPin.category}
                onChange={(category) => setCreatePin({ category: category })}
            >
                <div className="relative mt-1">
                <Listbox.Button className="relative w-full py-2.5 pr-10 text-left border-b-2 dark:border-gray-700 border-gray-200 focus:outline-none sm:text-sm">
                    <span className="block truncate">
                        {createdPin.category.name}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                        <BiChevronDown size={18} />
                    </span>
                </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute shadow w-full py-1 mt-1 z-[1] overflow-auto text-base bg-white dark:bg-gray-900 rounded-xl max-h-52 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dropdown-shadow">
                            {CREATOR_CATEGORIES.map((category, categoryIdx) => (
                                <Listbox.Option
                                    key={categoryIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                        }`
                                    }
                                    value={category}
                                >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${
                                            selected ? 'font-medium' : 'font-normal'
                                            }`}
                                        >
                                            {category.name}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <BsCheck size={18} />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </>
    )
}

export default Category