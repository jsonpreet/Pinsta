import { FC, useState } from 'react';
import { Profile } from '@utils/lens/generated';
import useAppStore from '@lib/store';
import formatHandle from '@utils/functions/formatHandle';
import formatAddress from '@utils/functions/formatAddress';
import Slug from '@components/Common/Slug';
import Link from 'next/link';
import { Button } from '@components/UI/Button';
import Follow from '@components/Common/Follow';
import SuperFollow from '@components/Common/SuperFollow';
import Unfollow from '@components/Common/Unfollow';
import InterweaveContent from '@components/Common/InterweaveContent';
import IsVerified from '@components/UI/IsVerified';
import getProfilePicture from '@utils/functions/getProfilePicture';
import Followerings from './Followerings';

interface Props {
  profile: Profile;
}

const Details: FC<Props> = ({ profile }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [following, setFollowing] = useState(profile?.isFollowedByMe);
    const [showMutualFollowersModal, setShowMutualFollowersModal] = useState(false);
    const followType = profile?.followModule?.__typename;
    
    return (
        <>
            <div className="mb-10 flex-1 space-y-3 flex flex-col w-full items-center justify-center">
                <div className="relative -mt-10 w-32 h-32 sm:-mt-24 sm:w-44 sm:h-44">
                    <img
                        src={getProfilePicture(profile, 'avatar_lg')}
                        className="w-32 h-32 dark:bg-gray-700/40 dark:ring-gray-700/60 bg-gray-100/70 ring-2 ring-white/70 bg-clip-padding backdrop-blur-xl backdrop-filter p-3 rounded-full sm:w-44 sm:h-44"
                        height={128}
                        width={128}
                        alt={formatHandle(profile?.handle)}
                    />
                </div>
                <div className="space-y-1 flex flex-col items-center justify-center">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold capitalize">{profile?.name ?? formatHandle(profile?.handle)}</span>
                        <IsVerified id={profile?.id} size='lg' />
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        {profile?.name ? (
                            <Slug className="text-sm sm:text-base" slug={formatHandle(profile?.handle)} prefix="@" />
                        ) : (
                            <Slug className="text-sm sm:text-base" slug={formatAddress(profile?.ownedBy)} />
                        )}
                    
                        {currentProfile && currentProfile?.id !== profile?.id && profile?.isFollowing && (
                            <div className="px-3 py-1 text-sm bg-gray-100 rounded-full dark:bg-gray-700">Follows you</div>
                        )}
                    </div>
                </div>
                {profile?.bio && (
                    <div className="linkify max-w-2xl mx-auto text-center text-md break-words">
                        <InterweaveContent content={profile?.bio}/>
                    </div>
                )}
                {<Followerings profile={profile} />}
                <div className="pt-2 flex items-center justify-center">
                    { currentProfile && currentProfile?.id !== profile?.id && followType !== 'RevertFollowModuleSettings' ? (
                        following ? (
                            <div className="flex justify-center space-x-2">
                                <Unfollow profile={profile} setFollowing={setFollowing} showText />
                                {followType === 'FeeFollowModuleSettings' && (
                                    <SuperFollow profile={profile} setFollowing={setFollowing} again />
                                )}
                            </div>
                        ) : followType === 'FeeFollowModuleSettings' ? (
                            <div className="flex justify-center space-x-2">
                                <SuperFollow profile={profile} setFollowing={setFollowing} showText />
                            </div>
                        ) : (
                            <div className="flex justify-center space-x-2">
                                <Follow type='primary' profile={profile} setFollowing={setFollowing} showText />
                            </div>
                        )
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default Details;