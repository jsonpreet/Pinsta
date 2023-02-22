/* eslint-disable @next/next/no-img-element */
import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/UI/IsVerified'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PublicationMainFocus } from '@utils/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { PinstaPublication } from '@utils/custom-types'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import Meta from '../Meta'
import formatHandle from '@utils/functions/formatHandle'

dayjs.extend(relativeTime)

interface Props {
  comment: PinstaPublication
}

const Comment: FC<Props> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (comment?.metadata?.content.trim().length > 200) {
      setClamped(true)
      setShowMore(true)
    }
  }, [comment?.metadata?.content])

  const getIsVideoComment = () => {
    return comment.metadata.mainContentFocus === PublicationMainFocus.Video
  }

  return (
    <>
      <div className="flex items-start justify-start">
        <Link
          href={`/${formatHandle(comment?.profile?.handle)}`}
          className="flex-none mr-3 mt-0.5"
        >
          <img
            src={getProfilePicture(comment?.profile, 'avatar')}
            className="rounded-full w-7 h-7"
            draggable={false}
            alt={`${formatHandle(comment?.profile?.handle)}'s profile picture`}
          />
        </Link>
        <div className="flex flex-col items-start mr-2">
          <span className="flex items-center mb-1 space-x-1">
            <Link
              href={`/${formatHandle(comment?.profile?.handle)}`}
              className="flex items-center hover:text-red-500 text-sm font-medium"
            >
              <span>{comment?.profile?.name ?? formatHandle(comment?.profile?.handle)}</span>
              <IsVerified id={comment?.profile.id} size='xs' />
            </Link>
            <span className='middot'></span>
            <span className="inline-flex items-center space-x-1 text-[10px]">
              {dayjs(new Date(comment?.createdAt)).fromNow()}
            </span>
          </span>
          <div className='text-sm'>
            {comment?.hidden ? (
              <span className="text-xs italic">
                Comment deleted by user!
              </span>
            ) : getIsVideoComment() ? (
              <Comment comment={comment} />
            ) : (
              <InterweaveContent content={comment?.metadata?.content} />
            )}
          </div>
          {showMore && (
            <div className="inline-flex mt-3">
              <button
                type="button"
                onClick={() => setClamped(!clamped)}
                className="flex items-center mt-2 text-xs outline-none"
              >
                {clamped ? (
                  <>
                    Show more <BiChevronDown className="h-3 ml-1 w-3" />
                  </>
                ) : (
                  <>
                    Show less <BiChevronUp className="h-3 w-3 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
          {!comment.hidden && (
            <div className="w-full">
              <Meta isComment={true} pin={comment}/>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Comment