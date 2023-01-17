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
        return <HiOutlineCash size={size} />;
        case CollectModules.LimitedFeeCollectModule:
        return (
            <div className="flex gap-1 items-center">
            <BiStar size={size} />
            <HiOutlineCash size={size} />
            </div>
        );
        case CollectModules.LimitedTimedFeeCollectModule:
        return (
            <div className="flex gap-1 items-center">
            <BiStar size={size} />
            <BsClock size={size} />
            <HiOutlineCash size={size} />
            </div>
        );
        case CollectModules.TimedFeeCollectModule:
        return (
            <div className="flex gap-1 items-center">
            <BsClock size={size} />
            <HiOutlineCash size={size} />
            </div>
        );
        case CollectModules.RevertCollectModule:
        return <HiOutlineReceiptRefund size={size} />;
        case CollectModules.FreeCollectModule:
        return <HiOutlineDocumentAdd size={size} />;
        case FollowModules.FeeFollowModule:
        return (
            <div className="flex gap-1 items-center">
            <HiOutlineCash size={size} />
            <BiPlusCircle size={size} />
            </div>
        );
        case ReferenceModules.FollowerOnlyReferenceModule:
        return (
            <div className="flex gap-1 items-center">
            <BiPlusCircle size={size} />
            <BiShareAlt size={size} />
            </div>
        );
        default:
        return <HiOutlineCash size={size} />;
    }
};

export default GetModuleIcon;