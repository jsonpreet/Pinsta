import MetaTags from '@components/Common/MetaTags'
import type { NextPage } from 'next'
import Timeline from '@components/Common/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/Shared/Loader'
import { NoDataFound } from '@components/Shared/NoDataFound'
import { PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreQuery } from '@utils/lens'
import { useInView } from 'react-cool-inview'
import type { PinstaPublication } from '@utils/custom-types'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import useAppStore from '@lib/store'
import clsx from 'clsx'

interface ExploreFilters {
    [key: string]: PublicationSortCriteria
}

const Explore: NextPage = () => {
    const activeTagFilter = useAppStore((state) => state.activeTagFilter)
    const setActiveSortFilter = useAppStore((state) => state.setActiveSortFilter)
    const activeSortFilter = useAppStore((state) => state.activeSortFilter)
    const FILTERS : ExploreFilters = {
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
            
            <div className="flex justify-start pb-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setActiveSortFilter('collected')}
                        className={clsx(
                            'text-sm border-b-2 pb-1.5', 
                            activeSortFilter === 'collected' ? 'text-gray-900 border-gray-900' : 'text-gray-600 border-transparent'
                        )}
                    >
                        Top Collected
                    </button>
                    <button
                        onClick={() => setActiveSortFilter('commented')}
                        className={clsx(
                            'text-sm border-b-2 pb-1.5', 
                            activeSortFilter === 'commented' ? 'text-gray-900 border-gray-900' : 'text-gray-600 border-transparent'
                        )}
                    >
                        Top Commented
                    </button>
                    <button
                        onClick={() => setActiveSortFilter('mirrored')}
                        className={clsx(
                            'text-sm border-b-2 pb-1.5', 
                            activeSortFilter === 'mirrored' ? 'text-gray-900 border-gray-900' : 'text-gray-600 border-transparent'
                        )}
                    >
                        Top Mirrored
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