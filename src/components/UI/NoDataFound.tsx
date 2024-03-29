/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import React from 'react'
import { APP } from '@utils/constants'

export const NoDataFound = ({
  text = 'No data found',
  withImage = false,
  isCenter = false
}) => {
    return (
        <div
        className={clsx('flex flex-col p-1 space-y-1', {
            'items-center': isCenter
        })}
        >
            {withImage && (
                <img
                    src={`${APP.URL}/logo.png`}
                    className="w-10 my-4 md:w-20"
                    alt="no results"
                    draggable={false}
                />
            )}
            <div
                className={clsx('text-sm mb-2 font-medium', {
                'text-center': isCenter
                })}
            >
                {text}
            </div>
        </div>
    )
}