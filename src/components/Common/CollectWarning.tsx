import { Card } from '@components/UI/Card';
import clsx from 'clsx';
import type { FC } from 'react';
import { BsStar } from 'react-icons/bs';
import { HiOutlineUsers } from 'react-icons/hi';
import Slug from './Slug';

interface Props {
  handle: string;
  isSuperFollow?: boolean | null;
}

const CollectWarning: FC<Props> = ({ handle, isSuperFollow = false }) => {
    return (
        <Card
        className={clsx(
            { '!bg-pink-100 border-pink-300': isSuperFollow },
            'flex items-center space-x-1.5 text-sm font-bold text-gray-500 p-5'
        )}
        >
            {isSuperFollow ? (
                <>
                    <BsStar className="w-4 h-4 text-pink-500" />
                    <span>Only </span>
                    <Slug slug={`${handle}'s`} prefix="@" />
                    <span className="text-pink-500"> super followers</span>
                    <span> can collect</span>
                </>
            ) : (
                <>
                    <HiOutlineUsers className="w-4 h-4 text-brand" />
                    <span>Only </span>
                    <Slug slug={`${handle}'s`} prefix="@" />
                    <span> followers can collect</span>
                </>
            )}
        </Card>
    );
};

export default CollectWarning;