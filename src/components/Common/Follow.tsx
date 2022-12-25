import type { ApolloCache } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Loader } from '@components/UI/Loader';
import getSignature from '@utils/functions/getSignature';
import onError from '@utils/functions/onError';
import splitSignature from '@utils/functions/splitSignature';
import { LensHubProxy } from '@utils/abis';
import { LENSHUB_PROXY_ADDRESS, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants';
import type { Profile } from '@utils/lens';
import { useBroadcastMutation, useCreateFollowTypedDataMutation, useProxyActionMutation } from '@utils/lens';
import type { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';
import useAppStore from '@lib/store';
import { HiOutlineUserAdd } from 'react-icons/hi';

interface Props {
    profile: Profile;
    setFollowing: Dispatch<boolean>;
    showText?: boolean;
    type?: string;
}

const Follow: FC<Props> = ({ profile, showText = false, setFollowing, type = "light" }) => {
    const userSigNonce = useAppStore((state) => state.userSigNonce);
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
    const currentProfile = useAppStore((state) => state.currentProfile);
    const { address } = useAccount();

    const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

    const onCompleted = () => {
        setFollowing(true);
        toast.success('Followed successfully!');
    };

    const updateCache = (cache: ApolloCache<any>) => {
        cache.modify({
            id: `Profile:${profile?.id}`,
            fields: {
                isFollowedByMe: () => true
            }
        });
    };

    const { isLoading: writeLoading, write } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'followWithSig',
        mode: 'recklesslyUnprepared',
        onSuccess: onCompleted,
        onError
    });

    const [broadcast, { loading: broadcastLoading }] = useBroadcastMutation({ onCompleted });
    const [createFollowTypedData, { loading: typedDataLoading }] = useCreateFollowTypedDataMutation({
        onCompleted: async ({ createFollowTypedData }) => {
            const { id, typedData } = createFollowTypedData;
            const { deadline } = typedData.value;
            // TODO: Replace deep clone with right helper
            const signature = await signTypedDataAsync(getSignature(JSON.parse(JSON.stringify(typedData))));
            setUserSigNonce(userSigNonce + 1);
            const { profileIds, datas: followData } = typedData.value;
            const { v, r, s } = splitSignature(signature);
            const sig = { v, r, s, deadline };
            const inputStruct = {
                follower: address,
                profileIds,
                datas: followData,
                sig
            };
            const { data } = await broadcast({ variables: { request: { id, signature } } });
            if (data?.broadcast.__typename === 'RelayError') {
                return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
            }
        },
        onError,
        update: updateCache
    });

    const [createFollowProxyAction, { loading: proxyActionLoading }] = useProxyActionMutation({
        onCompleted,
        onError,
        update: updateCache
    });

    const createViaProxyAction = async (variables: any) => {
        const { data } = await createFollowProxyAction({
            variables
        });
        if (!data?.proxyAction) {
            await createFollowTypedData({
                variables: {
                request: { follow: [{ profile: profile?.id }] },
                options: { overrideSigNonce: userSigNonce }
                }
            });
        }
    };

    const createFollow = async () => {
        if (!currentProfile) {
            return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }

        try {
            if (profile?.followModule) {
                await createFollowTypedData({
                    variables: {
                        options: { overrideSigNonce: userSigNonce },
                        request: {
                            follow: [
                                {
                                profile: profile?.id,
                                followModule:
                                    profile?.followModule?.__typename === 'ProfileFollowModuleSettings'
                                    ? { profileFollowModule: { profileId: currentProfile?.id } }
                                    : null
                                }
                            ]
                        }
                    }
                });
            } else {
                await createViaProxyAction({
                    request: {
                        follow: {
                            freeFollow: {
                                profileId: profile?.id
                            }
                        }
                    }
                });
            }
        } catch {}
    };

    const isLoading = typedDataLoading || proxyActionLoading || signLoading || writeLoading || broadcastLoading;

    return (
        <Button
            onClick={createFollow}
            variant={type === "primary" ? "primary" : "light"} 
            aria-label="Follow"
            loading={isLoading}
        >
            {showText && 'Follow'}
        </Button>
    );
};

export default Follow;