/* eslint-disable @next/next/no-img-element */
import { LensHubProxy } from '@utils/abis/LensHubProxy'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import { utils } from 'ethers'
import type {
  CreateSetProfileImageUriBroadcastItemResult,
  Profile,
  UpdateProfileImageRequest
} from '@utils/lens'
import {
  useBroadcastMutation,
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation
} from '@utils/lens'
import type { ChangeEvent, FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { RiImageAddLine } from 'react-icons/ri'
import type { CustomErrorWithData, IPFSUploadResult } from '@utils/custom-types'
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, RELAYER_ENABLED } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omit from '@utils/functions/omit'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import uploadToIPFS from '@utils/functions/uploadToIPFS'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { Loader } from '@components/UI/Loader'

type Props = {
  profile: Profile
}

const ProfilePicture: FC<Props> = ({ profile }) => {
    const [selectedPfp, setSelectedPfp] = useState('')
    const [loading, setLoading] = useState(false)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
    const userSigNonce = useAppStore((state) => state.userSigNonce)
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)

    const onError = (error: CustomErrorWithData) => {
        toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
        setLoading(false)
        setSelectedPfp(getProfilePicture(profile, 'avatar_lg'))
    }

    const onCompleted = () => {
        setLoading(false)
        if (currentProfile && selectedPfp)
        setCurrentProfile({
            ...currentProfile,
            picture: { original: { url: selectedPfp } }
        })

        toast.success('Profile image updated')
    }

    const { signTypedDataAsync } = useSignTypedData({
        onError
    })

    const { data: pfpData, write: writePfpUri } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'setProfileImageURIWithSig',
        mode: 'recklesslyUnprepared',
        onError,
        onSuccess: onCompleted
    })

    const [createSetProfileImageViaDispatcher] =
        useCreateSetProfileImageUriViaDispatcherMutation({
            onError,
            onCompleted
        })

    const [broadcast] = useBroadcastMutation({
        onError,
        onCompleted
    })

    const [createSetProfileImageURITypedData] =
        useCreateSetProfileImageUriTypedDataMutation({
            onCompleted: async (data) => {
                const { typedData, id } = data.createSetProfileImageURITypedData as CreateSetProfileImageUriBroadcastItemResult
                try {
                    const signature = await signTypedDataAsync({
                        domain: omit(typedData?.domain, '__typename'),
                        types: omit(typedData?.types, '__typename'),
                        value: omit(typedData?.value, '__typename')
                    })
                    const { profileId, imageURI } = typedData?.value
                    const { v, r, s } = utils.splitSignature(signature)
                    const args = {
                        profileId,
                        imageURI,
                        sig: { v, r, s, deadline: typedData.value.deadline }
                    }
                    setUserSigNonce(userSigNonce + 1)
                    if (!RELAYER_ENABLED) {
                        return writePfpUri?.({ recklesslySetUnpreparedArgs: [args] })
                    }
                    const { data } = await broadcast({
                        variables: { request: { id, signature } }
                    })
                    if (data?.broadcast?.__typename === 'RelayError')
                        writePfpUri?.({ recklesslySetUnpreparedArgs: [args] })
                } catch {
                    setLoading(false)
                }
            },
            onError
        })

    const signTypedData = (request: UpdateProfileImageRequest) => {
        createSetProfileImageURITypedData({
            variables: { options: { overrideSigNonce: userSigNonce }, request }
        })
    }

    const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
        const { data } = await createSetProfileImageViaDispatcher({
            variables: { request }
        })
        if (
            data?.createSetProfileImageURIViaDispatcher.__typename === 'RelayError'
        ) {
            signTypedData(request)
        }
    }

    const onPfpUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            try {
                setLoading(true)
                const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0])
                const request = {
                    profileId: currentProfile?.id,
                    url: result.url
                }
                setSelectedPfp(result.url)
                const canUseDispatcher = currentProfile?.dispatcher?.canUseRelay
                if (!canUseDispatcher) {
                    return signTypedData(request)
                }
                await createViaDispatcher(request)
            } catch (error) {
                onError(error as CustomErrorWithData)
            }
        }
    }

    return (
        <div className="relative flex-none overflow-hidden rounded-full group">
            <img
                src={
                selectedPfp
                    ? sanitizeIpfsUrl(selectedPfp)
                    : getProfilePicture(profile, 'avatar_lg')
                }
                className="object-cover w-32 h-32 border-2 rounded-full"
                draggable={false}
                alt={selectedPfp ? currentProfile?.handle : profile?.handle}
            />
            <label
                htmlFor="choosePfp"
                className={clsx(
                'absolute top-0 grid w-32 h-32 bg-white rounded-full cursor-pointer bg-opacity-70 place-items-center backdrop-blur-lg invisible group-hover:visible dark:bg-theme',
                { '!visible': loading && !pfpData?.hash }
                )}
            >
                {loading && !pfpData?.hash ? (
                <Loader />
                ) : (
                    <RiImageAddLine className="text-xl" />
                )}
                <input
                    id="choosePfp"
                    type="file"
                    accept=".png, .jpg, .jpeg, .svg, .gif"
                    className="hidden w-full"
                    onChange={onPfpUpload}
                />
            </label>
        </div>
    )
}

export default ProfilePicture