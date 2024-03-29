import type { ElectedMirror, Publication } from '@utils/lens';
import type { FC } from 'react';
import { BsHeart } from 'react-icons/bs';
import Slug from './Slug';
import formatHandle from '@utils/functions/formatHandle';

interface Props {
  mirror: Publication;
  referralFee?: number;
  electedMirror?: ElectedMirror;
}

const ReferralAlert: FC<Props> = ({ mirror, electedMirror, referralFee = 0 }) => {
    if ((mirror.__typename !== 'Mirror' && !electedMirror) || referralFee === 0) {
        return null;
    }
    const publication = electedMirror ?? mirror;

    return (
        <div className="flex items-center pt-1 space-x-1.5 text-sm lt-text-gray-500">
            <BsHeart className="w-4 h-4 text-pink-500" />
            <Slug slug={formatHandle(publication?.profile?.handle)} prefix="@" />
            <span>
                {' '}
                will get <b>{referralFee}%</b> referral fee
            </span>
        </div>
    );
};

export default ReferralAlert;