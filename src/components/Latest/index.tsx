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

const Latest: NextPage = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
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

  if (pins?.length === 0) {
    return <NoDataFound isCenter withImage text="No pins found" />
  }
  return (
    <>
      <MetaTags />
      {loading && <TimelineShimmer />}
      {!error && !loading && pins && (
        <>  
          <Timeline pins={pins} />
          {pageInfo?.next && pins.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Latest