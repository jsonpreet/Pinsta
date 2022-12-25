import { FC, ReactElement, useState } from 'react';
import { Profile } from '@utils/lens/generated';
import useAppStore from '@lib/store';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import formatHandle from '@utils/functions/formatHandle';
import formatAddress from '@utils/functions/formatAddress';
import Slug from '@components/Common/Slug';
import Link from 'next/link';
import { Button } from '@components/UI/Button';
import Follow from '@components/Common/Follow';
import SuperFollow from '@components/Common/SuperFollow';
import Unfollow from '@components/Common/Unfollow';
import InterweaveContent from '@components/Common/InterweaveContent';
import IsVerified from '@components/Common/IsVerified';
import getProfilePicture from '@utils/functions/getProfilePicture';

interface Props {
  profile: Profile;
}

const Details: FC<Props> = ({ profile }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [following, setFollowing] = useState(profile?.isFollowedByMe);
    const [showMutualFollowersModal, setShowMutualFollowersModal] = useState(false);
    const { resolvedTheme } = useTheme();
    const router = useRouter();

    const MetaDetails = ({ children, icon }: { children: ReactElement; icon: ReactElement }) => (
        <div className="flex gap-2 items-center">
            {icon}
            <div className="truncate text-md">{children}</div>
        </div>
    );

    const followType = profile?.followModule?.__typename;
    return (
        <>
            <div className="px-5 mb-4 space-y-5 sm:px-0">
                <div className="relative -mt-10 w-32 h-32 sm:-mt-24 sm:w-44 sm:h-44">
                    <img
                        src={getProfilePicture(profile)}
                        className="w-32 h-32 dark:bg-gray-700 bg-gray-100/60 ring-2 ring-gray-100/70 p-3 rounded-full sm:w-44 sm:h-44"
                        height={128}
                        width={128}
                        alt={formatHandle(profile?.handle)}
                    />
                </div>
                <div className="space-y-1">
                    <div className="flex gap-1.5 items-center text-2xl font-bold">
                        <div className="truncate">{profile?.name ?? formatHandle(profile?.handle)}</div>
                        <IsVerified id={profile?.id} />
                    </div>
                    <div className="flex items-center space-x-3">
                        {profile?.name ? (
                            <Slug className="text-sm sm:text-base" slug={formatHandle(profile?.handle)} prefix="@" />
                        ) : (
                            <Slug className="text-sm sm:text-base" slug={formatAddress(profile?.ownedBy)} />
                        )}
                        {currentProfile && currentProfile?.id !== profile?.id && profile?.isFollowing && (
                            <div className="py-0.5 px-2 text-xs bg-gray-200 rounded-full dark:bg-gray-700">Follows you</div>
                        )}
                    </div>
                </div>
                {profile?.bio && (
                    <div className="mr-0 sm:mr-10 leading-md linkify text-md break-words">
                        <InterweaveContent content={profile?.bio}/>
                    </div>
                )}
                <div className="space-y-5">
                    {/* <Followerings profile={profile} /> */}
                    <div>
                    { followType !== 'RevertFollowModuleSettings' ? (
                        following ? (
                        <div className="flex space-x-2">
                            <Unfollow profile={profile} setFollowing={setFollowing} showText />
                            {followType === 'FeeFollowModuleSettings' && (
                                <SuperFollow profile={profile} setFollowing={setFollowing} again />
                            )}
                        </div>
                        ) : followType === 'FeeFollowModuleSettings' ? (
                        <div className="flex space-x-2">
                            <SuperFollow profile={profile} setFollowing={setFollowing} showText />
                        </div>
                        ) : (
                        <div className="flex space-x-2">
                            <Follow profile={profile} setFollowing={setFollowing} showText />
                        </div>
                        )
                    ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Details;