import { NotificationProfileAvatar, NotificationProfileName } from '@components/Notifications/Profile';
import {
  NotificationWalletProfileAvatar,
  NotificationWalletProfileName
} from '@components/Notifications/WalletProfile';
import UserPreview from '@components/Common/UserPreview';
import formatTime from '@utils/functions/formatTime';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewCollectNotification } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';
import CollectedAmount from './Amount';
import CollectedContent from './Content';
import { FiShoppingBag } from 'react-icons/fi';

dayjs.extend(relativeTime);

interface Props {
    notification: NewCollectNotification;
}

const CollectNotification: FC<Props> = ({ notification }) => {
    return (
        <div className="flex justify-between items-start">
            <div className="space-y-2 w-4/5">
                <div className="flex items-center space-x-3">
                    <FiShoppingBag className="h-6 w-6 text-pink-500" />
                    {notification?.wallet?.defaultProfile ? (
                        <UserPreview isBig={false} profile={notification?.wallet?.defaultProfile}>
                        <NotificationProfileAvatar profile={notification?.wallet?.defaultProfile} />
                        </UserPreview>
                    ) : (
                        <NotificationWalletProfileAvatar wallet={notification?.wallet} />
                    )}
                </div>
                <div className="ml-9">
                    {notification?.wallet?.defaultProfile ? (
                        <NotificationProfileName profile={notification?.wallet?.defaultProfile} />
                    ) : (
                        <NotificationWalletProfileName wallet={notification?.wallet} />
                    )}{' '}
                    <span className="text-gray-600 dark:text-gray-400">collected your </span>
                    {notification?.collectedPublication?.__typename?.toLowerCase() !== 'comment' ? (
                        <>
                            <Link href={`/pin/${notification?.collectedPublication?.id}`} className="brandGradientText">
                                {notification?.collectedPublication?.__typename?.toLowerCase()}
                            </Link>
                        </>
                    ) : (
                            <>
                                {notification?.collectedPublication?.__typename?.toLowerCase()}
                            </>
                    )}
                    <CollectedContent notification={notification} />
                    <CollectedAmount notification={notification} />
                </div>
            </div>
            <div className="text-gray-400 text-[12px]" title={formatTime(notification?.createdAt)}>
                {dayjs(new Date(notification?.createdAt)).fromNow()}
            </div>
        </div>
    );
};

export default CollectNotification;