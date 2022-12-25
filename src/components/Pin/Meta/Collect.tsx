import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import relativeTime from 'dayjs/plugin/relativeTime'
import { FiShoppingBag } from "react-icons/fi";
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

dayjs.extend(relativeTime)

const CollectModule = dynamic(() => import('./CollectModule'), {
    loading: () => <Loader />
});

type Props = {
    pin: PinstaPublication
    electedMirror?: ElectedMirror;
}

const Collect: FC<Props> = ({ pin, electedMirror }) => {
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
                <div className="flex flex-row justify-center items-center">
                    <FiShoppingBag size={17} />
                    <span className="ml-1">{count}</span>
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
                    <div className="text-brand">
                        <GetModuleIcon
                            module={isFreeCollect ? CollectModules.FreeCollectModule : pin?.collectModule?.type}
                            size={5}
                        />
                    </div>
                }
                show={showCollectModal}
                onClose={() => setShowCollectModal(false)}
            >
                <CollectModule/>
            </Modal>
        </>
    )
}

export default Collect