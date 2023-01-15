import { Button } from '@components/UI/Button';
import { Loader } from '@components/UI/Loader';
import Modal from '@components/UI/Modal';
import { WarningMessage } from '@components/UI/WarningMessage';
import { Analytics } from '@utils/analytics';
import { ERROR_MESSAGE } from '@utils/constants';
import { CustomErrorWithData } from '@utils/custom-types';
import { getModule } from '@utils/functions/getModule';
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from '@utils/lens';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { BsExclamation } from 'react-icons/bs';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';

interface Props {
  title?: string;
  module: any;
  allowed: boolean;
  setAllowed: Dispatch<boolean>;
}

const AllowanceButton: FC<Props> = ({ title = `Allow`, module, allowed, setAllowed }) => {
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [generateAllowanceQuery, { loading: queryLoading }] =
        useGenerateModuleCurrencyApprovalDataLazyQuery();
    
    
    const onError = (error: CustomErrorWithData) => {
        toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    }


    const {
        data: txData,
        isLoading: transactionLoading,
        sendTransaction
    } = useSendTransaction({
        request: {},
        mode: 'recklesslyUnprepared',
        onError
    });

    const { isLoading: waitLoading } = useWaitForTransaction({
        hash: txData?.hash,
        onSuccess: () => {
            toast.success(`Module ${allowed ? 'disabled' : 'enabled'} successfully!`);
            setShowWarningModal(false);
            setAllowed(!allowed);
            Analytics.track(`module_${allowed ? 'disabled' : 'enabled'}`);
        },
        onError
    });

    const handleAllowance = (currencies: string, value: string, selectedModule: string) => {
        generateAllowanceQuery({
            variables: {
                request: {
                    currency: currencies,
                    value: value,
                    [getModule(module.module).field]: selectedModule
                }
            }
        }).then((res) => {
            const data = res?.data?.generateModuleCurrencyApprovalData;
            sendTransaction?.({
                recklesslySetUnpreparedRequest: {
                    from: data?.from,
                    to: data?.to,
                    data: data?.data
                }
            });
        });
    };

    return allowed ? (
        <Button
            variant="warning"
            icon={
                queryLoading || transactionLoading || waitLoading ? (
                    <Loader size="sm" />
                ) : (
                    <BiMinus className="w-4 h-4" />
                )
            }
            onClick={() => handleAllowance(module.currency, '0', module.module)}
        >
        Revoke
        </Button>
    ) : (
        <>
        <Button
            variant="success"
            icon={<BiPlus className="w-4 h-4" />}
            onClick={() => setShowWarningModal(!showWarningModal)}
        >
            {title}
        </Button>
        <Modal
            title={`Warning`}
            icon={<BsExclamation className="w-5 h-5 text-yellow-500" />}
            show={showWarningModal}
            onClose={() => setShowWarningModal(false)}
        >
            <div className="p-5 space-y-3">
                <WarningMessage
                    title={`Handle with care!`}
                    message={
                    <div className="leading-6">
                        Please be aware that by allowing this module, the amount indicated will be automatically
                        deducted when you <b>collect</b> and <b>super follow</b>.
                    </div>
                    }
                />
                <Button
                    variant="success"
                    icon={
                        queryLoading || transactionLoading || waitLoading ? (
                            <Loader size="sm" />
                        ) : (
                            <BiPlus className="w-4 h-4" />
                        )
                    }
                    onClick={() =>
                        handleAllowance(module.currency, Number.MAX_SAFE_INTEGER.toString(), module.module)
                    }
                >
                    {title}
                </Button>
            </div>
        </Modal>
        </>
    );
};

export default AllowanceButton;