import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAppStore } from '@lib/store';
import { motion } from 'framer-motion';
import dynamic from "next/dynamic";
import { Loader } from "@components/UI/Loader";
import { ElectedMirror } from "@utils/lens/generated";
import { getModule } from "@utils/functions/getModule";
import { CollectModules } from '@utils/lens';
import Modal from "@components/UI/Modal";
import GetModuleIcon from "@components/UI/GetModuleIcon";
import { toast } from "react-hot-toast";
import { SIGN_IN_REQUIRED_MESSAGE } from "@utils/constants";
import { RiShoppingBag3Fill, RiShoppingBag3Line } from "react-icons/ri";
import clsx from 'clsx';

dayjs.extend(relativeTime)

const CollectModule = dynamic(() => import('./CollectModule'), {
    loading: () => <Loader />
});

type Props = {
    pin: PinstaPublication
    electedMirror?: ElectedMirror
    isComment?: boolean
}

const Collect: FC<Props> = ({ pin, electedMirror, isComment = false }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [count, setCount] = useState(0);
    const [showCollectModal, setShowCollectModal] = useState(false);
    const isFreeCollect = pin?.collectModule.__typename === 'FreeCollectModuleSettings';
    const isUnknownCollect = pin?.collectModule.__typename === 'UnknownCollectModuleSettings';
    const hasCollected = pin?.hasCollectedByMe;

    const showModal = () => {
        if (!currentProfile) {
            return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }
        setShowCollectModal(true);
    }

    useEffect(() => {
        if (pin?.stats?.totalAmountOfCollects) {
            setCount(pin?.stats?.totalAmountOfCollects);
        }
    }, [pin]);

    return (
        <>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => showModal()}
                aria-label="Collect"
            >
                <div
                    className='flex flex-row justify-center items-center text-purple-500'
                >
                    {hasCollected ? (
                        <RiShoppingBag3Fill size={isComment ? 14 : 17} />
                    ) : (
                            <RiShoppingBag3Line size={isComment ? 14 : 17} />
                        )
                    }
                    <span className={`ml-1 ${isComment ? `text-xs` : `text-sm`}`}>{count}</span>
                </div>   
            </motion.button>   
             <Modal
                title={
                isFreeCollect
                    ? 'Free Collect'
                    : isUnknownCollect
                    ? 'Unknown Collect'
                    : getModule(pin?.collectModule?.type).name
                }
                icon={
                    <div className="text-red-500">
                        <GetModuleIcon
                            module={isFreeCollect ? CollectModules.FreeCollectModule : pin?.collectModule?.type}
                            size={23}
                        />
                    </div>
                }
                show={showCollectModal}
                onClose={() => setShowCollectModal(false)}
            >
                <CollectModule count={count} setCount={setCount} publication={pin}/>
            </Modal>
        </>
    )
}

export default Collect