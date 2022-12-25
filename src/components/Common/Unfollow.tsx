import { Button } from '@components/UI/Button';
import getSignature from '@utils/functions/getSignature';
import onError from '@utils/functions/onError';
import splitSignature from '@utils/functions/splitSignature';
import { FollowNFT } from '@utils/abis';
import { SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants';
import type { Signer } from 'ethers';
import { Contract } from 'ethers';
import type { CreateBurnEip712TypedData, Profile } from '@utils/lens';
import { useBroadcastMutation, useCreateUnfollowTypedDataMutation } from '@utils/lens';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSigner, useSignTypedData } from 'wagmi';
import useAppStore from '@lib/store';
import { Loader } from '../UI/Loader';
import { HiOutlineUserRemove } from 'react-icons/hi';

interface Props {
    profile: Profile;
    setFollowing: Dispatch<boolean>;
    showText?: boolean;
}

const Unfollow: FC<Props> = ({ profile, showText = false, setFollowing }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [writeLoading, setWriteLoading] = useState(false);
    const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
    const { data: signer } = useSigner();

    const burnWithSig = async (signature: string, typedData: CreateBurnEip712TypedData) => {
        const { tokenId, deadline } = typedData.value;
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };

        const followNftContract = new Contract(typedData.domain.verifyingContract, FollowNFT, signer as Signer);

        const tx = await followNftContract.burnWithSig(tokenId, sig);
        if (tx) {
            setFollowing(false);
        }
    };

    const [broadcast] = useBroadcastMutation({
        onCompleted: () => {
            setFollowing(false);
        }
    });

    const [createUnfollowTypedData, { loading: typedDataLoading }] = useCreateUnfollowTypedDataMutation({
        onCompleted: async ({ createUnfollowTypedData }) => {
            const { typedData, id } = createUnfollowTypedData;
            const signature = await signTypedDataAsync(getSignature(typedData));

            setWriteLoading(true);
            try {
                const { data } = await broadcast({ variables: { request: { id, signature } } });
                if (data?.broadcast.__typename === 'RelayError') {
                    await burnWithSig(signature, typedData);
                }
                toast.success('Unfollowed successfully!');
            } catch {
                toast.error('User rejected request');
            } finally {
                setWriteLoading(false);
            }
        },
        onError
    });

    const createUnfollow = async () => {
        if (!currentProfile) {
            return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }

        try {
            await createUnfollowTypedData({ variables: { request: { profile: profile?.id } } });
        } catch {}
    };

    return (
        <Button
            onClick={createUnfollow}
            loading={typedDataLoading || signLoading || writeLoading}
            variant="light"
            aria-label="Unfollow"
        >
            {showText && 'Unfollow'}
        </Button>
    );
};

export default Unfollow;