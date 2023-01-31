import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Common/Timeline'
import { Loader } from '@components/UI/Loader'
import { NoDataFound } from '@components/UI/NoDataFound'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import { PinstaPublication } from '@utils/custom-types'
import { PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreQuery } from '@utils/lens/generated'
import React, {FC} from 'react'
import { useInView } from 'react-cool-inview'
import { getHashTags } from '@utils/functions/getHashTags'

interface Props {
    pin: PinstaPublication
}


const RelatedPins: FC<Props> = ({ pin }) => {
    const tags = pin?.metadata?.content ? getHashTags(pin.metadata.content) : []
    const request = {
        sortCriteria: PublicationSortCriteria.Latest,
        limit: 50,
        noRandomize: false,
        publicationTypes: [PublicationTypes.Post],
        customFilters: LENS_CUSTOM_FILTERS,
        metadata: {
            tags: tags.length > 0 ? { oneOf: tags } : undefined,
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
            {loading && <TimelineShimmer />}
            {!error && !loading && pins && (
                <>  
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center justify-center">
                            <h1 className="text-2xl font-black uppercase brandGradientText tracking-widest pb-4 relative">
                                <span>Related Pins</span>
                                <span className="absolute w-1/2 right-0 mx-auto bottom-0 left-0 h-1 bg-gradient-to-r from-[#df3f95] to-[#ec1e25]" />
                            </h1>
                        </div>
                        <Timeline pins={pins} currentPinId={pin?.id} />
                        {pageInfo?.next && pins.length !== pageInfo?.totalCount && (
                            <span ref={observe} className="flex justify-center p-10">
                                <Loader />
                            </span>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default RelatedPins