import clsx from 'clsx';
import type { FC } from 'react';

interface Props {
    slug: string;
    prefix?: string;
    className?: string;
    isMention?: boolean;
}

const Slug: FC<Props> = ({ slug, prefix, isMention = false, className = '' }) => {
    return (
        <span
            className={className}
        >
            {prefix}
            {slug}
        </span>
    );
};

export default Slug;