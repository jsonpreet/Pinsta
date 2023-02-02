import QueuedPinCard from '@components/Common/Cards/QueuedPinCard';
import Timeline from '@components/Common/Timeline';
import TimelineShimmer from '@components/Shimmers/TimelineShimmer';
import { Loader } from '@components/UI/Loader';
import { NoDataFound } from '@components/UI/NoDataFound';
import useAppStore from '@lib/store';
import usePersistStore from '@lib/store/persist';
import Masonry from '@mui/lab/Masonry';
import { Analytics, TRACK } from '@utils/analytics';
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants';
import { PinstaMainContentFocus, PinstaPublication } from '@utils/custom-types';
import { Profile, PublicationMainFocus, PublicationTypes, useProfilePostsQuery } from '@utils/lens/generated'
import {FC, useEffect} from 'react'
import { useInView } from 'react-cool-inview';

interface Props {
    profile: Profile
}

const Created: FC<Props> = ({ profile }) => {
    
    const queuedPublications = usePersistStore((state) => state.queuedPublications)

    const request = {
        publicationTypes: [PublicationTypes.Post],
        limit: 50,
        customFilters: LENS_CUSTOM_FILTERS,
        profileId: profile?.id,
        metadata: { mainContentFocus: PinstaMainContentFocus },
    }
    
    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.ALLPIN)
    }, [])

    const { data, loading, error, fetchMore } = useProfilePostsQuery({
        variables: { request },
        skip: !profile?.id
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

    if (pins?.length === 0) {
        return <NoDataFound isCenter withImage text="No pins found" />
    }

    return (
        <>
            {queuedPublications.length === 0 && loading && <TimelineShimmer />}
            {queuedPublications.length > 0 ?
                <>
                    <div className='md:-mx-2 md:px-0 px-2'>
                        <Masonry sx={{ margin: 0 }} columns={{ xs: 2, sm: 2, lg: 4, xl: 6, xxl: 8 }} spacing={2}>
                            {queuedPublications?.map((pin: any, index: number) => {
                                return <QueuedPinCard key={index} pin={pin} />
                            })} 
                        </Masonry>
                    </div>
                </>
            : null}
            {!error && !loading && (
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

export default Created