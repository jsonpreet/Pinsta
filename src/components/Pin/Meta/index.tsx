import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC } from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi"
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAppStore } from '@lib/store';
import Collect from "./Collect";
import Mirror from "./Mirror";
import Like from "./Like";
import clsx from "clsx";
import { LENSTER_URL } from "@utils/constants";
import { BiLinkExternal } from "react-icons/bi";

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication;
    isComment: boolean;
}

const Meta: FC<Props> = ({ pin, isComment = false }) => {
    const isMirror = pin?.__typename === 'Mirror';
    const currentProfile = useAppStore((state) => state.currentProfile);
    const canMirror = currentProfile ? pin?.canMirror?.result : true;
    const collectModuleType = pin?.collectModule.__typename
    return (
        <div
            className={clsx(
                'flex w-full items-center mt-4',
                isComment ? 'space-x-4' : 'justify-between'
            )}
        >
            <Like isComment={isComment} pin={pin}/>
            {canMirror ?
                <Mirror isComment={isComment} pin={pin}/>
                : null
            }
            <div className="flex flex-row justify-center text-blue-500 items-center">
                <HiOutlineChatAlt2 size={isComment ? 14 : 18} />
                <span className={`ml-1 ${isComment ? `text-xs` : `text-sm`}`}>{isMirror ? pin?.mirrorOf?.stats.totalAmountOfComments : pin.stats.totalAmountOfComments}</span>
            </div>
            {collectModuleType !== 'RevertCollectModuleSettings' ?
                <Collect isComment={isComment} pin={pin} />
                : null
            }
            {!isComment ?
                <a
                    href={`${LENSTER_URL}/posts/${pin.id}`}
                    className="flex text-gray-700 dark:text-white items-center"
                    title={pin.createdAt}
                    target="_blank"
                    onClick={(event) => event.stopPropagation()}
                    rel="noopener noreferrer"
                >
                    <BiLinkExternal size={isComment ? 14 : 18} />
                    <span className={`ml-1 ${isComment ? `text-xs` : `text-sm`}`}>{dayjs(new Date(pin.createdAt))?.fromNow()}</span>
                </a>
                : null
            }
        </div>

    )
}

export default Meta