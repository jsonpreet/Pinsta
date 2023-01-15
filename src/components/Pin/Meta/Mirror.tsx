import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC, useState } from "react";
import relativeTime from 'dayjs/plugin/relativeTime'
import { RiArrowLeftRightFill } from "react-icons/ri";
import { useAppStore } from '@lib/store';
import { useContractWrite, useSignTypedData } from "wagmi";
import { publicationKeyFields } from "@utils/functions/publicationKeyFields";
import { ApolloCache } from "@apollo/client";
import { toast } from "react-hot-toast";
import { Analytics } from "@utils/analytics";
import { CreateMirrorRequest, useBroadcastMutation, useCreateMirrorTypedDataMutation, useCreateMirrorViaDispatcherMutation } from "@utils/lens/generated";
import { LENSHUB_PROXY_ADDRESS, SIGN_IN_REQUIRED_MESSAGE } from "@utils/constants";
import { LensHubProxy } from "@utils/abis";
import splitSignature from "@utils/functions/splitSignature";
import getSignature from "@utils/functions/getSignature";
import onError from "@utils/functions/onError";
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Loader } from "@components/UI/Loader";

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication
    isComment?: boolean
}

const Mirror: FC<Props> = ({ pin, isComment = false }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const isMirror = pin?.__typename === 'Mirror';
    const userSigNonce = useAppStore((state) => state.userSigNonce);
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
    const count = isMirror
        ? pin?.mirrorOf?.stats?.totalAmountOfMirrors
        : pin?.stats?.totalAmountOfMirrors;
    const [mirrored, setMirrored] = useState(pin?.mirrors?.length > 0 || pin?.mirrorOf?.mirrors?.length > 0);

    const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

    const updateCache = (cache: ApolloCache<any>) => {
        cache.modify({
            id: publicationKeyFields(isMirror ? pin?.mirrorOf : pin),
            fields: {
                stats: (stats) => ({
                ...stats,
                totalAmountOfMirrors: stats.totalAmountOfMirrors + 1
                })
            }
        });
    };

    const onCompleted = () => {
        setMirrored(true);
        toast.success('Post has been mirrored!');
        Analytics.track('Post has been mirrored!');
    };

    const { isLoading: writeLoading, write } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'mirrorWithSig',
        mode: 'recklesslyUnprepared',
        onSuccess: onCompleted,
        onError
    });

    const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({
        onCompleted,
        update: updateCache
    });

    const [createMirrorTypedData, { loading: typedDataLoading }] = useCreateMirrorTypedDataMutation({
        onCompleted: async ({ createMirrorTypedData }) => {
            const { id, typedData } = createMirrorTypedData;
            const {
                profileId,
                profileIdPointed,
                pubIdPointed,
                referenceModule,
                referenceModuleData,
                referenceModuleInitData,
                deadline
            } = typedData.value;
            const signature = await signTypedDataAsync(getSignature(typedData));
            const { v, r, s } = splitSignature(signature);
            const sig = { v, r, s, deadline };
            const inputStruct = {
                profileId,
                profileIdPointed,
                pubIdPointed,
                referenceModule,
                referenceModuleData,
                referenceModuleInitData,
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

    const [createMirrorViaDispatcher, { loading: dispatcherLoading }] = useCreateMirrorViaDispatcherMutation({
        onCompleted,
        onError,
        update: updateCache
    });

    const createViaDispatcher = async (request: CreateMirrorRequest) => {
        const { data } = await createMirrorViaDispatcher({
            variables: { request }
        });
        if (data?.createMirrorViaDispatcher?.__typename === 'RelayError') {
            await createMirrorTypedData({
                variables: {
                    options: { overrideSigNonce: userSigNonce },
                    request
                }
            });
        }
    };

    const createMirror = async () => {
        if (!currentProfile) {
        return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }

        try {
        const request = {
            profileId: currentProfile?.id,
            publicationId: pin?.id,
            referenceModule: {
            followerOnlyReferenceModule: false
            }
        };

        if (currentProfile?.dispatcher?.canUseRelay) {
            return await createViaDispatcher(request);
        }

        return await createMirrorTypedData({
            variables: {
            options: { overrideSigNonce: userSigNonce },
            request
            }
        });
        } catch {}
    };

    const isLoading = typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;
    return (
        <>         
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={createMirror}
                disabled={isLoading}
                aria-label="Mirror"
            >   
            <div className="flex flex-row justify-center items-center">
                {isLoading ? (
                    <Loader size="sm" />
                ) : (
                    <RiArrowLeftRightFill size={isComment ? 14 : 18} />
                )}  
                <span className={`ml-1 ${isComment ? `text-xs` : `text-base`}`}>{pin.stats.totalAmountOfMirrors}</span>
            </div>     
            </motion.button>             
        </>

    )
}

export default Mirror