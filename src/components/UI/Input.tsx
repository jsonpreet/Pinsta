import clsx from 'clsx';
import dynamic from 'next/dynamic';
import type { ComponentProps, ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import { FieldError } from './Form';

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string;
  prefix?: string | ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  helper?: ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, prefix, type = 'text', iconLeft, iconRight, error, className = '', helper, ...props },
  ref
) {
    const id = useId();

    const iconStyles = [
        'text-zinc-500 [&>*]:peer-focus:text-brand-500 [&>*]:h-5',
        { '!text-red-500 [&>*]:peer-focus:!text-red-500': error }
    ];

    return (
        <label className="w-full" htmlFor={id}>
        {label && (
            <div className="flex items-center mb-1 space-x-1.5">
                <div className="font-medium text-gray-800 dark:text-gray-200">{label}</div>
            </div>
        )}
        <div className="flex">
            {prefix && (
                <span className="inline-flex items-center px-3 lt-text-gray-500 bg-gray-100 rounded-l-xl border border-r-0 border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                    {prefix}
                </span>
            )}
            <div
                className={clsx(
                    { '!border-red-500': error },
                    { 'focus-within:ring-1': !error },
                    { 'rounded-r-lg': prefix },
                    { 'rounded-lg': !prefix },
                    {
                    'opacity-60 bg-gray-500 bg-opacity-20': props.disabled
                    },
                    'flex items-center border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 w-full  ring-0 focus-within:ring-0 focus-visible:ring-0'
                )}
            >
                <input
                    id={id}
                    className={clsx(
                        { 'placeholder-red-500': error },
                        { 'rounded-r-lg': prefix },
                        { 'rounded-lg': !prefix },
                        'peer border-none focus:ring-0 outline-none px-4 ring-0 focus-within:ring-0 focus-visible:ring-0 py-2 bg-transparent w-full',
                        className
                    )}
                    type={type}
                    ref={ref}
                    {...props}
                />
                <span tabIndex={-1} className={clsx({ 'order-first pl-3': iconLeft }, iconStyles)}>
                    {iconLeft}
                </span>
                <span tabIndex={-1} className={clsx({ 'order-last pr-3': iconRight }, iconStyles)}>
                    {iconRight}
                </span>
            </div>
        </div>
            {props.name && <FieldError name={props.name} />}
        </label>
    );
});