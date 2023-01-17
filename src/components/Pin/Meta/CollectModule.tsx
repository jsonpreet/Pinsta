/* eslint-disable @next/next/no-img-element */
import { Button } from '@components/UI/Button';
import { Tooltip } from '@components/UI/Tooltip';
import { WarningMessage } from '@components/UI/WarningMessage';
import { useQuery } from '@tanstack/react-query';
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants';
import { LensHubProxy, UpdateOwnableFeeCollectModule } from '@utils/abis';
import { POLYGONSCAN_URL } from '@utils/constants';
import dayjs from 'dayjs';
import type { BigNumber } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import type { ElectedMirror, Publication } from '@utils/lens';
import {
  CollectModules,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastMutation,
  useCollectModuleQuery,
  useCreateCollectTypedDataMutation,
  useProxyActionMutation,
  usePublicationRevenueQuery
} from '@utils/lens';
import type { Dispatch, FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useBalance, useContractRead, useContractWrite, useSignTypedData } from 'wagmi';
import useAppStore from '@lib/store';
import { Analytics, TRACK } from '@utils/analytics';
import { CustomErrorWithData } from '@utils/custom-types';
import splitSignature from '@utils/functions/splitSignature';
import getSignature from '@utils/functions/getSignature';
import { Loader } from '@components/UI/Loader';
import formatHandle from '@utils/functions/formatHandle';
import getTokenImage from '@utils/functions/getTokenImage';
import { formatNumber } from '@utils/functions/formatNumber';
import formatAddress from '@utils/functions/formatAddress';
import Uniswap from '@components/Common/Uniswap';
import { BsCash, BsCheckCircleFill, BsClock } from 'react-icons/bs';
import { BiCollection, BiGridAlt } from 'react-icons/bi';
import { HiOutlinePuzzle, HiOutlineUsers } from 'react-icons/hi';
import formatTime from '@utils/functions/formatTime';
import CollectWarning from '@components/Common/CollectWarning';
import InterweaveContent from '@components/Common/InterweaveContent';
import ReferralAlert from '@components/Common/ReferralAlert';
import AllowanceButton from '@components/Settings/Allowance/Button';
import getAssetAddress from '@utils/functions/getAssetAddress';
import getCoingeckoPrice from '@utils/functions/getCoingeckoPrice';
import { MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS } from '@utils/contracts';

interface Props {
  count: number;
  setCount: Dispatch<number>;
  publication: Publication;
  electedMirror?: ElectedMirror;
}

