/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { FC, useState } from 'react'
import type { BoardType, PinstaPublication } from '@utils/custom-types'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import { motion } from "framer-motion"
import getProfilePicture from '@utils/functions/getProfilePicture';
import { Loader } from '@components/UI/Loader'
import formatHandle from '@utils/functions/formatHandle'
import IsVerified from '@components/UI/IsVerified'
import { Router, useRouter } from 'next/router'
import { Analytics } from '@utils/analytics'
import { BsTrash } from 'react-icons/bs'
import usePersistStore from '@lib/store/persist'
import useAppStore from '@lib/store'
import { toast } from 'react-hot-toast'
import { PINSTA_SERVER_URL, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import axios from 'axios'

dayjs.extend(relativeTime)

type Props = {
  pin: PinstaPublication
  isBoard?: boolean
  board?: BoardType
}

const PinCard: FC<Props> = ({ pin, isBoard = false, board }) => {
  const router = useRouter()
  const isProfile = router.pathname === '/[username]'
  const thumbnailUrl = pin?.metadata?.media[0]?.original.mimeType === 'image/gif' ? getThumbnailUrl(pin) : imageCdn(getThumbnailUrl(pin), 'thumbnail_sm')
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const currentProfileId = usePersistStore((state) => state.currentProfileId)
  const currentProfile = useAppStore((state) => state.currentProfile)

  const unsavePin = async (pinId: string) => {
    if (!currentProfileId) {
      toast.error(SIGN_IN_REQUIRED_MESSAGE);
      return
    }
        
    setLoading(true)
    const request = {
      board_id: board?.id,
      user_id: currentProfileId,
      post_id: pin.id
    }
    return axios.post(`${PINSTA_SERVER_URL}/unsave-pin`,request).then((res) => {
      if (res.status === 200) {
        router.replace(window.location.pathname)
        console.log('Pin removed!')
        toast.success('Pin removed!')
        setLoading(false)
      } else {
        setLoading(false)
        toast.error('Error on removing pin!')
      }
    }).catch((err) => {
      setLoading(false)
      toast.error('Error on removing pin!')
    })
  }
  
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
          <div className="overflow-hidden group relative flex flex-col items-center">
            <Link 
              onClick={() => {
                Analytics.track('clicked_from_pin_card_pin_link', {
                  pin_id: pin.id
                })
              }}
              href={`/pin/${pin.id}`} 
              className='cursor-zoom group w-full flex z-0 bg-gray-100 dark:bg-gray-700 rounded-lg relative flex-col' 
              onMouseEnter={() => setShow(true)} 
              onMouseLeave={() => setShow(false)}
            >
              <img
                alt={`Pin by ${formatHandle(pin.profile?.handle)}`}
                src={thumbnailUrl}
                onLoad={() => setLoading(false)}
                className={clsx('rounded-lg border w-full dark:border-gray-700 border-gray-100', {
                  'h-60': loading
                })}
              />
              <span className={`${show ? `opacity-100` : `opacity-0`} rounded-lg flex absolute top-0 left-0 bg-black bg-opacity-40 delay-75 duration-75 w-full h-full cursor-zoom group flex-col items-start justify-start px-4 py-1`}></span>
              {loading ?
                <span className='absolute bg-gray-100 dark:bg-gray-700 top-0 rounded-lg left-0 right-0 bottom-0 h-full w-full flex items-center justify-center'>
                  <Loader/>
                </span>
                : null
              }
            </Link>
            {isBoard && currentProfileId === board?.user_id ? 
              //delete button
              <>
                <div 
                  className='absolute top-2 right-2 group-hover:opacity-100 opacity-0 flex items-center z-30 justify-center w-8 h-8 rounded-full bg-red-500 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation()
                    Analytics.track('clicked_from_pin_card_delete_button', {
                      pin_id: pin.id
                    })
                    unsavePin(pin.id)
                  }}
                >
                  <BsTrash className='text-white' />
                </div>
              </>
            : null}
            {!isProfile ?
              <>
                <div className='hidden md:flex flex-col items-start w-full justify-start px-1 pt-2'>
                  <Link 
                    onClick={() => {
                      Analytics.track('clicked_from_pin_card_profile_link', {
                        pin_id: pin.id,
                        profile_id: pin.profile?.id
                      })
                    }}
                    href={`/${formatHandle(pin.profile?.handle)}`} 
                    className="flex space-x-2 items-center"
                  >
                    <img
                      className="w-7 h-7 rounded-full"
                      src={getProfilePicture(pin.profile)}
                      alt={pin.profile?.handle}
                      draggable={false}
                    />
                    <div className='flex space-x-0.5 items-center'>
                      <span
                        className='text-sm text-light text-gray-500 dark:text-gray-200 hover:text-gray-800'>
                        {/* {pin.profile?.name ?? formatHandle(pin.profile?.handle)} */}
                        {formatHandle(pin.profile?.handle)}
                      </span>
                      <IsVerified id={pin.profile?.id} size='xs' />
                    </div>
                  </Link>
                  
                </div>
              </> : null}
          </div>
        </>
      ) : (
        null
      )}
    </motion.div>
  )
}

export default PinCard