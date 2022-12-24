import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC } from "react";
import { HiOutlineChatAlt2, HiOutlineHeart, HiRefresh } from "react-icons/hi"
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiShoppingBag, FiClock } from "react-icons/fi";
import { RiArrowLeftRightFill } from "react-icons/ri";

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication
}

const MetaCard: FC<Props> = ({ pin }) => {
    return (
        <div className='flex flex-row justify-between w-full items-center mt-4'>
            <div className="flex flex-row flex-auto text-gray-700 justify-between">
                <div className="flex flex-row justify-center items-center">
                    <HiOutlineHeart size={19} />
                    <span className="ml-1">{pin.stats.totalUpvotes}</span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <RiArrowLeftRightFill size={18} />
                    <span className="ml-1">{pin.stats.totalAmountOfMirrors}</span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <HiOutlineChatAlt2 size={18} />
                    <span className="ml-1">{pin.stats.totalAmountOfComments}</span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <FiShoppingBag size={17} />
                    <span className="ml-1">{pin.stats.totalAmountOfCollects}</span>
                </div>
                <div
                    className="flex text-gray-700 items-center group duration-75 delay-75 hover:text-black flex-row"
                    title={pin.createdAt}
                >
                    <FiClock size={18} />
                    <span className="ml-1 text-sm">{dayjs(new Date(pin.createdAt))?.fromNow()}</span>
                </div>
            </div>
        </div>

    )
}

export default MetaCard