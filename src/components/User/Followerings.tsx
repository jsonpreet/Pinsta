import { formatNumber } from '@utils/functions/formatNumber';
import type { Profile } from '@utils/lens';
import type { FC } from 'react';

interface Props {
    profile: Profile;
}

const Followerings: FC<Props> = ({ profile }) => {
    return (
        <div className="flex gap-8 mt-2">
            <div className='flex space-x-1 items-center'>
                <div className="text-xl leading-3">{formatNumber(profile?.stats?.totalFollowing)}</div>
                <div className="text-sm text-gray-500">Following</div>
            </div>
            <div className='flex space-x-1 items-center'>
                <div className="text-xl leading-3">{formatNumber(profile?.stats?.totalFollowers)}</div>
                <div className="text-sm text-gray-500">Followers</div>
            </div>
        </div>
    );
};

export default Followerings;