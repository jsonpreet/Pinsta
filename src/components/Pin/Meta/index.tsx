import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC } from "react";
import { HiOutlineChatAlt2, HiOutlineHeart, HiRefresh } from "react-icons/hi"
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiShoppingBag, FiClock } from "react-icons/fi";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { useAppStore } from '@lib/store';
import Collect from "./Collect";
import Mirror from "./Mirror";
import Like from "./Like";

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication
}

const Meta: FC<Props> = ({ pin }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const canMirror = currentProfile ? pin?.canMirror?.result : true;
    const collectModuleType = pin?.collectModule.__typename
    return (
        <div className='flex flex-row justify-between w-full items-center mt-4'>
            <div className="flex flex-row flex-auto text-gray-700 justify-between">
                <Like pin={pin}/>
                {canMirror ?
                    <Mirror pin={pin}/>
                    : null
                }
                <div className="flex flex-row justify-center items-center">
                    <HiOutlineChatAlt2 size={18} />
                    <span className="ml-1">{pin.stats.totalAmountOfComments}</span>
                </div>
                {collectModuleType !== 'RevertCollectModuleSettings' ?
                    <Collect pin={pin} />
                    : null
                }
                <div className="flex text-gray-700 items-center" title={pin.createdAt}>
                    <FiClock size={18} />
                    <span className="ml-1 text-sm">{dayjs(new Date(pin.createdAt))?.fromNow()}</span>
                </div>
            </div>
        </div>

    )
}

export default Meta