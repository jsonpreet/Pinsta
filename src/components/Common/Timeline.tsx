import PinCard from '@components/Common/Cards/Pin'
import type { FC } from 'react'
import type { BoardPinsType, BoardType, PinstaPublication } from '@utils/custom-types'
import Masonry from '@mui/lab/Masonry';

type Props = {
    pins: PinstaPublication[]
    pinType?: 'Post'
    isBoard?: boolean
    isAllPins?: boolean
    currentPinId?: string
    board?: BoardType
    allPins?: BoardPinsType
    isHome?: boolean
}

const Timeline: FC<Props> = ({
    pins,
    pinType = 'Post',
    board,
    currentPinId,
    isBoard = false,
    isAllPins = false,
    isHome = false,
    allPins
}) => {
    return (
        <>
            <div className='md:-mx-2 md:px-0 px-2'>
                <Masonry sx={{ margin: 0 }} columns={{ xs: 2, sm: 2, lg: 4, xl: 6, xxl: 8 }} spacing={2}>
                    {pins?.map((pin: PinstaPublication) => {
                        // @ts-ignore
                        const pinId = isHome ? pin?.root?.id : pin.id;
                        const isCurrentPin = pinId === currentPinId
                       // const isPub = pin.__typename === pinType
                        if (isCurrentPin) return null
                        return <PinCard
                            board={board}
                            isAllPins={isAllPins}
                            allPins={allPins}
                            isBoard={isBoard}
                            // @ts-ignore
                            key={`${isHome ? pin?.root?.id : pin?.id}_${pin.createdAt}_${pin.__typename}`}
                            // @ts-ignore
                            pin={isHome ? pin?.root : pin}
                        />
                    })} 
                </Masonry>
            </div>
        </>
    )
}

export default Timeline