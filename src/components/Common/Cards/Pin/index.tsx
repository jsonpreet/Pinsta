/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { FC, useState } from 'react'
import type { BoardPinsType, BoardType, PinstaPublication } from '@utils/custom-types'
import { motion } from "framer-motion"
import getProfilePicture from '@utils/functions/getProfilePicture';
import formatHandle from '@utils/functions/formatHandle'
import IsVerified from '@components/UI/IsVerified'
import { useRouter } from 'next/router'
import { Analytics } from '@utils/analytics'
import { BsTrash } from 'react-icons/bs'
import usePersistStore from '@lib/store/persist'
import useAppStore from '@lib/store'
import { toast } from 'react-hot-toast'
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, AVATAR, PINSTA_SERVER_URL, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import axios from 'axios'
import getAttributeFromTrait from '@utils/functions/getAttributeFromTrait'
import ImageCard from './Image'
import VideoCard from './Video'

dayjs.extend(relativeTime)

type Props = {
  pin: PinstaPublication
  isBoard?: boolean
  board?: BoardType
  allPins?: BoardPinsType
  isAllPins?: boolean
  refetchSavedPins?: () => void
}

const PinCard: FC<Props> = ({pin, isBoard = false, board, isAllPins = false, allPins, refetchSavedPins }) => {
  const router = useRouter()
  const isProfile = router.pathname === '/[username]'
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const currentProfileId = usePersistStore((state) => state.currentProfileId)
  const currentProfile = useAppStore((state) => state.currentProfile)

  const isVideo = ALLOWED_VIDEO_TYPES.includes(pin?.metadata?.media[0]?.original.mimeType)
  const isImage = ALLOWED_IMAGE_TYPES.includes(pin?.metadata?.media[0]?.original.mimeType)

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
        console.log('Pin removed!')
        toast.success('Pin removed!')
        if (refetchSavedPins) {
          refetchSavedPins()
        }
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


  // @ts-ignore
  const isUserPin = allPins?.map((pin: any) => pin.user_id === currentProfileId).includes(true)
  return (
    <>
      {!pin.hidden ? (
        <motion.div
          className="group"
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring", stiffness: 200, damping: 24
          }}
        >
          <div className="overflow-hidden group relative flex flex-col items-center">
            <Link 
              onClick={() => {
                Analytics.track('clicked_from_pin_card_pin_link', {
                  pin_id: pin.id
                })
              }}
              href={`/pin/${pin.id}`} 
              className={clsx(
                'group w-full flex z-0 bg-gray-100 dark:bg-gray-700 rounded-lg relative flex-col',
                isImage ? 'cursor-zoom' : ' '
              )}
              onMouseEnter={() => setShow(true)} 
              onMouseLeave={() => setShow(false)}
            >
              {isImage && (
                <ImageCard pin={pin} />
              )}
              {isVideo && (
                <VideoCard pin={pin} />
              )}
              <span
                className={clsx(
                  'rounded-lg flex absolute top-0 left-0 bg-black bg-opacity-40 delay-75 duration-75 w-full h-full cursor-zoom group flex-col items-start z-20 justify-start px-4 py-1',
                  show ? `opacity-100` : `opacity-0`
                )}
              />
            </Link>
            {isBoard && currentProfileId === board?.user_id || isAllPins && isUserPin
              ? 
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
                      src={getProfilePicture(pin.profile, AVATAR)}
                      alt={pin.profile?.handle}
                      draggable={false}
                    />
                    <div className='flex items-center'>
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
        </motion.div>
      ) : (
        null
      )}
    </>
  )
}

export default PinCard