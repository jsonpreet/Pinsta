import { useLazyQuery } from '@apollo/client'
import { Loader } from '@components/UI/Loader'
import clsx from 'clsx'
import type { Profile } from '@utils/lens'
import { SearchProfilesDocument, SearchPublicationsDocument, SearchRequestTypes } from '@utils/lens'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { LENS_CUSTOM_FILTERS, PINSTA_SERVER_URL } from '@utils/constants'
import useDebounce from '@utils/hooks/useDebounce'
import useOutsideClick from '@hooks/useOutsideClick'
import { BsSearch } from "react-icons/bs";

import Profiles from './Profiles'
import { useDetectClickOutside } from 'react-detect-click-outside';
import { TAGS } from '@utils/data/tags'
import Tag from '../Cards/Tag'
import { Analytics, TRACK } from '@utils/analytics'
import axios from 'axios'
import Link from 'next/link'
import { BoardsType } from '@utils/custom-types'
import Boards from './Boards'

interface Props {
  onSearchResults?: () => void
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
    const [activeSearch, setActiveSearch] = useState(SearchRequestTypes.Profile)
    const [keyword, setKeyword] = useState('')
    const debouncedValue = useDebounce<string>(keyword, 500)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [results, setResults] = useState('')
    const [boards, setBoards] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [showLoader, setLoader] = useState(false)

    const resultsRef = useRef(null)
    useOutsideClick(resultsRef, () => setKeyword(''))

    const [searchProfiles, { data, loading }] = useLazyQuery(
        activeSearch === 'PROFILE'
        ? SearchProfilesDocument
        : SearchPublicationsDocument
    )

    const boardSearch = async (payload : {keyword: string}) => {
        Analytics.track('Board Search!', {
            query: payload.keyword,
        })
        return await axios.post(`${PINSTA_SERVER_URL}/board-search`, { query: payload.keyword }).then((res) => {
            if (res.data.data && res.data.data.length > 0) {
                setBoards(res.data.data)
                return
            }
        }).catch((err) => {
            console.log(err)
            return
        })
    }

    const onDebounce = () => {
        if (keyword.trim().length) {
            searchProfiles({
                variables: {
                    request: {
                        type: activeSearch,
                        query: keyword,
                        limit: 5,
                        customFilters: LENS_CUSTOM_FILTERS
                    }
                }
            })
            boardSearch({
                keyword: keyword,
            })
        }
    }

    // @ts-ignore
    const profiles = data?.search?.items

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
            Analytics.track(TRACK.SEARCH_PROFILES, {
                search: e.target.value
            })
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
                            className="relative md:absolute top-0 md:top-[60px] w-full bg-white dark:bg-gray-900 rounded-br-xl rounded-bl-xl md:shadow-2xl"
                        >
                            {loading && <div className="flex flex-row items-center py-8 justify-center">
                                <Loader size='sm' /></div>
                            }
                            {showResults &&
                                <div className="flex flex-col max-h-96 py-2 overflow-x-hidden overflow-y-scroll" >
                                    {boards.length > 0 &&
                                        <div className="flex flex-col">
                                            <>
                                                <Boards
                                                    results={boards as BoardsType}
                                                    loading={loading}
                                                    clearSearch={clearSearch}
                                                />
                                            </>
                                        </div>
                                    }
                                    <div className="flex flex-col">
                                        {data?.search?.__typename === 'ProfileSearchResult' && (
                                            <Profiles
                                                results={profiles as Profile[]}
                                                loading={loading}
                                                clearSearch={clearSearch}
                                            />
                                        )}
                                    </div>
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

