import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { FC, useState } from 'react'
import type { PinstaPublication } from '@utils/custom-types'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import imageCdn from '@utils/functions/imageCdn'
import { motion } from "framer-motion"
import getProfilePicture from '@utils/functions/getProfilePicture';

dayjs.extend(relativeTime)

type Props = {
  pin: PinstaPublication
}

const PinCard: FC<Props> = ({ pin }) => {
  const thumbnailUrl = imageCdn(getThumbnailUrl(pin), 'thumbnail_sm')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring", stiffness: 200, damping: 24
      }}
    >
      {!pin.hidden ? (
        <>
          <div className="overflow-hidden relative flex flex-col items-center">
            <Link href={`/pin/${pin.id}`} className='cursor-zoom group w-full flex bg-white rounded-lg relative flex-col' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
              {/* <img
                alt={`Pin`}
                src={thumbnailUrl}
                className='rounded-lg border bg-gray-100 w-full border-gray-100'
              /> */}
              <LazyLoadImage
                alt={`Pin`}
                delayTime={100}
                effect='opacity'
                // placeholderSrc='https://placekitten.com/300/500'
                wrapperClassName='w-full bg-white'
                src={thumbnailUrl}
                className={clsx('rounded-lg border w-full border-gray-100', {
                  'h-60': loading
                })}
                beforeLoad={() => setLoading(true)}
                afterLoad={() => setLoading(false)}
              />
              <span className={`${show ? `opacity-100` : `opacity-0`} rounded-lg flex absolute top-0 left-0 bg-black bg-opacity-40 delay-75 duration-75 w-full h-full cursor-zoom group flex-col items-start justify-start px-4 py-1`}></span>
            </Link>
            <div className='flex flex-col items-start w-full justify-start px-1 py-2'>
              <Link href={`/pin/${pin.id}`} className="flex space-x-2 items-center">
                <img
                  className="w-8 h-8 rounded-full"
                  src={getProfilePicture(pin.profile)}
                  alt={pin.profile?.handle}
                  draggable={false}
                />
                <span className='text-sm text-light text-gray-500 dark:text-gray-200 hover:text-gray-800'>{pin.profile?.handle}</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        null
      )}
    </motion.div>
  )
}

export default PinCard