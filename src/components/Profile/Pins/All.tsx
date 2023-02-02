
import { Profile } from '@utils/lens/generated'
import { FC } from 'react'
import BoardPins from './Common/Pins'

interface Props {
    profile: Profile
    pins: any
    refetchSavedPins: () => void
}

const AllPins: FC<Props> = ({profile, pins, refetchSavedPins}) => {
    const postIds = pins?.length > 0 ? pins?.map((pin: { post_id: string }) => pin.post_id) : []
    
    return (
        <>
            {pins && postIds?.length > 0 ?
                <>
                    <div className='flex flex-col space-y-4'>
                        <h3 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>
                            Unorganized Pins
                        </h3>
                        <BoardPins refetchSavedPins={refetchSavedPins} pins={pins} postIds={postIds} />
                    </div> 
                </>
                : null
            }
        </>
    )
}

export default AllPins