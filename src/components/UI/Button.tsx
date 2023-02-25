import clsx from 'clsx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Loader } from './Loader'

export type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'material' | 'dark' | 'success' | 'light' | 'outline' | 'warning'

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
                'relative inline-block duration-75 delay-75 disabled:opacity-50 rounded-full group',
                {
                    'px-4 py-1.5 text-xs': size === 'sm',
                    'px-3 md:px-5 py-1.5': size === 'md',
                    'px-6 py-3 text-base': size === 'lg',
                    'px-8 py-4 text-lg': size === 'xl',
                    'primary-button ': variant === 'primary',
                    'bg-transparent': variant === 'secondary',
                    'bg-gray-100 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-white': variant === 'light',
                    'bg-gray-800 dark:bg-gray-700 dark:hover:bg-red-500 hover:bg-red-600': variant === 'dark',
                    'bg-red-600 hover:bg-gray-900': variant === 'danger',
                    'bg-transparent hover:border-gray-600 border border-gray-300': variant === 'outline',
                    'bg-yellow-500 hover:bg-yellow-600': variant === 'warning',
                },
                className
            )}
            disabled={loading}
            {...rest}
        >
            <span
                className={clsx('relative flex duration-75 delay-75 items-center justify-center space-x-2', {
                    'text-white': variant !== 'secondary' && variant !== 'material' && variant !== 'light' && variant !== 'outline' && variant !== 'warning',
                    'group-hover:text-white dark:group-hover:text-gray-800': variant === 'light',
                })}
            >
                {icon}
                {loading && <Loader size="sm" />}
                <span
                className={clsx('whitespace-nowrap md:text-md text-sm', {
                    'font-regular': variant !== 'secondary'
                })}
                >
                    {children}
                </span>
            </span>
        </button>
    )
})