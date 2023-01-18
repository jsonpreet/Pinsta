import PinCard from '@components/Common/Cards/Pin'
import type { FC } from 'react'
import type { BoardType, PinstaPublication } from '@utils/custom-types'
import Masonry from '@mui/lab/Masonry';
import { v4 as uuidv4 } from 'uuid'

type Props = {
    pins: PinstaPublication[]
    pinType?: 'Post'
    isBoard?: boolean
    currentPinId?: string
    board?: BoardType
}

const Timeline: FC<Props> = ({ pins, pinType = 'Post', board, currentPinId, isBoard = false}) => {
    return (
        <>
            <div className='md:-mx-2 md:px-0 px-2'>
                <Masonry sx={{ margin: 0 }} columns={{ xs: 2, sm: 2, lg: 4, xl: 6, xxl: 8 }} spacing={2}>
                    {pins?.map((pin: PinstaPublication) => {
                        const isCurrentPin = pin.id === currentPinId
                        const isPub = pin.__typename === pinType
                        if (isCurrentPin) return null
                        return <PinCard board={board} isBoard={isBoard} key={`${pin?.id}_${pin.createdAt}_${pin.__typename}`} pin={pin} />
                    })} 
                </Masonry>
            </div>
        </>
    )
}

export default Timeline