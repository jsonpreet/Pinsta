import PinCard from '@components/Common/Cards/Pin'
import type { FC } from 'react'
import type { PinstaPublication } from '@utils/custom-types'
import Masonry from '@mui/lab/Masonry';

type Props = {
    pins: PinstaPublication[]
    pinType?: 'Post'
}

const Timeline: FC<Props> = ({ pins, pinType = 'Post' }) => {
    return (
        <>
            <div className='-mx-2'>
                <Masonry sx={{ margin: 0 }} columns={{ xs: 1, sm: 2, lg: 4, xl: 7, xxl: 8 }} spacing={2}>
                    {pins?.map((pin: PinstaPublication) => {
                        const isPub = pin.__typename === pinType
                        return <PinCard key={`${pin?.id}_${pin.createdAt}_${pin.__typename}`} pin={pin} />
                    })} 
                </Masonry>
            </div>
        </>
    )
}

export default Timeline