import MetaTags from '@components/Common/MetaTags'
import type { NextPage } from 'next'
import Timeline from '@components/Common/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UI/Loader'
import { NoDataFound } from '@components/UI/NoDataFound'
import { PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreQuery } from '@utils/lens'
import { useInView } from 'react-cool-inview'
import type { PinstaPublication } from '@utils/custom-types'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import { useEffect } from 'react'
import { Analytics, TRACK } from '@utils/analytics'

interface ExploreFilters {
    [key: string]: PublicationSortCriteria
}

const Explore: NextPage = () => {
    const activeTagFilter = useAppStore((state) => state.activeTagFilter)
    const setActiveSortFilter = useAppStore((state) => state.setActiveSortFilter)
    const activeSortFilter = useAppStore((state) => state.activeSortFilter)
    const currentProfile = useAppStore((state) => state.currentProfile)

    useEffect(() => {
        if (currentProfile) {
            setActiveSortFilter('profiles')
        }
        Analytics.track(TRACK.PAGE_VIEW.EXPLORE)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const FILTERS : ExploreFilters = {
        'profiles': PublicationSortCriteria.CuratedProfiles,
        'collected': PublicationSortCriteria.TopCollected,
        'commented': PublicationSortCriteria.TopCommented,
        'mirrored': PublicationSortCriteria.TopMirrored,
    }

    const request = {
        sortCriteria: FILTERS[activeSortFilter],
        limit: 50,
        noRandomize: false,
        publicationTypes: [PublicationTypes.Post],
        customFilters: LENS_CUSTOM_FILTERS,
        metadata: {
            tags: activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
            mainContentFocus: [PublicationMainFocus.Image]
        }
    }

    const { data, loading, error, fetchMore } = useExploreQuery({
        variables: { request }
    })

    const pageInfo = data?.explorePublications?.pageInfo
    
    const pins = data?.explorePublications?.items as PinstaPublication[]

    const { observe } = useInView({
        rootMargin: SCROLL_ROOT_MARGIN,
        onEnter: async () => {
            await fetchMore({
                variables: {
                    request: {
                        ...request,
                        cursor: pageInfo?.next
                    }
                }
            })
        }
    })

    // if (pins?.length === 0) {
    //     return <NoDataFound isCenter withImage text="No pins found" />
    // }

    return (
        <>
            <MetaTags />
            
            <div className="flex justify-center p-4 md:px-0">
                <div className="flex bg-white dark:bg-gray-900 bg-gradient-to-r from-[#df3f95] to-[#ec1e25] rounded-full py-2 px-2 items-center space-x-2">
                    {currentProfile ? (
                        <button
                            onClick={() => setActiveSortFilter('profiles')}
                            className={clsx(
                                'text-sm p-2 rounded-full', 
                                activeSortFilter === 'profiles' ? 'bg-white text-gray-800' : 'text-white'
                            )}
                        >
                            <span className='md:inline-flex hidden'>Top</span> Profiles
                        </button>
                    ): null}
                    <button
                        onClick={() => setActiveSortFilter('collected')}
                        className={clsx(
                            'text-sm p-2 rounded-full', 
                            activeSortFilter === 'collected' ? 'bg-white text-gray-800' : 'text-white'
                        )}
                    >
                        <span className='md:inline-flex hidden'>Top</span> Collected
                    </button>
                    <button
                        onClick={() => setActiveSortFilter('commented')}
                        className={clsx(
                            'text-sm p-2 rounded-full', 
                            activeSortFilter === 'commented' ? 'bg-white text-gray-800' : 'text-white'
                        )}
                    >
                        <span className='md:inline-flex hidden'>Top</span> Commented
                    </button>
                    <button
                        onClick={() => setActiveSortFilter('mirrored')}
                        className={clsx(
                            'text-sm p-2 rounded-full', 
                            activeSortFilter === 'mirrored' ? 'bg-white text-gray-800' : 'text-white'
                        )}
                    >
                        <span className='md:inline-flex hidden'>Top</span> Mirrored
                    </button>
                </div>
            </div>
            {pins?.length === 0 &&
                <NoDataFound isCenter withImage text="No pins found" />
            }
            {loading && <TimelineShimmer />}
            {!error && !loading && pins && (
                <>  
                    <Timeline pins={pins} />
                    {pins?.length > 0 && pageInfo?.next && pins.length !== pageInfo?.totalCount && (
                        <span ref={observe} className="flex justify-center p-10">
                            <Loader />
                        </span>
                    )}
                </>
            )}
        </>
    )
}

export default Explore