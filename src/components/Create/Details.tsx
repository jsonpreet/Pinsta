/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState }  from 'react'
import imageCdn from '@utils/functions/imageCdn'
import getProfilePicture from '@utils/functions/getProfilePicture'
import formatHandle from '@utils/functions/formatHandle'
import IsVerified from '@components/UI/IsVerified'
import Category from './Category'
import useAppStore from '@lib/store'
import ProfileBoards from './Actions/Boards'
import { Button } from '@components/UI/Button'
import { toast } from 'react-hot-toast'
import { ALLOWED_VIDEO_TYPES, APP, AVATAR, ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, PINSTA_SERVER_URL, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import { MetadataAttributeInput, PublicationMainFocus, PublicationMetadataDisplayTypes, PublicationMetadataMediaInput, PublicationMetadataV2Input, useBroadcastMutation, useCreatePostTypedDataMutation, useCreatePostViaDispatcherMutation } from '@utils/lens/generated'
import splitSignature from '@utils/functions/splitSignature'
import getSignature from '@utils/functions/getSignature'
import { LensHubProxy } from '@utils/abis'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { Analytics, TRACK } from '@utils/analytics'
import { v4 as uuid } from 'uuid';
import { useCollectModuleStore } from '@lib/store/collect-module'
import usePersistStore from '@lib/store/persist'
import { CustomErrorWithData, PinstaAttachment } from '@utils/custom-types'
import getUserLocale from '@utils/functions/getUserLocale'
import getTags from '@utils/functions/getTags'
import uploadToAr from '@utils/functions/uploadToAr'
import { useRouter } from 'next/router'
import InputMentions from '@components/UI/InputMentions'
import CollectSettings from './Actions/Collect'
import { usePublicationStore } from '@lib/store/publication'
import { BsEmojiFrown, BsEmojiSmile, BsFillEmojiSmileFill } from 'react-icons/bs'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import useOutsideClick from '@hooks/useOutsideClick'

const Details: FC<any> = () => {
    const router = useRouter()
    const userSigNonce = useAppStore((state) => state.userSigNonce);
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
    const setCreatePin = usePublicationStore((state) => state.setCreatePin)
    const createPin = usePublicationStore((state) => state.createPin)
    const isUploading = usePublicationStore((state) => state.isUploading)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const queuedPublications = usePersistStore((state) => state.queuedPublications)
    const attachments = usePublicationStore((state) => state.attachments)
    const setQueuedPublications = usePersistStore((state) => state.setQueuedPublications)

    // Collect module store
    const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
    const payload = useCollectModuleStore((state) => state.payload);
    const resetCollectSettings = useCollectModuleStore((state) => state.reset);

    const [publicationContentError, setPublicationContentError] = useState('');
    const [loading, setLoading] = useState(false)
    const [showOnFocus, setShowOnFocus] = useState(false)

    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [postEmoji, setEmoji] = useState<any>(null)
    const emojiRef = useRef(null)
    useOutsideClick(emojiRef, () => setShowEmojiPicker(false))
    
    useEffect(() => {
        if (postEmoji && postEmoji.emoji.trim().length > 0) {
            setCreatePin({ description: createPin.description + postEmoji.emoji })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postEmoji])

    const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
        setQueuedPublications([
            {
                publication: createPin,
                previews: attachments,
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

    const getAnimationUrl = () => {
        if (attachments.length > 0 && ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type)){
            return attachments[0]?.item;
        }

        return null;
    }

    const getAttachmentImage = () => {
        return attachments[0]?.item;
    };

    const getAttachmentImageMimeType = () => {
        return attachments[0]?.type;
    };

    const getMainContentFocus = () => {
        if (attachments.length > 0) {
            if (ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type)) {
                return PublicationMainFocus.Video;
            } else {
                return PublicationMainFocus.Image;
            }
        } else {
            return PublicationMainFocus.Image
        }
        
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
            
            const attributes: MetadataAttributeInput[] = [
                {
                    traitType: 'type',
                    displayType: PublicationMetadataDisplayTypes.String,
                    value: getMainContentFocus()?.toLowerCase()
                },
                {
                    traitType: 'title',
                    displayType: PublicationMetadataDisplayTypes.String,
                    value: createPin?.title ? createPin?.title : ''
                },
                {
                    displayType: PublicationMetadataDisplayTypes.String,
                    traitType: 'handle',
                    value: `${currentProfile?.handle}`
                },
                {
                    displayType: PublicationMetadataDisplayTypes.String,
                    traitType: 'app',
                    value: APP.ID
                }
            ];

            const media: Array<PublicationMetadataMediaInput> = [
                {
                    item: attachments[0].item,
                    type: attachments[0].type,
                    cover: createPin.videoThumbnail
                }
            ]

            if (createPin.durationInSeconds) {
                attributes.push({
                    displayType: PublicationMetadataDisplayTypes.String,
                    traitType: 'durationInSeconds',
                    value: createPin.durationInSeconds.toString()
                })
            }

            const attachmentsInput: PinstaAttachment[] = attachments.map((attachment) => ({
                type: attachment.type,
                altTag: attachment.altTag,
                item: attachment.item!
            }));

            const metadata: PublicationMetadataV2Input = {
                version: '2.0.0',
                metadata_id: uuid(),
                content: createPin?.description,
                external_url: `${APP.URL}/${currentProfile?.handle}`,
                image: createPin?.isVideoPublication ? createPin.videoThumbnail : attachmentsInput.length > 0 ? getAttachmentImage() : textNftImageUrl,
                imageMimeType: createPin?.isVideoPublication ? createPin.thumbnailType : attachmentsInput.length > 0 ? getAttachmentImageMimeType() : 'image/svg+xml',
                name: createPin?.title ? createPin?.title : `Pin by @${currentProfile?.handle}`,
                tags: [createPin?.category.tag, ...getTags(createPin?.description)],
                animation_url: getAnimationUrl(),
                mainContentFocus: getMainContentFocus(),
                contentWarning: null,
                attributes,
                media: createPin?.isVideoPublication ? media : attachmentsInput,
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

    const isLoading = loading || typedDataLoading || isUploading;

    return (
        <>
            <div className='flex space-x-2 justify-between items-center relative'>
                <div className='flex space-x-2 items-center relative'>
                    {currentProfile &&
                        <div>
                            <img 
                                src={getProfilePicture(currentProfile,AVATAR)}
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
                    value={createPin.title}
                    onContentChange={(value) => {
                        setCreatePin({ title: value})
                    }}
                    mentionsSelector="input-mentions-single comment-input !text-2xl font-bold text-black dark:text-white"
                />
                <div className='text-xs text-gray-400 text-right pt-1'>
                    {createPin.title.length}/100
                </div>
            </div>
            <div className='relative'>
                <InputMentions 
                    placeholder="Tell everyone about your Pin"
                    autoComplete="off"
                    value={createPin.description}
                    onContentChange={(value) => {
                        setCreatePin({ description: value})
                    }}
                    mentionsSelector="input-mentions-single comment-input !h-20 text-black dark:text-white"
                />
                <div className='text-xs text-gray-400 text-right pt-1'>
                    {createPin.description.length}/500
                </div>
                <div
                    className='mt-2 cursor-pointer inline-flex'
                    onClick={() => setShowEmojiPicker(showEmojiPicker ? false : true)}
                >
                    {showEmojiPicker ? <BsFillEmojiSmileFill className='text-brand-500' size={19}/> : <BsEmojiSmile size={19}/>}
                    {showEmojiPicker && (
                        <div className='absolute top-10 right-0 z-20' ref={emojiRef}>
                            <EmojiPicker
                                emojiStyle={EmojiStyle.TWITTER}
                                onEmojiClick={setEmoji}
                                lazyLoadEmojis={true}
                                previewConfig={{
                                    showPreview: false
                                }}
                            />
                        </div>   
                    )}
                </div>
            </div>
            <div className='relative'>
                <Category/>
            </div>
            <div className='relative'>
                <CollectSettings/>
            </div>
            <div className='flex justify-end'>
                <Button
                    variant='primary'
                    size='md'
                    loading={isLoading}
                    onClick={createPublication}
                    disabled={createPin.title.length < 1 || createPin.description.length < 1 || isLoading}
                >
                    {createPin?.buttonText || 'Create Pin'}
                </Button>
            </div>
            {publicationContentError && (
                <div className="px-5 pb-3 mt-1 text-sm font-bold text-red-500">{publicationContentError}</div>
            )}
        </>
    )
}

export default Details