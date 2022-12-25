import { CollectModules, FollowModules, ReferenceModules } from '@utils/lens';
import type { FC } from 'react';
import { BiPlusCircle, BiShareAlt, BiStar } from 'react-icons/bi';
import { BsClock } from 'react-icons/bs';
import { HiOutlineCash, HiOutlineDocumentAdd } from 'react-icons/hi';
import { HiOutlineReceiptRefund } from 'react-icons/hi2';

interface Props {
  module: string;
  size: number;
}

const GetModuleIcon: FC<Props> = ({ module, size }) => {
    switch (module) {
        case CollectModules.FeeCollectModule:
        return <HiOutlineCash className={`h-${size}`} />;
        case CollectModules.LimitedFeeCollectModule:
        return (
            <div className="flex gap-1 items-center">
            <BiStar className={`h-${size}`} />
            <HiOutlineCash className={`h-${size}`} />
            </div>
        );
        case CollectModules.LimitedTimedFeeCollectModule:
        return (
            <div className="flex gap-1 items-center">
            <BiStar className={`h-${size}`} />
            <BsClock className={`h-${size}`} />
            <HiOutlineCash className={`h-${size}`} />
            </div>
        );
        case CollectModules.TimedFeeCollectModule:
        return (
            <div className="flex gap-1 items-center">
            <BsClock className={`h-${size}`} />
            <HiOutlineCash className={`h-${size}`} />
            </div>
        );
        case CollectModules.RevertCollectModule:
        return <HiOutlineReceiptRefund className={`h-${size}`} />;
        case CollectModules.FreeCollectModule:
        return <HiOutlineDocumentAdd className={`h-${size}`} />;
        case FollowModules.FeeFollowModule:
        return (
            <div className="flex gap-1 items-center">
            <HiOutlineCash className={`h-${size}`} />
            <BiPlusCircle className={`h-${size}`} />
            </div>
        );
        case ReferenceModules.FollowerOnlyReferenceModule:
        return (
            <div className="flex gap-1 items-center">
            <BiPlusCircle className={`h-${size}`} />
            <BiShareAlt className={`h-${size}`} />
            </div>
        );
        default:
        return <HiOutlineCash className={`h-${size}`} />;
    }
};

export default GetModuleIcon;