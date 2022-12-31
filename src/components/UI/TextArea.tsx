import type { ComponentProps } from 'react';
import { forwardRef, useId } from 'react';

import { FieldError } from './Form';

interface Props extends ComponentProps<'textarea'> {
    label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea({ label, ...props }, ref) {
    const id = useId();

    return (
        <label htmlFor={id}>
            {label && 
                <div className="flex items-center mb-1 space-x-1.5">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{label}</div>
                </div>
            }
        <textarea
            id={id}
            className="py-2 px-4 w-full bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-900 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 ring-0 focus:ring-0 focus-within:ring-0 focus-visible:ring-0 outline-none"
            ref={ref}
            {...props}
        />
            {props.name && <FieldError name={props.name} />}
        </label>
    );
});