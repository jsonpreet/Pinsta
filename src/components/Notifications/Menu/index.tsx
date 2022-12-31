import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { SCROLL_ROOT_MARGIN } from '@utils/constants';
import {
  NewCollectNotification,
  NewCommentNotification,
  NewFollowerNotification,
  NewMentionNotification,
  NewMirrorNotification,
  NewReactionNotification,
  useNotificationCountQuery
} from '@utils/lens';
import { CustomFiltersTypes, NotificationTypes, useNotificationsQuery } from '@utils/lens';
import { FC, useEffect, useState } from 'react';

import NotificationShimmer from '@components/Shimmers/NotificationShimmer';
import CollectNotification from './Type/CollectNotification';
import CommentNotification from './Type/CommentNotification';
import FollowerNotification from './Type/FollowerNotification';
import LikeNotification from './Type/LikeNotification';
import MentionNotification from './Type/MentionNotification';
import MirrorNotification from './Type/MirrorNotification';
import useAppStore from '@lib/store';
import usePersistStore from '@lib/store/persist';
import { BsBell } from 'react-icons/bs';
import DropMenu from '@components/UI/DropMenu';
import { Button } from '@components/UI/Button';
import { Loader } from '@components/UI/Loader';
import Link from 'next/link';

const Notifications: FC = () => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const notificationCount = usePersistStore((state) => state.notificationCount);
    const setNotificationCount = usePersistStore((state) => state.setNotificationCount);
    const [showBadge, setShowBadge] = useState(false);
    
    // Variables
    const request = {
        profileId: currentProfile?.id,
        customFilters: [CustomFiltersTypes.Gardeners],
        limit: 10
    };

    const { data, loading, error, fetchMore } = useNotificationsQuery({
        variables: { request }
    });

    const { data: totalNotifications } = useNotificationCountQuery({
        variables: { request: { profileId: currentProfile?.id, customFilters: [CustomFiltersTypes.Gardeners] } },
        skip: !currentProfile?.id,
        fetchPolicy: 'no-cache' // without no-cache the totalcount is NaN and returns the same.
    });

    useEffect(() => {
        if (currentProfile && totalNotifications) {
        const currentCount = totalNotifications?.notifications?.pageInfo?.totalCount || 0;
            setShowBadge(notificationCount !== currentCount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalNotifications]);

    const notifications = data?.notifications?.items;
    const pageInfo = data?.notifications?.pageInfo;
    const hasMore = pageInfo?.next && notifications?.length !== pageInfo.totalCount;

    if (loading) {
        return (
            <Loader size='sm' />
        );
    }

    if (error) {
        return <ErrorMessage className="m-3" title="Failed to load notifications" error={error} />;
    }

    return (
        <>
            <DropMenu
                trigger={
                    <Button
                        variant='secondary'
                        className='!px-2'
                        onClick={() => {
                            setNotificationCount(data?.notifications?.pageInfo?.totalCount || 0);
                            setShowBadge(false);
                        }}
                    >
                        <span className='flex space-x-1 relative'>
                            <span>
                                <BsBell size={24} />
                            </span>
                            {showBadge && <span className="w-2 h-2 absolute top-0 -right-2 bg-red-500 rounded-full" />}
                        </span>
                    </Button>
                }
            >
                <div className="mt-1.5 w-96 divide-y focus-visible:outline-none focus:outline-none focus:ring-0 dropdown-shadow divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-700 dark:bg-gray-800 bg-white">
                    <div className="flex flex-col">
                        <div className="p-3 flex justify-between">
                            <div className='flex space-x-2'>
                                <span className='font-semibold'>Notifications</span>
                            </div>
                            <div>
                                <Link
                                    href='/notifications'
                                    className='text-red-500 dark:text-red-200 font-semibold'
                                >
                                    View All
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-600/50'>
                        {error ?
                            <ErrorMessage className="m-3" title="Failed to load notifications" error={error} />
                            :
                            notifications?.length === 0 ? (
                                <div>
                                    No Notifications
                                </div>
                            ) : (
                                notifications?.slice(0, 10).map((notification, index) => (
                                    <div key={`${notification?.notificationId}_${index}`} className='p-3'>
                                        {notification.__typename === 'NewFollowerNotification' && (
                                            <FollowerNotification notification={notification as NewFollowerNotification} />
                                        )}
                                        {notification.__typename === 'NewMentionNotification' && (
                                            <MentionNotification notification={notification as NewMentionNotification} />
                                        )}
                                        {notification.__typename === 'NewReactionNotification' && (
                                            <LikeNotification notification={notification as NewReactionNotification} />
                                        )}
                                        {notification.__typename === 'NewCommentNotification' && (
                                            <CommentNotification notification={notification as NewCommentNotification} />
                                        )}
                                        {notification.__typename === 'NewMirrorNotification' && (
                                            <MirrorNotification notification={notification as NewMirrorNotification} />
                                        )}
                                        {notification.__typename === 'NewCollectNotification' && (
                                            <CollectNotification notification={notification as NewCollectNotification} />
                                        )}
                                    </div>
                                ))
                            )}   
                    </div>
                </div>
            </DropMenu>
        </>
    )
}

export default Notifications