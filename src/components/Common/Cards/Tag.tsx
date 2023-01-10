import { LENS_CUSTOM_FILTERS } from "@utils/constants"
import { PinstaPublication } from "@utils/custom-types"
import getThumbnailUrl from "@utils/functions/getThumbnailUrl"
import imageCdn from "@utils/functions/imageCdn"
import { PublicationMainFocus, PublicationSortCriteria, PublicationTypes, useExploreQuery } from "@utils/lens/generated"
import { FC } from "react"
import Link from 'next/link';

interface Props {
    tag: string
}

const Tag: FC<Props> = ({ tag }) => {
    const request = {
        sortCriteria: PublicationSortCriteria.Latest,
        limit: 5,
        noRandomize: false,
        publicationTypes: [PublicationTypes.Post],
        customFilters: LENS_CUSTOM_FILTERS,
        metadata: {
            tags: { oneOf: [tag] },
            mainContentFocus: [PublicationMainFocus.Image]
        }
    }

    const { data, loading, error, fetchMore } = useExploreQuery({
        variables: { request }
    })
    
    const pins = data?.explorePublications?.items as PinstaPublication[]
    
    return (
        <>
            {/* {!error && !loading && pins.length > 0 && ( */}
                <Link
                    href={`/hashtag/${tag.toLowerCase()}`} 
                    className='flex flex-col w-full lg:h-24 h-20 items-center justify-center relative'
                >
                {!error && !loading && pins.length > 0 &&
                    <div
                        className='w-full h-full bg-cover bg-center rounded-lg'
                        style={{ backgroundImage: `url(${imageCdn(getThumbnailUrl(pins[0]), 'thumbnail_sm')})` }}
                    ></div>
                }
                    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 rounded-lg'></div>
                    <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                        <div className='text-white text-md font-bold lowercase'>#{tag}</div>
                    </div>
                </Link>
            {/* )} */}
        </>
    )
}

export default Tag