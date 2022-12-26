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
import MetaTags from '@components/Common/MetaTags';
import clsx from 'clsx';
import { BsBell } from 'react-icons/bs';
import { useInView } from 'react-cool-inview';
import { Loader } from '@components/UI/Loader';

const Notifications: FC = () => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [feedType, setFeedType] = useState<'ALL' | 'MENTIONS' | 'COMMENTS'>('ALL');

    const getNotificationType = () => {
        switch (feedType) {
        case 'ALL':
            return;
        case 'MENTIONS':
            return [NotificationTypes.MentionPost, NotificationTypes.MentionComment];
        case 'COMMENTS':
            return [NotificationTypes.CommentedComment, NotificationTypes.CommentedPost];
        default:
            return;
        }
    };
    
    // Variables
    const request = {
        profileId: currentProfile?.id,
        customFilters: [CustomFiltersTypes.Gardeners],
        notificationTypes: getNotificationType(),
        limit: 20
    };

    const { data, loading, error, fetchMore } = useNotificationsQuery({
        variables: { request }
    });

    const notifications = data?.notifications?.items;
    const pageInfo = data?.notifications?.pageInfo;
    const hasMore = pageInfo?.next && notifications?.length !== pageInfo.totalCount;


    const { observe } = useInView({
        rootMargin: SCROLL_ROOT_MARGIN,
        onEnter: async () => {
            await fetchMore({
                variables: {
                    request: {
                        ...request,
                        cursor: pageInfo?.next
                    }
                }
            })
        }
    })

    if (error) {
        return <ErrorMessage className="m-3" title="Failed to load notifications" error={error} />;
    }

    return (
        <>
            <MetaTags title="Notifications" />
            <div className='flex flex-col max-w-5xl mx-auto'>
                <div className='my-6 flex justify-center'>
                    <div className="flex bg-white dark:bg-gray-900 bg-gradient-to-r from-[#df3f95] to-[#ec1e25] rounded-full py-2 px-2 items-center space-x-2">
                        <button
                            onClick={() => setFeedType('ALL')}
                            className={clsx(
                                'text-sm p-2 rounded-full', 
                                feedType === 'ALL' ? 'bg-white text-gray-800' : 'text-white'
                            )}
                        >
                            All Notifications
                        </button>
                        <button
                            onClick={() => setFeedType('MENTIONS')}
                            className={clsx(
                                'text-sm p-2 rounded-full', 
                                feedType === 'MENTIONS' ? 'bg-white text-gray-800' : 'text-white'
                            )}
                        >
                            Mentions
                        </button>
                        <button
                            onClick={() => setFeedType('COMMENTS')}
                            className={clsx(
                                'text-sm p-2 rounded-full', 
                                feedType === 'COMMENTS' ? 'bg-white text-gray-800' : 'text-white'
                            )}
                        >
                            Comments
                        </button>
                    </div>
                </div>
                <div className='flex flex-col relative w-full border bg-gray-50 border-gray-200 rounded-lg'>
                    <div className='flex flex-col divide-y divide-gray-200 py-3'>
                        {loading && (
                            <>
                                <NotificationShimmer />
                                <NotificationShimmer />
                                <NotificationShimmer />
                                <NotificationShimmer />
                            </>
                        )}
                        {error && <ErrorMessage title="Failed to load notifications" error={error} />}
                        {!loading && !error &&notifications?.map((notification, index) => (
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
                        ))}   
                        {!loading && !error && notifications?.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-10">
                                <BsBell className="text-4xl text-gray-400" />
                                <p className="text-gray-400 text-sm mt-2">No notifications yet</p>
                            </div>        
                        )}
                    </div>
                    
                    {pageInfo?.next && (
                        <span ref={observe} className="flex justify-center p-10">
                            <Loader />
                        </span>
                    )}
                </div>
            </div>
        </>
    )
}

export default Notifications