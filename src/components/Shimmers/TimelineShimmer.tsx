import React, { useMemo } from 'react'

import PinCardShimmer from './PinCardShimmer'
import Masonry from '@mui/lab/Masonry';

const TimelineShimmer = () => {
  const cards = useMemo(() => Array(32).fill(1), [])
  const heights = [200, 400, 300, 200, 300, 400, 100, 200, 400, 200, 100, 300, 400, 100, 400, 100, 200, 150, 300, 200, 300, 400, 100, 200, 400, 220, 100, 300, 400, 100, 400, 300]
  return (
    <div>
      <Masonry sx={{ margin: 0 }} columns={{ xs: 1, sm: 2, lg: 4, xl: 6, xxl: 8 }} spacing={2}>
        {cards.map((i, idx) => (
          <PinCardShimmer height={heights[idx]} key={`${i}_${idx}`} />
        ))}
      </Masonry>
    </div>
  )
}

export default TimelineShimmer

// const TimelineShimmer = () => {
//   const cards = useMemo(() => Array(16).fill(1), [])
//   return (
//     <div className='w-full lg:columns-7 sm:columns-3 gap-4'>
//       {cards.map((i, idx) => (
//         <PinCardShimmer height={heights[idx]} key={`${i}_${idx}`} />
//       ))}
//     </div>
//   )
// }
