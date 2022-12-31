import PinCard from '@components/Common/Cards/Pin'
import type { FC } from 'react'
import type { PinstaPublication } from '@utils/custom-types'
import Masonry from '@mui/lab/Masonry';

type Props = {
    pins: PinstaPublication[]
    pinType?: 'Post'
    currentPinId?: string
}

const Timeline: FC<Props> = ({ pins, pinType = 'Post' , currentPinId}) => {
    return (
        <>
            <div className='-mx-2'>
                <Masonry sx={{ margin: 0 }} columns={{ xs: 2, sm: 2, lg: 4, xl: 7, xxl: 8 }} spacing={2}>
                    {pins?.map((pin: PinstaPublication) => {
                        const isCurrentPin = pin.id === currentPinId
                        const isPub = pin.__typename === pinType
                        if (isCurrentPin || !isPub) return null
                        return <PinCard key={`${pin?.id}_${pin.createdAt}_${pin.__typename}`} pin={pin} />
                    })} 
                </Masonry>
            </div>
        </>
    )
}

export default Timeline