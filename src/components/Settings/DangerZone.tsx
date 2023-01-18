/* eslint-disable @next/next/no-img-element */
import { LensHubProxy } from '@utils/abis/LensHubProxy'
import useAppStore from '@lib/store'
import { utils } from 'ethers'
import type { CreateBurnProfileBroadcastItemResult } from '@utils/lens'
import { useCreateBurnProfileTypedDataMutation } from '@utils/lens'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Custom404 from 'src/pages/404'
import { APP, LENSHUB_PROXY_ADDRESS } from '@utils/constants'
import type { CustomErrorWithData } from '@utils/custom-types'
import clearLocalStorage from '@utils/functions/clearLocalStorage'
import { formatNumber } from '@utils/functions/formatNumber'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omit from '@utils/functions/omit'
import {
  useContractWrite,
  useSignTypedData,
  useWaitForTransaction
} from 'wagmi'
import IsVerified from '@components/UI/IsVerified'
import { Button } from '@components/UI/Button'
import { BsFillExclamationTriangleFill, BsTrash } from 'react-icons/bs'
import Modal from '@components/UI/Modal'
import { WarningMessage } from '@components/UI/WarningMessage'

const DangerZone = () => {
    const currentProfile = useAppStore((state) => state.currentProfile)
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [txnHash, setTxnHash] = useState<`0x${string}`>()
    const { signTypedDataAsync } = useSignTypedData({
        onError(error) {
        toast.error(error?.message)
        }
    })

    const onError = (error: CustomErrorWithData) => {
        setLoading(false)
        toast.error(error?.data?.message ?? error?.message)
    }

    const { write: writeDeleteProfile } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'burnWithSig',
        mode: 'recklesslyUnprepared',
        onError,
        onSuccess: (data) => setTxnHash(data.hash)
    })

    useWaitForTransaction({
        enabled: txnHash && txnHash.length > 0,
        hash: txnHash,
        onSuccess: () => {
            toast.success('Channel deleted')
            setLoading(false)
            clearLocalStorage()
            location.href = '/'
        },
        onError
    })

    const [createBurnProfileTypedData] = useCreateBurnProfileTypedDataMutation({
        onCompleted: async (data) => {
            const { typedData } =
                data.createBurnProfileTypedData as CreateBurnProfileBroadcastItemResult
            try {
                const signature = await signTypedDataAsync({
                domain: omit(typedData?.domain, '__typename'),
                types: omit(typedData?.types, '__typename'),
                value: omit(typedData?.value, '__typename')
                })
                const { tokenId } = typedData?.value
                const { v, r, s } = utils.splitSignature(signature)
                const sig = { v, r, s, deadline: typedData.value.deadline }
                writeDeleteProfile?.({ recklesslySetUnpreparedArgs: [tokenId, sig] })
            } catch {
                setLoading(false)
            }
        },
        onError
    })

    const onClickDelete = () => {
        setLoading(true)
        createBurnProfileTypedData({
            variables: {
                request: { profileId: currentProfile?.id }
            }
        })
    }

    if (!currentProfile) return <Custom404 />

    return (
        <div className="p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg dark:divide-gray-900 dark:bg-theme">
            {/* <div className="flex flex-wrap items-center mb-5">
                <div className="flex items-center">
                    <div className="flex-none mr-3 mt-0.5">
                        <img
                            src={getProfilePicture(currentProfile, 'avatar')}
                            className="rounded-full w-9 h-9"
                            draggable={false}
                            alt={currentProfile?.handle}
                        />
                    </div>
                    <div className="flex flex-col">
                        {currentProfile.name && (
                            <h6 className="font-medium">{currentProfile.name}</h6>
                        )}
                        <span className="flex items-center space-x-1">
                            <span className="text-sm">{currentProfile?.handle}</span>
                            <IsVerified id={currentProfile?.id} size="xs" />
                        </span>
                    </div>
                </div>
            </div> */}
            <div className="flex flex-col space-y-5">
                <div className="text-lg font-bold text-red-500">
                    <p>This will deactivate your account</p>
                </div>
                <p>
                    Deleting your account is permanent. All your data will be wiped out immediately and you won&apos;t be
                    able to get it back.
                </p>
                <div className="text-lg font-bold">What else you should know</div>
                <div className="text-sm lt-text-gray-500 divide-y dark:divide-gray-700">
                    <p className="pb-3">You cannot restore your {APP.Name} account if it was accidentally or wrongfully deleted.</p>
                    <p className="py-3">Some account information may still be available in search engines, such as Google or Bing.</p>
                    <p className="py-3">Your @handle will be released immediately after deleting the account.</p>
                </div>
                <div>
                    <Button
                        disabled={loading}
                        loading={loading}
                        onClick={() => setShowWarningModal(true)}
                        variant="danger"
                        icon={<BsTrash size={19}/>}
                    >
                        Delete your account
                    </Button>
                </div>
                <Modal
                    title='Danger Zone'
                    icon={<BsFillExclamationTriangleFill className="w-5 h-5 text-red-500" />}
                    show={showWarningModal}
                    onClose={() => setShowWarningModal(false)}
                >
                    <div className="p-5 space-y-3">
                        <WarningMessage
                            title="Are you sure?"
                            message={
                            <div className="leading-6">
                                Confirm that you have read all consequences and want to delete your account anyway
                            </div>
                            }
                        />
                        <Button
                            variant="danger"
                            icon={<BsTrash className="w-5 h-5" />}
                            onClick={() => {
                                setShowWarningModal(false);
                                onClickDelete();
                            }}
                        >
                            Yes, delete my account
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default DangerZone