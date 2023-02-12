
import UserProfile from '@components/Common/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { Loader } from '@components/UI/Loader';
import { SCROLL_THRESHOLD } from '@utils/constants';
import formatHandle from '@utils/functions/formatHandle';
import type { FollowingRequest, Profile } from '@utils/lens';
import { useFollowingQuery } from '@utils/lens';
import type { FC } from 'react';
import { HiOutlineUsers } from 'react-icons/hi';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
    profile: Profile;
    onProfileSelected?: (profile: Profile) => void;
}

const Following: FC<Props> = ({ profile, onProfileSelected }) => {
    // Variables
    const request: FollowingRequest = { address: profile?.ownedBy, limit: 10 };

    const { data, loading, error, fetchMore } = useFollowingQuery({
        variables: { request },
        skip: !profile?.id
    });

    const followings = data?.following?.items;
    const pageInfo = data?.following?.pageInfo;
    const hasMore = pageInfo?.next && followings?.length !== pageInfo.totalCount;

    const loadMore = async () => {
        await fetchMore({
            variables: {
                request: { ...request, cursor: pageInfo?.next }
            }
        });
    };

    if (loading) {
        return <Loader />;
    }

    if (followings?.length === 0) {
        return (
            <EmptyState
                message={
                    <div>
                        <span className="mr-1 font-bold">@{formatHandle(profile?.handle)}</span>
                        <span>doesn’t follow anyone.</span>
                    </div>
                }
                icon={<HiOutlineUsers className="text-brand h-8 w-8" />}
                hideCard
            />
        );
    }

    return (
        <div className="max-h-[50vh] overflow-y-auto" id="scrollableFollowingDiv">
            <ErrorMessage className="m-5" title={`Failed to load following`} error={error} />
            <InfiniteScroll
                dataLength={followings?.length ?? 0}
                scrollThreshold={SCROLL_THRESHOLD}
                hasMore={hasMore}
                next={loadMore}
                loader={<InfiniteLoader />}
                scrollableTarget="scrollableFollowingDiv"
            >
                <div className="divide-y dark:divide-gray-700">
                    {followings?.map((following, index) => (
                        <div
                            className={`p-5 ${
                                onProfileSelected && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900'
                            }`}
                            key={following?.profile?.id}
                            onClick={
                                onProfileSelected && following.profile
                                ? () => {
                                    onProfileSelected(following.profile as Profile);
                                    }
                                : undefined
                            }
                        >
                            <UserProfile
                                profile={following?.profile as Profile}
                                linkToProfile={!onProfileSelected}
                                isFollowing={following?.profile?.isFollowedByMe}
                                showBio
                                showFollow
                                showUserPreview={false}
                            />
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Following;