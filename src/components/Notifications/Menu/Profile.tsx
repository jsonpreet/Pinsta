import formatHandle from '@utils/functions/formatHandle';
import IsVerified from '@components/UI/IsVerified';
import getProfilePicture from '@utils/functions/getProfilePicture';
import type { Profile } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<Props> = ({ profile }) => {
  return (
    <Link href={`/${formatHandle(profile?.handle)}`}>
      <img
        src={getProfilePicture(profile)}
        className="w-8 h-8 bg-gray-200 rounded-full border dark:border-gray-700"
        height={32}
        width={32}
        alt={formatHandle(profile?.handle)}
      />
    </Link>
  );
};

export const NotificationProfileName: FC<Props> = ({ profile }) => {
  return (
    <Link
      href={`/${formatHandle(profile?.handle)}`}
      className="inline-flex items-center space-x-1 truncate text-sm font-semibold"
    >
      <div>{profile?.name ?? formatHandle(profile?.handle)}</div>
      <IsVerified id={profile?.id} size='xs'/>
    </Link>
  );
};