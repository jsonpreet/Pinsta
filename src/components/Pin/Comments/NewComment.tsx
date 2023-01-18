/* eslint-disable @next/next/no-img-element */
import { LensHubProxy } from '@utils/abis/LensHubProxy'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { utils } from 'ethers'
import type {
  CreateCommentBroadcastItemResult,
  CreatePublicCommentRequest
} from '@utils/lens'
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from '@utils/lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { CustomErrorWithData, PinstaPublication } from '@utils/custom-types'
import {
    APP,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED
} from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import getTextNftUrl from '@utils/functions/getTextNftUrl'
import getUserLocale from '@utils/functions/getUserLocale'
import omit from '@utils/functions/omit'
import trimify from '@utils/functions/trimify'
import uploadToAr from '@utils/functions/uploadToAr'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'
import InputMentions from '@components/UI/InputMentions'
import { Button } from '@components/UI/Button'
import { Analytics, TRACK } from '@utils/analytics'
import { Form, useZodForm } from '@components/UI/Form'
import clsx from 'clsx'

type Props = {
    pin: PinstaPublication
}
const formSchema = z.object({
  comment: z
    .string({ required_error: 'Enter valid comment' })
    .trim()
    .min(1, { message: 'Enter valid comment' })
    .max(5000, { message: 'Comment should not exceed 5000 characters' })
})
type FormData = z.infer<typeof formSchema>

