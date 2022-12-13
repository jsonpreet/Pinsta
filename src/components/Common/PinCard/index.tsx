import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { FC, useState } from 'react'
import type { PinstaPublication } from '@utils/custom-types'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import imageCdn from '@utils/functions/imageCdn'

dayjs.extend(relativeTime)

type Props = {
  pin: PinstaPublication
}

const PinCard: FC<Props> = ({ pin }) => {
  //const thumbnailUrl = getThumbnailUrl(pin)

  const thumbnailUrl = imageCdn(getThumbnailUrl(pin))
  const [loading, setLoading] = useState(false)

  return (
    <div className="group">
      {!pin.hidden ? (
        <>
          <div className="bg-white rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
            <Link href={`/pin/${pin.id}`} className='cursor-zoom group w-full flex relative flex-col'>
              {/* <img
                className="object-cover bg-gray-100 rounded-lg border cursor-pointer dark:bg-gray-800 dark:border-gray-700/80"
                loading="lazy"
                height={1000}
                width={1000}
                src={thumbnailUrl}
                alt={`Pin`}
              /> */}
              <LazyLoadImage
                alt={`Pin`}
                effect='blur'
                wrapperClassName='w-full'
                placeholderSrc='https://placekitten.com/300/500'
                src={thumbnailUrl}
                className={clsx('rounded-xl border w-full border-gray-100', {
                  'h-80': loading
                })}
                beforeLoad={() => setLoading(true)}
                afterLoad={() => setLoading(false)}
              />
            </Link>
          </div>
        </>
      ) : (
        null
      )}
    </div>
  )
}

export default PinCard