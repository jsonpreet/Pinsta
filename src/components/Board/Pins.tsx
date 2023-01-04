import Timeline from '@components/Common/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UI/Loader'
import { NoDataFound } from '@components/UI/NoDataFound'
import useAppStore from '@lib/store'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import { BoardPinsType, PinstaPublication } from '@utils/custom-types'
import { Profile, PublicationMainFocus, PublicationTypes, useProfilePostsQuery } from '@utils/lens/generated'
import { FC } from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
    pins: BoardPinsType[],
    postIds: string[],
    profile: Profile
}

const BoardPins: FC<Props> = ({ postIds, profile }) => {

    const currentProfile = useAppStore((state) => state.currentProfile);

    const request = {
        publicationIds: postIds,
        limit: 50,
        customFilters: LENS_CUSTOM_FILTERS,
        metadata: { mainContentFocus: [PublicationMainFocus.Image] },
    }

    const { data, loading, error, fetchMore } = useProfilePostsQuery({
        variables: { request },
        skip: !postIds
    });

    const pageInfo = data?.publications?.pageInfo
    
    const pins = data?.publications?.items as PinstaPublication[]

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
                    <Timeline pins={pins} />
                    {pageInfo?.next && pins.length !== pageInfo?.totalCount && (
                        <span ref={observe} className="flex justify-center p-10">
                            <Loader />
                        </span>
                    )}
                    {pins?.length === 0 &&
                        <NoDataFound isCenter withImage text="No pins found" />
                    }

                </>
            )}
        </>
    )
}

export default BoardPins