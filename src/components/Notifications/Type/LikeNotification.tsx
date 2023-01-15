import InterweaveContent from '@components/Common/InterweaveContent';
import UserPreview from '@components/Common/UserPreview';
import formatTime from '@utils/functions/formatTime';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewReactionNotification } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';
import { HiHeart } from 'react-icons/hi';

dayjs.extend(relativeTime);

interface Props {
    notification: NewReactionNotification;
}

const LikeNotification: FC<Props> = ({ notification }) => {
    return (
        <div className="flex justify-between items-start">
            <div className="space-y-2 w-4/5">
                <div className="flex items-center space-x-3">
                    <HiHeart className="h-6 w-6 text-red-500" />
                    <UserPreview profile={notification?.profile}>
                        <NotificationProfileAvatar profile={notification?.profile} />
                    </UserPreview>
                </div>
                <div className="ml-9">
                    <NotificationProfileName profile={notification?.profile} />{' '}
                    <span className="pl-0.5 text-gray-600 dark:text-gray-400">liked your </span>
                    {notification?.publication?.__typename?.toLowerCase() !== 'comment' ? (
                        <>
                            <Link href={`/pin/${notification?.publication?.id}`} className="brandGradientText">
                                {notification?.publication?.__typename?.toLowerCase()}
                            </Link>
                            <Link
                                href={`/pin/${notification?.publication?.id}`}
                                className="lt-text-gray-500 line-clamp-2 linkify mt-2"
                            >
                                <InterweaveContent content={notification?.publication?.metadata?.content}/>
                            </Link>
                        </>
                    ) : (
                            <>
                                {notification?.publication?.__typename?.toLowerCase()}
                                <span className="lt-text-gray-500 line-clamp-2 linkify mt-2">
                                    <InterweaveContent content={notification?.publication?.metadata?.content} />
                                </span>    
                            </>
                    )}
                </div>
            </div>
            <div className="text-gray-400 text-[12px]" title={formatTime(notification?.createdAt)}>
                {dayjs(new Date(notification?.createdAt)).fromNow()}
            </div>
        </div>
    );
};

export default LikeNotification;