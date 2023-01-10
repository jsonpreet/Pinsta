import { useLazyQuery } from '@apollo/client'
import { Loader } from '@components/UI/Loader'
import clsx from 'clsx'
import type { Profile } from '@utils/lens'
import { SearchProfilesDocument, SearchPublicationsDocument, SearchRequestTypes } from '@utils/lens'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { LENS_CUSTOM_FILTERS } from '@utils/constants'
import useDebounce from '@hooks/useDebounce'
import useOutsideClick from '@hooks/useOutsideClick'
import { BsSearch } from "react-icons/bs";

import Profiles from './Profiles'
import { useDetectClickOutside } from 'react-detect-click-outside';
import { TAGS } from '@utils/data/tags'
import Tag from '../Cards/Tag'

interface Props {
  onSearchResults?: () => void
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
    const [activeSearch, setActiveSearch] = useState(SearchRequestTypes.Profile)
    const [keyword, setKeyword] = useState('')
    const debouncedValue = useDebounce<string>(keyword, 500)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [results, setResults] = useState('')
    const [showResults, setShowResults] = useState(false)
    const [showLoader, setLoader] = useState(false)

    const resultsRef = useRef(null)
    useOutsideClick(resultsRef, () => setKeyword(''))

    const [searchChannels, { data, loading }] = useLazyQuery(
        activeSearch === 'PROFILE'
        ? SearchProfilesDocument
        : SearchPublicationsDocument
    )

    const onDebounce = () => {
        if (keyword.trim().length) {
            searchChannels({
                variables: {
                request: {
                    type: activeSearch,
                    query: keyword,
                    limit: 10,
                    customFilters: LENS_CUSTOM_FILTERS
                }
                }
            })
        }
    }

    // @ts-ignore
    const channels = data?.search?.items

    useEffect(() => {
        onDebounce()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, activeSearch])

    const clearSearch = () => {
        setKeyword('')
        onSearchResults?.()
    }

    const isShowSuggestions = () => {
        if (keyword.length > 0) {
            setShowSuggestions(false)
            setShowResults(true)
        } else {
            setShowSuggestions(true)
            setShowResults(false)
        }
    }

    const onSearch = ((e: any) => {
        if (e.target.value.length > 0) {
            setLoader(true)
            setShowResults(true);
            setKeyword(e.target.value);
            setShowSuggestions(false);
        } else {
            setLoader(false)
            setShowSuggestions(true);
            setShowResults(false);
            setKeyword('');
        }
    });

    const closeSearch = () => {
        setShowSuggestions(false)
        setShowResults(false)
    }

    const searchRef = useDetectClickOutside({ onTriggered: closeSearch, triggerKeys: ['Escape', 'x'], });

    return (
        <>
            {/* <div 
                className={` ${(showSuggestions || showResults) ? `visible` : `hidden`} fixed left-0 top-0 w-full h-screen bg-black/70 z-10`} 
            /> */}
        
            <div className="w-full">
                <div>
                    <div className="relative">
                        <div
                            ref={searchRef} 
                            className="relative w-full overflow-hidden border border-gray-300 cursor-default dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-full sm:text-sm">
                            <input
                                className="w-full py-3 pl-12 pr-4 text-sm bg-transparent focus:outline-none"
                                onChange={(e) => onSearch(e)}
                                onClick={() => isShowSuggestions()}
                                placeholder="Search"
                                value={keyword}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                <BsSearch
                                    className="w-4 h-4 text-gray-600"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                        <div
                            className="absolute top-[60px] w-full bg-white rounded-br-xl py-2 rounded-bl-xl shadow-2xl"
                        >
                            {loading && <div className="flex flex-row items-center py-8 justify-center">
                                <Loader className={`h-7 w-7 text-[#ec05ad]`} /></div>
                            }
                            {showResults &&
                                <div className="flex flex-col max-h-96 overflow-x-hidden overflow-y-scroll" >
                                    {data?.search?.__typename === 'ProfileSearchResult' && (
                                        <Profiles
                                            results={channels as Profile[]}
                                            loading={loading}
                                            clearSearch={clearSearch}
                                        />
                                    )}
                                </div>
                            }
                            {/* {showSuggestions &&
                                <div className="flex flex-col">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-between items-center px-4 pt-4">
                                            <p className="font-semibold">Popular</p>
                                        </div>
                                        <div className="flex flex-row justify-center items-center pb-0 px-2">
                                            <div className='grid grid-cols-5 gap-2 p-2 mb-4 w-full'>
                                                {TAGS?.map((tag, index) => (
                                                    <Tag tag={tag.name} key={index} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default GlobalSearchBar

