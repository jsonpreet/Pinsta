import useAppStore from '@lib/store'
import type { ApprovedAllowanceAmount, Erc20 } from '@utils/lens'
import {
  CollectModules,
  FollowModules,
  ReferenceModules,
  useApprovedModuleAllowanceAmountQuery,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from '@utils/lens'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from '@utils/custom-types'
import { WMATIC_TOKEN_ADDRESS } from '@utils/constants'
import { getCollectModuleConfig } from '@utils/functions/getCollectModule'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'
import { Loader } from '@components/UI/Loader'
import { Button } from '@components/UI/Button'

const collectModules = [
  'FeeCollectModule',
  'TimedFeeCollectModule',
  'FeeFollowModule',
  'LimitedFeeCollectModule',
  'LimitedTimedFeeCollectModule'
]

const ModulePermissions = () => {
    const currentProfile = useAppStore((state) => state.currentProfile)
    const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS)
    const [loadingModule, setLoadingModule] = useState('')

    const { data: txData, sendTransaction } = useSendTransaction({
        request: {},
        mode: 'recklesslyUnprepared',
        onError(error: CustomErrorWithData) {
        toast.error(error?.data?.message ?? error?.message)
        setLoadingModule('')
        }
    })

    const {
        data,
        refetch,
        loading: gettingSettings
    } = useApprovedModuleAllowanceAmountQuery({
        variables: {
            request: {
                currencies: [currency],
                followModules: [FollowModules.FeeFollowModule],
                collectModules: [
                CollectModules.FreeCollectModule,
                CollectModules.FeeCollectModule,
                CollectModules.LimitedFeeCollectModule,
                CollectModules.LimitedTimedFeeCollectModule,
                CollectModules.TimedFeeCollectModule,
                CollectModules.RevertCollectModule
                ],
                referenceModules: [ReferenceModules.FollowerOnlyReferenceModule]
            }
        },
        skip: !currentProfile?.id
    })
    useWaitForTransaction({
        hash: txData?.hash,
        onSuccess: () => {
            toast.success('Permission updated')
            setLoadingModule('')
            refetch()
        },
        onError(error: CustomErrorWithData) {
            toast.error(error?.data?.message ?? error?.message)
            setLoadingModule('')
        }
    })

    const [generateAllowanceQuery] = useGenerateModuleCurrencyApprovalDataLazyQuery()

    const handleClick = async (isAllow: boolean, selectedModule: string) => {
        try {
            setLoadingModule(selectedModule)
            const { data } = await generateAllowanceQuery({
                variables: {
                    request: {
                        currency,
                        value: isAllow ? Number.MAX_SAFE_INTEGER.toString() : '0',
                        [getCollectModuleConfig(selectedModule).type]: selectedModule
                    }
                }
            })
            const generated = data?.generateModuleCurrencyApprovalData
            sendTransaction?.({
                recklesslySetUnpreparedRequest: {
                    from: generated?.from,
                    to: generated?.to,
                    data: generated?.data
                }
            })
        } catch {
            setLoadingModule('')
        }
    }

    return (
        <div className="pt-6">
            <div>
                <h1 className="mb-1 text-xl font-semibold">Allow / Revoke modules</h1>
                <p className="opacity-80">In order to use collect feature you need to allow the module you use, you can allow and revoke the module anytime.</p>
            </div>
            <div>
                {!gettingSettings && data && (
                    <div className="flex w-full flex-col py-3 space-y-1">
                        <h5 className='font-semibold'>Select Currency</h5>
                        <select
                            placeholder="More about your stream"
                            autoComplete="off"
                            className="bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-300 dark:border-gray-700 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {data?.enabledModuleCurrencies?.map((currency: Erc20) => (
                                <option key={currency.address} value={currency.address}>
                                {currency.symbol}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {gettingSettings && (
                <div className="grid h-24 place-items-center">
                    <Loader />
                </div>
                )}
                {!gettingSettings &&
                data?.approvedModuleAllowanceAmount?.map(
                    (moduleItem: ApprovedAllowanceAmount) =>
                    collectModules.includes(moduleItem.module) && (
                        <div
                            key={moduleItem.contractAddress}
                            className="flex items-center pb-4 rounded-md"
                        >
                            <div className="flex-1">
                                <h6 className="text-base">Allow {moduleItem.module}</h6>
                                <p className="text-sm opacity-70">
                                {getCollectModuleConfig(moduleItem.module).description}
                                </p>
                            </div>
                            <div className="flex items-center flex-none ml-2 space-x-2">
                                {moduleItem?.allowance === '0x00' ? (
                                <Button
                                    disabled={loadingModule === moduleItem.module}
                                    loading={loadingModule === moduleItem.module}
                                    onClick={() => handleClick(true, moduleItem.module)}
                                >
                                    Allow
                                </Button>
                                ) : (
                                <Button
                                    disabled={loadingModule === moduleItem.module}
                                    onClick={() => handleClick(false, moduleItem.module)}
                                    variant="danger"
                                    loading={loadingModule === moduleItem.module}
                                >
                                    Revoke
                                </Button>
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default ModulePermissions