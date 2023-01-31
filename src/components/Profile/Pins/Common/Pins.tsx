import Timeline from '@components/Common/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UI/Loader'
import { NoDataFound } from '@components/UI/NoDataFound'
import useAppStore from '@lib/store'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import { BoardPinsType, BoardType, PinstaPublication } from '@utils/custom-types'
import { Profile, PublicationMainFocus, PublicationTypes, useProfilePostsQuery, usePublicationsByIdsQuery } from '@utils/lens/generated'
import { FC } from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
    postIds: string[],
    board?: BoardType,
    pins?: BoardPinsType
}

const BoardPins: FC<Props> = ({ postIds, board, pins }) => {

    const currentProfile = useAppStore((state) => state.currentProfile);

    const request = {
        publicationIds: postIds,
        limit: 50,
        customFilters: LENS_CUSTOM_FILTERS,
        metadata: { mainContentFocus: [PublicationMainFocus.Image] },
    }

    const { data, loading, error, fetchMore } = usePublicationsByIdsQuery({
        fetchPolicy: 'no-cache',
        variables: { request },
        skip: !postIds
    });

    const pageInfo = data?.publications?.pageInfo
    
    const profilePins = data?.publications?.items as PinstaPublication[]

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
            {loading && <TimelineShimmer />}
            {!error && !loading && (
                <>
                    <Timeline pins={profilePins} isAllPins={true} allPins={pins} />
                    {pageInfo?.next && profilePins.length !== pageInfo?.totalCount && pageInfo?.totalCount !== null && (
                        <span ref={observe} className="flex justify-center p-10">
                            <Loader />
                        </span>
                    )}
                    {profilePins?.length === 0 &&
                        <NoDataFound isCenter withImage text="No pins found" />
                    }
                </>
            )}
        </>
    )
}

export default BoardPins