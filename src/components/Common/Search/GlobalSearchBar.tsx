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

interface Props {
  onSearchResults?: () => void
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
    const [activeSearch, setActiveSearch] = useState(SearchRequestTypes.Profile)
    const [keyword, setKeyword] = useState('')
    const debouncedValue = useDebounce<string>(keyword, 500)
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

    return (
        <div className="w-full">
            <div ref={resultsRef}>
                <div className="relative">
                    <div className="relative w-full overflow-hidden border border-gray-200 cursor-default dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-full sm:text-sm">
                        <input
                            className="w-full py-3 pl-12 pr-4 text-sm bg-transparent focus:outline-none"
                            onChange={(event) => setKeyword(event.target.value)}
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
                        className={clsx(
                        'md:absolute w-full z-10 mt-1 text-base bg-white dark:bg-gray-800 overflow-hidden dark:bg-theme rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                        { hidden: debouncedValue.length === 0 }
                        )}
                    >
                        {data?.search?.__typename === 'ProfileSearchResult' && (
                            <Profiles
                                results={channels as Profile[]}
                                loading={loading}
                                clearSearch={clearSearch}
                            />
                        )}
                        {loading && (
                        <div className="flex justify-center p-5">
                            <Loader />
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GlobalSearchBar