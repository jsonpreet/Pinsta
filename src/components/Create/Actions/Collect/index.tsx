import Modal from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import CollectForm from './CollectForm';
import { useCollectModuleStore } from '@lib/store/collect-module';
import { getModule } from '@utils/functions/getModule';
import { Analytics, TRACK } from '@utils/analytics';
import GetModuleIcon from '@components/UI/GetModuleIcon';
import { BsCash } from 'react-icons/bs';

const CollectSettings: FC = () => {
    const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Tooltip placement="top" content={getModule(selectedCollectModule).name}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                        setShowModal(!showModal);
                        Analytics.track(TRACK.COLLECT_MODULE.OPEN);
                    }}
                    aria-label="Choose Collect Module"
                >
                    <div className='flex space-x-1'>
                        <div className="text-red-500">
                            <GetModuleIcon module={selectedCollectModule} size={24} />
                        </div>
                        <span className='font-semibold text-sm'>{getModule(selectedCollectModule).name}</span>
                    </div>
                </motion.button>
            </Tooltip>
            <Modal
                title={`Collect settings`}
                icon={<BsCash size={23} className="text-red-500" />}
                show={showModal}
                onClose={() => setShowModal(false)}
            >
                <CollectForm setShowModal={setShowModal} />
            </Modal>
        </>
    );
};

export default CollectSettings;