const CollectModule: FC<Props> = ({ count, setCount, publication, electedMirror }) => {
    const userSigNonce = useAppStore((state) => state.userSigNonce);
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [revenue, setRevenue] = useState(0);
    const [hasCollectedByMe, setHasCollectedByMe] = useState(publication?.hasCollectedByMe);
    const [showCollectorsModal, setShowCollectorsModal] = useState(false);
    const [allowed, setAllowed] = useState(true);
    const { address } = useAccount();
    const [readMore, setReadMore] = useState(false)

    const onError = (error: CustomErrorWithData) => {
        toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    }

    useEffect(() => {
        if (publication) {
            (publication?.metadata?.content?.length > 100) ? setReadMore(true) : setReadMore(false)
        }
    }, [publication])

    const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

    const { data, loading } = useCollectModuleQuery({
        variables: { request: { publicationId: publication?.id } }
    });

    const collectModule: any = data?.publication?.collectModule;

    const onCompleted = () => {
        setRevenue(revenue + parseFloat(collectModule?.amount?.value));
        setCount(count + 1);
        setHasCollectedByMe(true);
        toast.success('Transaction submitted successfully!');
        Analytics.track(TRACK.COLLECT.COLLECTED);
    };

    const { isFetching, refetch } = useContractRead({
        address: MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        abi: UpdateOwnableFeeCollectModule,
        functionName: 'getPublicationData',
        args: [parseInt(publication.profile?.id), parseInt(publication?.id.split('-')[1])],
        enabled: false
    });

    const { isLoading: writeLoading, write } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'collectWithSig',
        mode: 'recklesslyUnprepared',
        onSuccess: onCompleted,
        onError
    });

    const percentageCollected = (count / parseInt(collectModule?.collectLimit)) * 100;

    const { data: allowanceData, loading: allowanceLoading } = useApprovedModuleAllowanceAmountQuery({
        variables: {
            request: {
                currencies: collectModule?.amount?.asset?.address,
                followModules: [],
                collectModules: collectModule?.type,
                referenceModules: []
            }
        },
        skip: !collectModule?.amount?.asset?.address || !currentProfile,
        onCompleted: (data) => {
            setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
        }
    });

    const { data: revenueData, loading: revenueLoading } = usePublicationRevenueQuery({
        variables: {
            request: {
                publicationId: publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id
            }
        },
        pollInterval: 5000,
        skip: !publication?.id
    });

    const { data: usdPrice } = useQuery(
        ['coingeckoData'],
        () => getCoingeckoPrice(getAssetAddress(collectModule?.amount?.asset?.symbol)).then((res) => res),
        { enabled: Boolean(collectModule?.amount) }
    );

    useEffect(() => {
        setRevenue(parseFloat((revenueData?.publicationRevenue?.revenue?.total?.value as any) ?? 0));
    }, [revenueData]);

    const { data: balanceData, isLoading: balanceLoading } = useBalance({
        address,
        token: collectModule?.amount?.asset?.address,
        formatUnits: collectModule?.amount?.asset?.decimals,
        watch: true
    });

    let hasAmount = false;
    if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(collectModule?.amount?.value)) {
        hasAmount = false;
    } else {
        hasAmount = true;
    }

    const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
        onCompleted
    });
    const [createCollectTypedData, { loading: typedDataLoading }] = useCreateCollectTypedDataMutation({
        onCompleted: async ({ createCollectTypedData }) => {
            const { id, typedData } = createCollectTypedData;
            const { profileId, pubId, data: collectData, deadline } = typedData.value;
            const signature = await signTypedDataAsync(getSignature(typedData));
            const { v, r, s } = splitSignature(signature);
            const sig = { v, r, s, deadline };
            const inputStruct = {
                collector: address,
                profileId,
                pubId,
                data: collectData,
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

    const [createCollectProxyAction, { loading: proxyActionLoading }] = useProxyActionMutation({
        onCompleted,
        onError
    });

    const createViaProxyAction = async (variables: any) => {
        const { data } = await createCollectProxyAction({ variables });
        if (!data?.proxyAction) {
            await createCollectTypedData({
                variables: {
                request: { publicationId: publication?.id },
                options: { overrideSigNonce: userSigNonce }
                }
            });
        }
    };

    const createCollect = async () => {
        if (!currentProfile) {
            return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }

        try {
            if (collectModule?.type === CollectModules.FreeCollectModule) {
                await createViaProxyAction({
                    request: { collect: { freeCollect: { publicationId: publication?.id } } }
                });
            } else if (collectModule?.__typename === 'UnknownCollectModuleSettings') {
                refetch().then(async ({ data }) => {
                    if (data) {
                        const decodedData: any = data;
                        const encodedData = defaultAbiCoder.encode(
                        ['address', 'uint256'],
                        [decodedData?.[2] as string, decodedData?.[1] as BigNumber]
                        );
                        await createCollectTypedData({
                            variables: {
                                options: { overrideSigNonce: userSigNonce },
                                request: { publicationId: publication?.id, unknownModuleData: encodedData }
                            }
                        });
                    }
                });
            } else {
                await createCollectTypedData({
                    variables: {
                        options: { overrideSigNonce: userSigNonce },
                        request: { publicationId: electedMirror ? electedMirror.mirrorId : publication?.id }
                    }
                });
            }
        } catch {}
    };

    if (loading || revenueLoading) {
        return <Loader />;
    }

    const isLoading =
        typedDataLoading || proxyActionLoading || signLoading || isFetching || writeLoading || broadcastLoading;

    return (
        <>
            {(collectModule?.type === CollectModules.LimitedFeeCollectModule ||
                collectModule?.type === CollectModules.LimitedTimedFeeCollectModule) && (
                <Tooltip placement="top" content={`${percentageCollected.toFixed(0)}% Collected`}>
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700">
                        <div className="h-2.5 primary-button" style={{ width: `${percentageCollected}%` }} />
                    </div>
                </Tooltip>
            )}
            <div className="p-5">
                {collectModule?.followerOnly && (
                    <div className="pb-5">
                        <CollectWarning
                            handle={formatHandle(publication?.profile?.handle)}
                            isSuperFollow={publication?.profile?.followModule?.__typename === 'FeeFollowModuleSettings'}
                        />
                    </div>
                )}
                <div className="pb-2 space-y-1.5">
                    {publication?.metadata?.name && (
                        <div className="text-xl font-bold">{publication?.metadata?.name}</div>
                    )}
                    {publication?.metadata?.content && (
                        <div className="lt-text-gray-500">
                            <InterweaveContent content={!readMore ? publication?.metadata?.content : `${publication?.metadata?.content?.substring(0, 100)}...`}/>
                            {/* {readMore &&
                                <button 
                                    className='ml-1 font-semibold hover:underline' 
                                    onClick={() => {
                                        setReadMore(false)
                                        Analytics.track(`clicked_on_read_less_from_pin_${publication.id}`);
                                    }}
                                >
                                    Read More
                                </button>
                            } */}
                        </div>
                    )}
                    <ReferralAlert
                        electedMirror={electedMirror}
                        mirror={publication}
                        referralFee={collectModule?.referralFee}
                    />
                </div>
                {collectModule?.amount && (
                    <div className="flex items-center py-2 space-x-1.5">
                        <img
                            className="w-7 h-7"
                            height={28}
                            width={28}
                            src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                            alt={collectModule?.amount?.asset?.symbol}
                            title={collectModule?.amount?.asset?.symbol}
                        />
                        <span className="space-x-1">
                            <span className="text-2xl font-bold">{collectModule.amount.value}</span>
                            <span className="text-xs">{collectModule?.amount?.asset?.symbol}</span>
                            {usdPrice ? (
                                <>
                                    <span className="lt-text-gray-500 px-0.5">·</span>
                                    <span className="text-xs font-bold lt-text-gray-500">
                                        ${(collectModule.amount.value * usdPrice).toFixed(2)}
                                    </span>
                                </>
                            ) : null}
                        </span>
                    </div>
                )}
                <div className="space-y-1.5">
                    <div className="block space-y-1 sm:flex sm:space-x-5 item-center">
                        <div className="flex items-center space-x-2">
                            <HiOutlineUsers className="w-4 h-4 lt-text-gray-500" />
                            <button
                                className="font-bold"
                                type="button"
                                onClick={() => {
                                setShowCollectorsModal(!showCollectorsModal);
                                    Analytics.track(TRACK.COLLECT.OPEN);
                                }}
                            >
                                {formatNumber(count)} collectors
                            </button>
                            {/* <Modal
                                title={`Collected by`}
                                icon={<BiCollection className="w-5 h-5 text-brand" />}
                                show={showCollectorsModal}
                                onClose={() => setShowCollectorsModal(false)}
                            >
                                <Collectors
                                    publicationId={
                                        publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id
                                    }
                                />
                            </Modal> */}
                        </div>
                        {collectModule?.collectLimit && (
                            <div className="flex items-center space-x-2">
                                <BiGridAlt className="w-4 h-4 lt-text-gray-500" />
                                <div className="font-bold">
                                    {parseInt(collectModule?.collectLimit) - count} available
                                </div>
                            </div>
                        )}
                        {collectModule?.referralFee ? (
                            <div className="flex items-center space-x-2">
                                <BsCash className="w-4 h-4 lt-text-gray-500" />
                                <div className="font-bold">
                                    {collectModule.referralFee}% referral fee
                                </div>
                            </div>
                        ) : null}
                    </div>
                    {revenueData?.publicationRevenue && (
                        <div className="flex items-center space-x-2">
                            <BsCash className="w-4 h-4 lt-text-gray-500" />
                            <div className="flex items-center space-x-1.5">
                                <span>Revenue:</span>
                                <span className="flex items-center space-x-1">
                                <img
                                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                                    className="w-5 h-5"
                                    height={20}
                                    width={20}
                                    alt={collectModule?.amount?.asset?.symbol}
                                    title={collectModule?.amount?.asset?.symbol}
                                />
                                <div className="flex items-baseline space-x-1.5">
                                    <div className="font-bold">{revenue}</div>
                                    <div className="text-[10px]">{collectModule?.amount?.asset?.symbol}</div>
                                    {usdPrice ? (
                                    <>
                                        <span className="lt-text-gray-500">·</span>
                                        <span className="text-xs font-bold lt-text-gray-500">
                                        ${(revenue * usdPrice).toFixed(2)}
                                        </span>
                                    </>
                                    ) : null}
                                </div>
                                </span>
                            </div>
                        </div>
                    )}
                    {collectModule?.endTimestamp && (
                        <div className="flex items-center space-x-2">
                            <BsClock className="w-4 h-4 lt-text-gray-500" />
                            <div className="space-x-1.5">
                                <span>Sale Ends:</span>
                                <span className="font-bold text-gray-600" title={formatTime(collectModule.endTimestamp)}>
                                    {dayjs(collectModule.endTimestamp).format('MMMM DD, YYYY')} at{' '}
                                    {dayjs(collectModule.endTimestamp).format('hh:mm a')}
                                </span>
                            </div>
                        </div>
                    )}
                    {data?.publication?.collectNftAddress && (
                        <div className="flex items-center space-x-2">
                            <HiOutlinePuzzle className="w-4 h-4 lt-text-gray-500" />
                            <div className="space-x-1.5">
                                <span>Token:</span>
                                <a
                                    href={`${POLYGONSCAN_URL}/token/${data?.publication?.collectNftAddress}`}
                                    target="_blank"
                                    className="font-bold text-gray-600"
                                    rel="noreferrer noopener"
                                >
                                    {formatAddress(data?.publication?.collectNftAddress)}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2 mt-5">
                    {currentProfile && !hasCollectedByMe ? (
                        allowanceLoading || balanceLoading ? (
                        <div className="w-28 rounded-lg h-[34px] shimmer" />
                        ) : allowed ? (
                        hasAmount ? (
                            <Button
                                onClick={createCollect}
                                disabled={isLoading}
                                icon={isLoading ? <Loader size="sm" /> : <BiCollection className="w-4 h-4" />}
                            >
                            Collect now
                            </Button>
                        ) : (
                            <WarningMessage message={<Uniswap module={collectModule} />} />
                        )
                        ) : (
                            <AllowanceButton
                                title="Allow collect module"
                                module={allowanceData?.approvedModuleAllowanceAmount[0]}
                                allowed={allowed}
                                setAllowed={setAllowed}
                            />
                        )
                    ) : null}
                </div>
                {publication?.hasCollectedByMe && (
                <div className="mt-3 font-bold text-green-500 flex items-center space-x-1.5">
                    <BsCheckCircleFill className="h-5 w-5" />
                    <div>You already collected this</div>
                </div>
                )}
            </div>
        </>
    );
};

export default CollectModule;