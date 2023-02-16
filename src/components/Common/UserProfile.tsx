/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import dayjs from 'dayjs';
// @ts-ignore
import dayjsTwitter from 'dayjs-twitter';
import type { Profile } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

import Follow from './Follow';
import InterweaveContent from './InterweaveContent';
import Slug from './Slug';
import SuperFollow from './SuperFollow';
import UserPreview from './UserPreview';
import getAttribute from '@utils/functions/getAttribute';
import formatHandle from '@utils/functions/formatHandle';
import getProfilePicture from '@utils/functions/getProfilePicture';
import IsVerified from '@components/UI/IsVerified';
import formatTime from '@utils/functions/formatTime';

dayjs.extend(dayjsTwitter);

interface Props {
    profile: Profile;
    followStatusLoading?: boolean;
    isFollowing?: boolean;
    isBig?: boolean;
    linkToProfile?: boolean;
    showBio?: boolean;
    showFollow?: boolean;
    showStatus?: boolean;
    showUserPreview?: boolean;
    timestamp?: Date;

    // For data analytics
    followPosition?: number;
    followSource?: string;
}

const UserProfile: FC<Props> = ({
  profile,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
  linkToProfile = true,
  showBio = false,
  showFollow = false,
  showStatus = false,
  showUserPreview = true,
  timestamp = '',
  followPosition,
  followSource
}) => {
    const [following, setFollowing] = useState(isFollowing);

    const statusEmoji = getAttribute(profile?.attributes, 'statusEmoji');
    const statusMessage = getAttribute(profile?.attributes, 'statusMessage');
    const hasStatus = statusEmoji && statusMessage;

    const UserAvatar = () => (
        <img
            src={getProfilePicture(profile)}
            loading="lazy"
            className={clsx(
                isBig ? 'h-14 w-14' : 'h-10 w-10',
                'rounded-full border bg-gray-200 dark:border-gray-700'
            )}
            height={isBig ? 56 : 40}
            width={isBig ? 56 : 40}
            alt={formatHandle(profile?.handle)}
        />
    );

    const UserName = () => (
        <>
            <div className="flex max-w-sm items-center truncate">
                <div className={clsx(isBig ? 'font-bold' : 'text-md')}>
                    {profile?.name ?? formatHandle(profile?.handle)}
                </div>
                <IsVerified id={profile?.id} />
                {showStatus && hasStatus ? (
                <div className="lt-text-gray-500 flex items-center">
                    <span className="mx-1.5">·</span>
                    <span className="flex max-w-[10rem] items-center space-x-1 text-xs">
                        <span>{statusEmoji}</span>
                        <span className="truncate">{statusMessage}</span>
                    </span>
                </div>
                ) : null}
            </div>
            <div>
                <Slug className="text-sm" slug={formatHandle(profile?.handle)} prefix="@" />
                {timestamp ? (
                    <span className="lt-text-gray-500">
                        <span className="mx-1.5">·</span>
                        <span className="text-xs" title={formatTime(timestamp as Date)}>
                            {/* @ts-ignore */}
                            {dayjs(new Date(timestamp)).twitter()}
                        </span>
                    </span>
                ) : null}
            </div>
        </>
    );

    const UserInfo: FC = () => {
        return (
            <UserPreview
                isBig={isBig}
                profile={profile}
                followStatusLoading={followStatusLoading}
                showUserPreview={showUserPreview}
            >
                <div className="flex items-center space-x-3">
                    <UserAvatar />
                    <div>
                        <UserName />
                        {showBio && profile?.bio && (
                            <div
                                // Replace with Tailwind
                                style={{ wordBreak: 'break-word' }}
                                className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify leading-6')}
                            >
                                <InterweaveContent content={profile?.bio}/>
                            </div>
                        )}
                    </div>
                </div>
            </UserPreview>
        );
    };

    return (
        <div className="flex items-center justify-between">
        {linkToProfile ? (
            <Link href={`/${formatHandle(profile?.handle)}`}>
                <UserInfo />
            </Link>
        ) : (
            <UserInfo />
        )}
        {showFollow &&
            (followStatusLoading ? (
            <div className="shimmer h-8 w-10 rounded-lg" />
            ) : following ? null : profile?.followModule?.__typename === 'FeeFollowModuleSettings' ? (
                <SuperFollow profile={profile} setFollowing={setFollowing} />
            ) : (
                <Follow
                    profile={profile}
                    setFollowing={setFollowing}
                />
            ))}
        </div>
    );
};

export default UserProfile;