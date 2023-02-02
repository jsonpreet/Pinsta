import MetaTags from '@components/Common/MetaTags'
import type { NextPage } from 'next'
import Timeline from '@components/Common/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UI/Loader'
import { NoDataFound } from '@components/UI/NoDataFound'
import { FeedEventItemType, FeedRequest, PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreQuery, useFeedQuery } from '@utils/lens'
import { useInView } from 'react-cool-inview'
import { PinstaMainContentFocus, PinstaPublication } from '@utils/custom-types'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import { useEffect } from 'react'

const Feed = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const getFeedEventItems = () => {
    const filters: FeedEventItemType[] = [];
    filters.push(FeedEventItemType.Post); //, FeedEventItemType.ReactionPost, FeedEventItemType.ReactionComment, FeedEventItemType.Comment
    return filters;
  };

  useEffect(() => {
    Analytics.track(TRACK.PAGE_VIEW.FEED)
  }, [])

  const profileId = currentProfile?.id;
  const request: FeedRequest = {
    profileId,
    limit: 50,
    feedEventItemTypes: getFeedEventItems(),
    metadata: {
      mainContentFocus: PinstaMainContentFocus
    }
  };
  const reactionRequest = currentProfile ? { profileId } : null;

  const { data, loading, error, fetchMore } = useFeedQuery({
    variables: { request, reactionRequest, profileId }
  });

  const pageInfo = data?.feed?.pageInfo

  const pins = data?.feed?.items as unknown as PinstaPublication[];
  const hasMore = pageInfo?.next && pins?.length !== pageInfo.totalCount;

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
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
            isHome={true}
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

export default Feed