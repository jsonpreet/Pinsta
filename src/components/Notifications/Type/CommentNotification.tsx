import InterweaveContent from '@components/Common/InterweaveContent';
import UserPreview from '@components/Common/UserPreview';
import formatTime from '@utils/functions/formatTime';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewCommentNotification } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';
import { HiOutlineChatAlt2 } from 'react-icons/hi';

dayjs.extend(relativeTime);

interface Props {
  notification: NewCommentNotification;
}

const CommentNotification: FC<Props> = ({ notification }) => {
    return (
        <div className="flex justify-between items-start">
        <div className="space-y-2 w-4/5">
            <div className="flex items-center space-x-3">
            <HiOutlineChatAlt2 className="h-6 w-6 text-blue-500" />
            <UserPreview profile={notification?.profile}>
                <NotificationProfileAvatar profile={notification?.profile} />
            </UserPreview>
            </div>
            <div className="ml-9">
            <NotificationProfileName profile={notification?.profile} />{' '}
            <span className="text-gray-600 dark:text-gray-400">commented on your </span>
            <Link href={`/posts/${notification?.comment?.commentOn?.id}`} className="font-bold">
                {notification?.comment?.commentOn?.__typename?.toLowerCase()}
            </Link>
            <span
                className="lt-text-gray-500 line-clamp-2 linkify mt-2"
            >
                <InterweaveContent content={notification?.comment?.metadata?.content}/>
            </span>
            </div>
        </div>
        <div className="text-gray-400 text-[12px]" title={formatTime(notification?.createdAt)}>
            {dayjs(new Date(notification?.createdAt)).fromNow()}
        </div>
        </div>
    );
};

export default CommentNotification;