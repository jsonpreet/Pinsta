
import useAppStore from '@lib/store'
import { CREATOR_CATEGORIES } from '@utils/data/categories'
import useHorizontalScroll from '@utils/hooks/useHorizantalScroll'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'


const CategoriesList = () => {
    const activeTagFilter = useAppStore((state) => state.activeTagFilter)
    const setActiveTagFilter = useAppStore((state) => state.setActiveTagFilter)

    const [scrollX, setScrollX] = useState(0)
    const [scrollEnd, setScrollEnd] = useState(false)

    const scrollRef = useHorizontalScroll()

    const onFilter = (tag: string) => {
        setActiveTagFilter(tag)
    }

    const sectionOffsetWidth = scrollRef.current?.offsetWidth ?? 1000
    const scrollOffset = sectionOffsetWidth / 1.2

    useEffect(() => {
        if (scrollRef.current && scrollRef?.current?.scrollWidth === scrollRef?.current?.offsetWidth) {
            setScrollEnd(true)
        } else {
            setScrollEnd(false)
        }
    }, [scrollRef])

    const slide = (shift: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += shift
            setScrollX(scrollX + shift)
            if (Math.floor(scrollRef.current.scrollWidth - scrollRef.current.scrollLeft) <= scrollRef.current.offsetWidth) {
                setScrollEnd(true)
            } else {
                setScrollEnd(false)
            }
        }
    }

    return (
        <>
            <div className='relative w-full z-10'>
                
                {scrollX !== 0 &&
                    <span className='absolute z-10 left-0 top-1 w-40 h-12 bg-faded-left pointer-events-none' />
                }
            
                {scrollX !== 0 && (
                    <button
                        type="button"
                        className="bg-white dark:bg-gray-700 z-20 dark:hover:text-gray-900 hover:bg-gray-200 rounded-full p-2 hidden md:block text-gray-800 focus:outline-none left-0 absolute top-0"
                        onClick={() => slide(-scrollOffset)}
                    >
                        <BiChevronLeft size={24} />
                    </button>
                )}
                
                {!scrollEnd && (
                    <button
                        type="button"
                        className="bg-white dark:bg-gray-700 z-20 dark:hover:text-gray-900 hover:bg-gray-200 rounded-full p-2 hidden md:block text-gray-800 focus:outline-none right-0 absolute top-0"
                        onClick={() => slide(scrollOffset)}
                    >
                        <BiChevronRight size={24} />
                    </button>
                )}
                {!scrollEnd && (
                    <span className='absolute z-10 right-0 top-1 w-40 h-12 bg-faded-right pointer-events-none' />
                )}
            </div>
            <div
                ref={scrollRef}
                className="flex relative items-center scroll-smooth overflow-x-auto touch-pan-x no-scrollbar md:px-2 pt-2 pb-1.5 space-x-2 ultrawide:max-w-[110rem] mx-auto"
            >
            <button
                type="button"
                onClick={() => onFilter('all')}
                className={clsx(
                'px-3.5 capitalize py-1 text-xs border border-gray-900 dark:hover:bg-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-700 rounded-full whitespace-nowrap focus:outline-none focus:ring-0',
                activeTagFilter === 'all'
                    ? 'bg-gray-800 dark:border-gray-600 text-white border-gray-900'
                    : 'dark:bg-black dark:text-white bg-white'
                )}
            >
                All
            </button>
            {CREATOR_CATEGORIES.map((category) => (
                <button
                    type="button"
                    onClick={() => onFilter(category.tag)}
                    key={category.tag}
                    className={clsx(
                        'px-3.5 capitalize py-1 text-xs border border-gray-600 dark:hover:bg-gray-700 hover:bg-gray-700 hover:text-white dark:border-gray-700 rounded-full whitespace-nowrap focus:outline-none focus:ring-0',
                        activeTagFilter === category.tag
                        ? 'bg-gray-800 dark:border-gray-600 text-white border-gray-900'
                        : 'dark:bg-black dark:text-white text-gray-700 bg-white'  
                    )}
                >
                    {category.name}
                </button>
            ))}
            </div>
        </>
    )
}

export default CategoriesList