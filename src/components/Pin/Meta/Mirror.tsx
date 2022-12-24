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

const Mirror: FC<Props> = ({ pin }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    return (
        <>            
            <div className="flex flex-row justify-center items-center">
                <RiArrowLeftRightFill size={18} />
                <span className="ml-1">{pin.stats.totalAmountOfMirrors}</span>
            </div>                  
        </>

    )
}

export default Mirror