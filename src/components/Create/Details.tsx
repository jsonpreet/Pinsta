/* eslint-disable @next/next/no-img-element */
import { FC, useState }  from 'react'
import imageCdn from '@utils/functions/imageCdn'
import getProfilePicture from '@utils/functions/getProfilePicture'
import formatHandle from '@utils/functions/formatHandle'
import IsVerified from '@components/UI/IsVerified'
import Category from './Category'
import useAppStore from '@lib/store'
import ProfileBoards from './ProfileBoards'
import { Button } from '@components/UI/Button'
import { toast } from 'react-hot-toast'
import { APP, ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import { MetadataAttributeInput, PublicationMainFocus, PublicationMetadataDisplayTypes, PublicationMetadataV2Input, useBroadcastMutation, useCreatePostTypedDataMutation, useCreatePostViaDispatcherMutation } from '@utils/lens/generated'
import splitSignature from '@utils/functions/splitSignature'
import getSignature from '@utils/functions/getSignature'
import { LensHubProxy } from '@utils/abis'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { Analytics, TRACK } from '@utils/analytics'
import { v4 as uuid } from 'uuid';
import { useCollectModuleStore } from '@lib/store/collect-module'
import usePersistStore from '@lib/store/persist'
import { CustomErrorWithData, IPFSUploadResult, PinstaAttachment } from '@utils/custom-types'
import getUserLocale from '@utils/functions/getUserLocale'
import getTags from '@utils/functions/getTags'
import uploadToAr from '@utils/functions/uploadToAr'
import uploadToIPFS from '@utils/functions/uploadToIPFS'
import { useRouter } from 'next/router'
import InputMentions from '@components/UI/InputMentions'

const Details: FC = () => {
    const router = useRouter()
    const userSigNonce = useAppStore((state) => state.userSigNonce);
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
    const setCreatePin = useAppStore((state) => state.setCreatePin)
    const createdPin = useAppStore((state) => state.createdPin)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const queuedPublications = usePersistStore((state) => state.queuedPublications)
    const setQueuedPublications = usePersistStore((state) => state.setQueuedPublications)

    // Collect module store
    const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
    const payload = useCollectModuleStore((state) => state.payload);
    const resetCollectSettings = useCollectModuleStore((state) => state.reset);

    const [publicationContentError, setPublicationContentError] = useState('');
    const [loading, setLoading] = useState(false)
    const [showOnFocus, setShowOnFocus] = useState(false)

    const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
        setQueuedPublications([
            {
                publication: createdPin,
                txnId: txn.txnId,
                txnHash: txn.txnHash
            },
            ...(queuedPublications || [])
        ])
        setLoading(false)
    }

    const onCompleted = () => {
        resetCollectSettings();
        toast.success('Pin created successfully');
        setTimeout(() => {
            router.push(`/${formatHandle(currentProfile?.handle)}`)
        }, 1000);
        
        // Track in simple analytics
        Analytics.track(TRACK.POST.NEW);
    };

    const onError = (error: CustomErrorWithData) => {
        toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
        setLoading(false)
    }

    const { signTypedDataAsync, isLoading: typedDataLoading } = useSignTypedData({ onError });

    const { error, write } = useContractWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LensHubProxy,
        functionName: 'postWithSig',
        mode: 'recklesslyUnprepared',
        onSuccess: ({ hash }) => {
        onCompleted();
            setToQueue({ txnHash: hash });
        },
        onError
    });

    const [broadcast] = useBroadcastMutation({
        onCompleted: (data) => {
            onCompleted();
            if (data.broadcast.__typename === 'RelayerResult') {
                const txnId = data?.broadcast?.txId
                setToQueue({ txnId: txnId });
            }
        }
    });

    const typedDataGenerator = async (generatedData: any) => {
        const { id, typedData } = generatedData;
        const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
        deadline
        } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
            profileId,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
            sig
        };
        setUserSigNonce(userSigNonce + 1);
        const { data } = await broadcast({ variables: { request: { id, signature } } });
        if (data?.broadcast.__typename === 'RelayError') {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
    };

    const [createPostTypedData] = useCreatePostTypedDataMutation({
        onCompleted: async ({ createPostTypedData }) => await typedDataGenerator(createPostTypedData),
        onError
    });

    const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
        onCompleted: (data) => {
            onCompleted();
            if (data.createPostViaDispatcher.__typename === 'RelayerResult') {
                setToQueue({ txnId: data.createPostViaDispatcher.txId });

            }
        },
        onError
    });

    const createViaDispatcher = async (request: any) => {
        const variables = {
            options: { overrideSigNonce: userSigNonce },
            request
        };

        const { data } = await createPostViaDispatcher({ variables: { request } });
        if (data?.createPostViaDispatcher?.__typename === 'RelayError') {
            return await createPostTypedData({ variables });
        }

        return;
    };

    const getMainContentFocus = () => {
        return PublicationMainFocus.Image
    };

    const createMetadata = async (metadata: PublicationMetadataV2Input) => {
        return await uploadToAr(metadata);
    };

    const createPublication = async () => {
        if (!currentProfile) {
            return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }

        try {
            setLoading(true);

            setPublicationContentError('');
            let textNftImageUrl = null;
            // @ts-ignore
            const image: IPFSUploadResult = await uploadToIPFS(createdPin?.file)

            if (!image.url) {
                return toast.error(ERROR_MESSAGE);
            }
            setCreatePin({ ...createdPin, imageSource: image.url, imageType: image.type })
            const attributes: MetadataAttributeInput[] = [
                {
                    traitType: 'type',
                    displayType: PublicationMetadataDisplayTypes.String,
                    value: getMainContentFocus()?.toLowerCase()
                },
                {
                    displayType: PublicationMetadataDisplayTypes.String,
                    traitType: 'app',
                    value: APP.ID
                }
            ];
            const attachmentsInput: PinstaAttachment[] = [{
                type: image?.type,
                altTag: createdPin?.imageAltTag,
                item: image?.url
            }];

            const metadata: PublicationMetadataV2Input = {
                version: '2.0.0',
                metadata_id: uuid(),
                content: createdPin?.description,
                external_url: `${APP.URL}/${currentProfile?.handle}`,
                image: image?.url ?? textNftImageUrl,
                imageMimeType: image?.type ?? 'image/svg+xml',
                name: createdPin?.title ? createdPin?.title : `Post by @${currentProfile?.handle}`,
                tags: [createdPin?.category.tag, ...getTags(createdPin?.description)],
                animation_url: null,
                mainContentFocus: getMainContentFocus(),
                contentWarning: null,
                attributes,
                media: attachmentsInput,
                locale: getUserLocale(),
                appId: APP.ID
            };

            let { url } = await createMetadata(metadata);

            const request = {
                profileId: currentProfile?.id,
                contentURI: url ?? null,
                collectModule: payload,
                referenceModule: {
                    followerOnlyReferenceModule: false
                }
            };

            if (currentProfile?.dispatcher?.canUseRelay) {
                return await createViaDispatcher(request);
            }

            return await createPostTypedData({
                // @ts-ignore
                variables: { options: { overrideSigNonce: userSigNonce }, request }
            });
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const isLoading = loading || typedDataLoading;

    return (
        <>
            <div className='flex space-x-2 justify-between items-center relative'>
                <div className='flex space-x-2 items-center relative'>
                    {currentProfile &&
                        <div>
                            <img 
                                src={imageCdn(getProfilePicture(currentProfile), 'avatar')}
                                className='w-9 h-9 rounded-full'
                                alt={formatHandle(currentProfile?.handle)}
                            />
                        </div>
                    }
                    <div className='flex items-center'>
                        <div className='text-base capitalize font-semibold'>
                            {currentProfile?.name || formatHandle(currentProfile?.handle)}
                        </div>
                        <IsVerified id={currentProfile?.id} size='sm' />
                    </div>
                </div>
                <ProfileBoards/>
            </div>
            <div className='relative'>
                <InputMentions 
                    placeholder="Title"
                    autoComplete="off"
                    value={createdPin.title}
                    onContentChange={(value) => {
                        setCreatePin({ ...createdPin, title: value})
                    }}
                    mentionsSelector="input-mentions-single comment-input !text-2xl font-bold text-black"
                />
                <div className='text-xs text-gray-400 text-right pt-1'>
                    {createdPin.title.length}/100
                </div>
            </div>
            <div className='relative'>
                <InputMentions 
                    placeholder="Tell everyone about your Pin"
                    autoComplete="off"
                    value={createdPin.description}
                    onContentChange={(value) => {
                        setCreatePin({ ...createdPin, description: value})
                    }}
                    mentionsSelector="input-mentions-single comment-input !h-20 text-black"
                />
                <div className='text-xs text-gray-400 text-right pt-1'>
                    {createdPin.description.length}/500
                </div>
            </div>
            <div className='relative'>
                <Category/>
            </div>
            <div className='flex justify-end'>
                <Button
                    variant='primary'
                    size='md'
                    loading={isLoading}
                    onClick={createPublication}
                    disabled={createdPin.title.length < 1 || createdPin.description.length < 1 || isLoading}
                >
                    Create Pin
                </Button>
            </div>
            {publicationContentError && (
                <div className="px-5 pb-3 mt-1 text-sm font-bold text-red-500">{publicationContentError}</div>
            )}
        </>
    )
}

export default Details