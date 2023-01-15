import { NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/router';
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants';
import { PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreQuery } from '@utils/lens/generated';
import { PinstaPublication } from '@utils/custom-types';
import { NoDataFound } from '@components/UI/NoDataFound';
import TimelineShimmer from '@components/Shimmers/TimelineShimmer';
import MetaTags from '@components/Common/MetaTags';
import { Loader } from '@components/UI/Loader';
import { useInView } from 'react-cool-inview';
import Timeline from '@components/Common/Timeline';

const Hashtag: NextPage = () => {
  const router = useRouter()
  const { tag } = router.query

  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    limit: 50,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags: tag ? { oneOf: [tag] } : undefined,
      mainContentFocus: [PublicationMainFocus.Image]
    }
  }

    
  const { data, loading, error, fetchMore } = useExploreQuery({
    // @ts-ignore
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
          {pageInfo?.next && pins.length !== pageInfo?.totalCount && pageInfo?.totalCount !== null && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Hashtag