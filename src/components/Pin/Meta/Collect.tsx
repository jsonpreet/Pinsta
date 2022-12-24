import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC } from "react";
import { HiOutlineChatAlt2, HiOutlineHeart, HiRefresh } from "react-icons/hi"
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiShoppingBag, FiClock } from "react-icons/fi";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { useAppStore } from '@lib/store';

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication
}

const Collect: FC<Props> = ({ pin }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const collectModuleType = pin?.collectModule.__typename
    return (
        <>
            <div className="flex flex-row justify-center items-center">
                <FiShoppingBag size={17} />
                <span className="ml-1">{pin.stats.totalAmountOfCollects}</span>
            </div>                    
        </>
    )
}

export default Collect