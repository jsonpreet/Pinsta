import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import React from 'react'

type Props = {
  children: ReactNode
  variant?: 'warning' | 'danger' | 'success'
}

const Alert: FC<Props> = ({ children, variant = 'warning' }) => {
    return (
        <div
            className={clsx('border flex items-center rounded-full px-4 py-2 mb-3', {
                'border-yellow-500 border-opacity-50': variant === 'warning',
                'border-red-500 border-opacity-50': variant === 'danger',
                'border-green-500 border-opacity-50': variant === 'success'
            })}
        >
            {children}
        </div>
    )
}

export default Alert