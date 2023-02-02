import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Common/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UI/Loader'
import { NoDataFound } from '@components/UI/NoDataFound'
import { PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreQuery } from '@utils/lens'
import { useInView } from 'react-cool-inview'
import { PinstaMainContentFocus, PinstaPublication } from '@utils/custom-types'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import { useEffect } from 'react'

const Explore = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  useEffect(() => {
    Analytics.track(TRACK.PAGE_VIEW.HOME)
  }, [])

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags: activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: PinstaMainContentFocus
    }
  }

  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: { request }
  })

  const pageInfo = data?.explorePublications?.pageInfo

  const pins = data?.explorePublications?.items as PinstaPublication[];
  const hasMore = pageInfo?.next && pins?.length !== pageInfo.totalCount;

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      })
    }
  })

  if (pins?.length === 0) {
    return <NoDataFound isCenter withImage text="No pins found" />
  }

  return (
    <>
      <MetaTags />
      {loading && <TimelineShimmer />}
      {!error && !loading && pins && (
        <>  
          <Timeline
            pins={pins}
          />
          {hasMore && (
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