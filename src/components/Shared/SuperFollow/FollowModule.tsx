
import { BiUserCircle, BiStar } from 'react-icons/bi';
import { Button } from '@components/Shared/Button';
import { WarningMessage } from '@components/Shared/WarningMessage';
import type { PinstaFollowModule } from '@utils/custom-types';
import formatAddress from '@utils/functions/formatAddress';
import formatHandle from '@utils/functions/formatHandle';
import getSignature from '@utils/functions/getSignature';
import getTokenImage from '@utils/functions/getTokenImage';
import onError from '@utils/functions/onError';
import splitSignature from '@utils/functions/splitSignature';
import { LensHubProxy } from '@utils/abis';
import { LENSHUB_PROXY_ADDRESS, POLYGONSCAN_URL, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants';
import type { Profile } from '@utils/lens';
import { FollowModules, useApprovedModuleAllowanceAmountQuery, useBroadcastMutation, useCreateFollowTypedDataMutation, useSuperFollowQuery } from '@utils/lens';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useBalance, useContractWrite, useSignTypedData } from 'wagmi';

import { Loader } from '../Loader';
import Slug from '../Slug';
import Uniswap from '../Uniswap';
import useAppStore from '@lib/store';

interface Props {
    profile: Profile;
    setFollowing: Dispatch<boolean>;
    setShowFollowModal: Dispatch<boolean>;
    again: boolean;
}

const FollowModule: FC<Props> = ({ profile, setFollowing, setShowFollowModal, again }) => {
    const userSigNonce = useAppStore((state) => state.userSigNonce);
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [allowed, setAllowed] = useState(true);
    const { address } = useAccount();
    const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

    const onCompleted = () => {
        setFollowing(true);
        setShowFollowModal(false);
        toast.success('Followed successfully!');
    };

    const { isLoading: writeLoading, write } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'followWithSig',
        mode: 'recklesslyUnprepared',
        onSuccess: onCompleted,
        onError
    });

    const { data, loading } = useSuperFollowQuery({
        variables: { request: { profileId: profile?.id } },
        skip: !profile?.id
    });

    const followModule: any = data?.profile?.followModule;

    const { data: allowanceData, loading: allowanceLoading } = useApprovedModuleAllowanceAmountQuery({
        variables: {
        request: {
            currencies: followModule?.amount?.asset?.address,
            followModules: [FollowModules.FeeFollowModule],
            collectModules: [],
            referenceModules: []
        }
        },
        skip: !followModule?.amount?.asset?.address || !currentProfile,
        onCompleted: (data) => {
        setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
        }
    });

    const { data: balanceData } = useBalance({
        address: currentProfile?.ownedBy,
        token: followModule?.amount?.asset?.address,
        formatUnits: followModule?.amount?.asset?.decimals,
        watch: true
    });
    let hasAmount = false;

    if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(followModule?.amount?.value)) {
        hasAmount = false;
    } else {
        hasAmount = true;
    }

    const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
        onCompleted
    });
    const [createFollowTypedData, { loading: typedDataLoading }] = useCreateFollowTypedDataMutation({
        onCompleted: async ({ createFollowTypedData }) => {
        const { id, typedData } = createFollowTypedData;
        const { profileIds, datas: followData, deadline } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
            follower: address,
            profileIds,
            datas: followData,
            sig
        };
        setUserSigNonce(userSigNonce + 1);
        const { data } = await broadcast({ variables: { request: { id, signature } } });
        if (data?.broadcast.__typename === 'RelayError') {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
        },
        onError
    });

    const createFollow = async () => {
        if (!currentProfile) {
        return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }

        try {
        await createFollowTypedData({
            variables: {
            options: { overrideSigNonce: userSigNonce },
            request: {
                follow: [
                {
                    profile: profile?.id,
                    followModule: {
                    feeFollowModule: {
                        amount: {
                        currency: followModule?.amount?.asset?.address,
                        value: followModule?.amount?.value
                        }
                    }
                    }
                }
                ]
            }
            }
        });
        } catch {}
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-5">
        <div className="pb-2 space-y-1.5">
            <div className="text-lg font-bold">
            Super follow <Slug slug={formatHandle(profile?.handle)} prefix="@" /> {again ? 'again' : ''}
            </div>
            <div className="lt-text-gray-500">Follow {again ? 'again' : ''} and get some awesome perks!</div>
        </div>
        <div className="flex items-center py-2 space-x-1.5">
            <img
            className="w-7 h-7"
            height={28}
            width={28}
            src={getTokenImage(followModule?.amount?.asset?.symbol)}
            alt={followModule?.amount?.asset?.symbol}
            title={followModule?.amount?.asset?.name}
            />
            <span className="space-x-1">
            <span className="text-2xl font-bold">{followModule?.amount?.value}</span>
            <span className="text-xs">{followModule?.amount?.asset?.symbol}</span>
            </span>
        </div>
        <div className="flex items-center space-x-2">
            <BiUserCircle className="w-4 h-4 lt-text-gray-500" />
            <div className="space-x-1.5">
            <span>Recipient:</span>
            <a
                href={`${POLYGONSCAN_URL}/address/${followModule?.recipient}`}
                target="_blank"
                className="font-bold text-gray-600"
                rel="noreferrer noopener"
            >
                {formatAddress(followModule?.recipient)}
            </a>
            </div>
        </div>
        <div className="pt-5 space-y-2">
            <div className="text-lg font-bold">Perks you get</div>
            <ul className="space-y-1 text-sm lt-text-gray-500">
            <li className="flex space-x-2 tracking-normal leading-6">
                <div>•</div>
                <div>You can comment on @{formatHandle(profile?.handle)}&rsquo;s publications</div>
            </li>
            <li className="flex space-x-2 tracking-normal leading-6">
                <div>•</div>
                <div>You can collect @{formatHandle(profile?.handle)}&rsquo;s publications</div>
            </li>
            <li className="flex space-x-2 tracking-normal leading-6">
                <div>•</div>
                <div>You will get super follow badge in @{formatHandle(profile?.handle)}&rsquo;s profile</div>
            </li>
            <li className="flex space-x-2 tracking-normal leading-6">
                <div>•</div>
                <div>You will have high voting power if you followed multiple times</div>
            </li>
            <li className="flex space-x-2 tracking-normal leading-6">
                <div>•</div>
                <div>More coming soon™</div>
            </li>
            </ul>
        </div>
        {currentProfile ? (
            allowanceLoading ? (
            <div className="mt-5 w-28 rounded-lg h-[34px] shimmer" />
            ) : allowed ? (
            hasAmount ? (
                <Button
                className="text-sm !px-3 !py-1.5 mt-5"
                outline
                onClick={createFollow}
                disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
                icon={
                    typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
                        <Loader size="sm" />
                    ) : (
                        <BiStar className="w-4 h-4" />
                    )
                }
                >
                Super follow {again ? 'again' : 'now'}
                </Button>
            ) : (
                <WarningMessage
                className="mt-5"
                message={<Uniswap module={followModule as PinstaFollowModule} />}
                />
            )
            ) : (
            <div className="mt-5">
                {/* <AllowanceButton
                title="Allow follow module"
                module={allowanceData?.approvedModuleAllowanceAmount[0]}
                allowed={allowed}
                setAllowed={setAllowed}
                /> */}
            </div>
            )
        ) : null}
        </div>
    );
};

export default FollowModule;