const NewComment: FC<Props> = ({ pin }) => {
    const [loading, setLoading] = useState(false)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const queuedComments = usePersistStore((state) => state.queuedComments)
    const setQueuedComments = usePersistStore((state) => state.setQueuedComments)
    const userSigNonce = useAppStore((state) => state.userSigNonce)
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)

    const form = useZodForm({
        schema: formSchema,
        defaultValues: {
            comment: ''
        }
    });

    const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
        setQueuedComments([
            {
                comment: form.getValues('comment'),
                txnId: txn.txnId,
                txnHash: txn.txnHash,
                pubId: pin.id
            },
            ...(queuedComments || [])
        ])
        form.reset()
        setLoading(false)
    }

    const onCompleted = (data: any) => {
        if (
        data?.broadcast?.reason === 'NOT_ALLOWED' ||
        data.createCommentViaDispatcher?.reason
        ) {
            return console.log('[Error Comment Dispatcher]', data)
        }
        Analytics.track(TRACK.NEW_COMMENT)
        const txnId = data?.createCommentViaDispatcher?.txId ?? data?.broadcast?.txId
        setToQueue({ txnId })
    }

    const onError = (error: CustomErrorWithData) => {
        toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)

    console.log('error', error)
        setLoading(false)
    }

    const { signTypedDataAsync } = useSignTypedData({
        onError
    })

    const { error, write: writeComment } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'commentWithSig',
        mode: 'recklesslyUnprepared',
        // overrides: {
        //     // @ts-ignore
        //     gasLimit: 1000000
        // },
        onError,
        onSuccess: (data) => {
            if (data.hash) {
                setToQueue({ txnHash: data.hash })
            }
        }
    })

    console.log('error', error)

    const [broadcast] = useBroadcastMutation({
        onError,
        onCompleted
    })

    const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
        onError,
        onCompleted
    })

    const [createCommentTypedData] = useCreateCommentTypedDataMutation({
        onCompleted: async (data) => {
            const { typedData, id } =
                data.createCommentTypedData as CreateCommentBroadcastItemResult
            const {
                profileId,
                profileIdPointed,
                pubIdPointed,
                contentURI,
                collectModule,
                collectModuleInitData,
                referenceModule,
                referenceModuleData,
                referenceModuleInitData
            } = typedData?.value
            try {
                const signature = await signTypedDataAsync({
                    domain: omit(typedData?.domain, '__typename'),
                    types: omit(typedData?.types, '__typename'),
                    value: omit(typedData?.value, '__typename')
                })
                const { v, r, s } = utils.splitSignature(signature)
                const args = {
                    profileId,
                    profileIdPointed,
                    pubIdPointed,
                    contentURI,
                    collectModule,
                    collectModuleInitData,
                    referenceModule,
                    referenceModuleData,
                    referenceModuleInitData,
                    sig: { v, r, s, deadline: typedData.value.deadline }
                }
                setUserSigNonce(userSigNonce + 1)
                if (!RELAYER_ENABLED) {
                    return writeComment?.({ recklesslySetUnpreparedArgs: [args] })
                }
                const { data } = await broadcast({
                    variables: { request: { id, signature } }
                })
                if (data?.broadcast?.__typename === 'RelayError')
                writeComment?.({ recklesslySetUnpreparedArgs: [args] })
            } catch {
                setLoading(false)
            }
        },
        onError
    })

    const signTypedData = (request: CreatePublicCommentRequest) => {
        createCommentTypedData({
            variables: { options: { overrideSigNonce: userSigNonce }, request }
        })
    }

    const createViaDispatcher = async (request: CreatePublicCommentRequest) => {
        const { data } = await createCommentViaDispatcher({
            variables: { request }
        })
        if (data?.createCommentViaDispatcher.__typename === 'RelayError') {
            signTypedData(request)
        }
    }

    const submitComment = async (data: FormData) => {
        try {
            setLoading(true)

            const textNftImageUrl = await getTextNftUrl(
                trimify(data.comment),
                currentProfile?.handle,
                new Date().toLocaleString()
            )

            const { url } = await uploadToAr({
                version: '2.0.0',
                metadata_id: uuidv4(),
                description: trimify(data.comment),
                content: trimify(data.comment),
                locale: getUserLocale(),
                mainContentFocus: PublicationMainFocus.TextOnly,
                external_url: `${APP.URL}/pin/${pin?.id}`,
                image: textNftImageUrl,
                imageMimeType: 'image/svg+xml',
                name: `${currentProfile?.handle}'s comment on pin ${pin.metadata.name}`,
                attributes: [
                    {
                        displayType: PublicationMetadataDisplayTypes.String,
                        traitType: 'publication',
                        value: 'comment'
                    },
                    {
                        displayType: PublicationMetadataDisplayTypes.String,
                        traitType: 'app',
                        value: APP.ID
                    }
                ],
                media: [],
                appId: APP.ID
            })
            const request = {
                profileId: currentProfile?.id,
                publicationId: pin?.id,
                contentURI: url,
                collectModule: {
                    freeCollectModule: {
                        followerOnly: false
                    }
                },
                referenceModule: {
                    followerOnlyReferenceModule: false
                }
            }
            const canUseDispatcher = currentProfile?.dispatcher?.canUseRelay
            if (!canUseDispatcher) {
                return signTypedData(request)
            }
            await createViaDispatcher(request)
        } catch (error) {
            console.log('[Error Store & Post Comment]', error)
        }
    }

    if (!currentProfile || !currentProfileId) return null

    return (
        <div className="my-1">
            <Form
                form={form}
                onSubmit={submitComment}
            >
                <div 
                className="flex items-start mb-2 space-x-1 md:space-x-3" >
                    <div className="flex-none">
                        <img
                            src={getProfilePicture(currentProfile, 'avatar')}
                            className="w-8 h-8 md:w-9 md:h-9 rounded-full"
                            draggable={false}
                            alt={currentProfile?.handle}
                        />
                    </div>
                    <InputMentions
                        placeholder="How's this pin?"
                        autoComplete="off"
                        value={form.watch('comment')}
                        onContentChange={(value) => {
                            form.setValue('comment', value)
                            form.clearErrors('comment')
                        }}
                        mentionsSelector="input-mentions-single comment-input"
                    />
                </div>    
                <div
                    className={clsx(
                        'flex justify-end items-center w-full',
                        { 'hidden': !form.watch('comment')}
                    )}
                >
                    <Button
                        disabled={loading}
                        loading={loading}
                        size='sm'
                    >
                        Comment
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default NewComment