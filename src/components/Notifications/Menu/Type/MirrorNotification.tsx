import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewMirrorNotification } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile';
import { RiArrowLeftRightFill } from 'react-icons/ri';

dayjs.extend(relativeTime);

interface Props {
  notification: NewMirrorNotification;
}

const MirrorNotification: FC<Props> = ({ notification }) => {
    return (
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
                <div className='flex items-center space-x-1'>
                    {/* <RiArrowLeftRightFill className="h-6 w-6 text-brand-500" /> */}
                    <NotificationProfileAvatar profile={notification?.profile} />
                    <NotificationProfileName profile={notification?.profile} />
                    <div>
                        <span className="pl-0.5 text-gray-600 dark:text-gray-400">mirrored your </span>
                        {notification?.publication?.__typename?.toLowerCase() !== 'comment' ? (
                            <>
                                <Link href={`/pin/${notification?.publication?.id}`} className="brandGradientText">
                                    {notification?.publication?.__typename?.toLowerCase()}
                                </Link>
                            </>
                        ) : (
                                <>
                                    {notification?.publication?.__typename?.toLowerCase()}   
                                </>
                        )}
                    </div>
                </div>
            </div>
            {/* <div className="text-gray-400 text-[12px]" title={formatTime(notification?.createdAt)}>
                {dayjs(new Date(notification?.createdAt)).fromNow()}
            </div> */}
        </div>
    );
};

export default MirrorNotification;