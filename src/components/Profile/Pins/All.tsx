import BoardPins from '@components/Board/Pins'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UI/NoDataFound'
import { FetchProfilePins } from '@lib/db/actions'
import usePersistStore from '@lib/store/persist'
import { Profile } from '@utils/lens/generated'
import { FC } from 'react'

interface Props {
    profile: Profile
}

const AllPins: FC<Props> = ({profile}) => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const { isFetched, isLoading, data: pins } = FetchProfilePins(profile?.id)

    const postIds = isFetched && pins?.map((pin: { postId: string }) => pin.postId)

    if (isLoading) {
        return <TimelineShimmer />
    }
    
    return (
        <>
            {isFetched && postIds?.length > 0 ?
                <>
                    <div className='flex flex-col space-y-4'>
                        <h3 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>Unorganized Pins</h3>
                        <BoardPins postIds={postIds} />
                    </div> 
                </>
                : <NoDataFound isCenter withImage text="No pins found" />
            }
        </>
    )
}

export default AllPins