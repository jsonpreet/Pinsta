import clsx from 'clsx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Loader } from './Loader'

export type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'material' | 'dark' | 'success'

interface Props
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: ButtonVariants
    loading?: boolean
    children?: ReactNode
    icon?: ReactNode
    className?: string
    outline?: boolean
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = '',
    size = 'md',
    variant = 'primary',
    loading,
    children,
    outline = 'false',
    icon,
    ...rest
  },
  ref
) {
    return (
        <button
            ref={ref}
            className={clsx(
                'relative inline-block  duration-75 delay-75 disabled:opacity-50 rounded-lg md:rounded-xl group',
                {
                'px-4 py-1.5 text-xs': size === 'sm',
                'px-5 py-1.5': size === 'md',
                'px-6 py-3 text-base': size === 'lg',
                'px-8 py-4 text-lg': size === 'xl',
                'md:rounded-full': size === 'sm',
                'primary-button md:rounded-full': variant === 'primary',
                'bg-transparent md:rounded-full': variant === 'secondary',
                'bg-gray-800 hover:bg-gray-900': variant === 'dark',
                'bg-red-500 border border-red-500 md:rounded-full': variant === 'danger',
                },
                className
            )}
            disabled={loading}
            {...rest}
        >
            <span
                className={clsx('relative flex items-center justify-center space-x-2', {
                    'text-white': variant !== 'secondary' && variant !== 'material'
                })}
            >
                {icon}
                {loading && <Loader size="sm" />}
                <span
                className={clsx('whitespace-nowrap', {
                    'font-regular': variant !== 'secondary'
                })}
                >
                    {children}
                </span>
            </span>
        </button>
    )
})