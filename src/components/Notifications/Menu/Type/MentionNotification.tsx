import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewMentionNotification } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';
import { HiOutlineAtSymbol } from 'react-icons/hi';

dayjs.extend(relativeTime);

interface Props {
    notification: NewMentionNotification;
}

const MentionNotification: FC<Props> = ({ notification }) => {
    const profile = notification?.mentionPublication?.profile;

    return (
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
                <div className='flex items-center space-x-1'>
                    <HiOutlineAtSymbol className="h-6 w-6 text-orange-500/70" />
                    <NotificationProfileAvatar profile={profile} />
                    <NotificationProfileName profile={profile} />
                <div>
                    <span className="text-gray-600 dark:text-gray-400">mentioned you in a </span>
                    <Link href={`/pin/${notification?.mentionPublication?.id}`} className="brandGradientText">
                        {notification?.mentionPublication.__typename?.toLowerCase()}
                    </Link>
                </div>
                </div>
            </div>
            {/* <div className="text-gray-400 text-[12px]" title={formatTime(notification?.createdAt)}>
                {dayjs(new Date(notification?.createdAt)).fromNow()}
            </div> */}
        </div>
    );
};

export default MentionNotification;