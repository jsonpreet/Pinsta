/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FC, useState } from 'react'
import { motion } from "framer-motion"
import formatHandle from '@utils/functions/formatHandle'
import { Analytics } from '@utils/analytics'
import usePersistStore from '@lib/store/persist'
import useAppStore from '@lib/store'
import { useApolloClient } from '@apollo/client'
import { PublicationDocument, PublicationMetadataStatusType, useHasTxHashBeenIndexedQuery, usePublicationLazyQuery } from '@utils/lens/generated'
import { PINSTA_SERVER_URL } from '@utils/constants'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { v4 as uuid } from 'uuid';
import { UPLOADED_FORM_DEFAULTS, usePublicationStore } from '@lib/store/publication'

dayjs.extend(relativeTime)

type Props = {
  pin: any
}

const QueuedPinCard: FC<Props> = ({ pin }) => {
    const thumbnailUrl = pin?.previews ? pin?.previews[0].previewItem : null
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const createPin = usePublicationStore((state) => state.createPin)
    const setCreatedPin = usePublicationStore((state) => state.setCreatePin)
    const queuedPublications = usePersistStore((state) => state.queuedPublications)
    const setQueuedPublications = usePersistStore((state) => state.setQueuedPublications)
    const removeAttachments = usePublicationStore((state) => state.removeAttachments)
    const setAttachments = usePublicationStore((state) => state.setAttachments)

    const { cache } = useApolloClient();
    const txHash = pin?.txnHash;
    const txId = pin?.txnId;

    const removeTxn = () => {
        if (txHash) {
            setQueuedPublications(queuedPublications.filter((o) => o.txnHash !== txHash));
        } else {
            setQueuedPublications(queuedPublications.filter((o) => o.txnId !== txId));
        }
    };

    const [getPublication] = usePublicationLazyQuery({
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            if (data?.publication) {
                console.log(data);
                cache.modify({
                    fields: {
                        publications() {
                            cache.writeQuery({ data: data?.publication as any, query: PublicationDocument });
                        }
                    }
                });
                savePinToBoard(data?.publication);
                removeTxn();
            }
        }
    });

    const savePinToBoard = async (pin?: any) => {
        const board = createPin?.board;
        setLoading(true)
        const request = {
            board_id: board ? `${board.id}` : 0,
            user_id: currentProfileId,
            post_id: pin.id
        }
        return await axios.post(`${PINSTA_SERVER_URL}/save-pin`, request).then((res) => {
        if (res.status === 200) {
            setLoading(false)
            setCreatedPin(UPLOADED_FORM_DEFAULTS)
            Analytics.track('Pin Saved', {
                board: board?.name ?? 'Profile',
                pin: pin.id
            })
        } else {
                setCreatedPin(UPLOADED_FORM_DEFAULTS)
                console.log('Error creating board', res)
                setLoading(false)
                Analytics.track('Error Pin Saved', {
                    board: board?.name ?? 'Profile',
                    pin: pin.id
                })
                toast.error('Error on saving pin!')
            }
        }).catch((err) => {
            setCreatedPin(UPLOADED_FORM_DEFAULTS)
            console.log('Error creating board', err)
            setLoading(false)
            Analytics.track('Error Pin Saved', {
                board: board?.name ?? 'Profile',
                pin: pin.id
            })
            toast.error('Error on saving pin!')
        })
    }

    useHasTxHashBeenIndexedQuery({
        fetchPolicy: 'no-cache',
        variables: { request: { txHash, txId } },
        pollInterval: 1000,
        onCompleted: (data) => {
            if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
                return removeTxn();
            }

            if (data.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult') {
                const status = data.hasTxHashBeenIndexed.metadataStatus?.status;

                if (
                status === PublicationMetadataStatusType.MetadataValidationFailed ||
                status === PublicationMetadataStatusType.NotFound
                ) {
                    return removeTxn();
                }

                if (data.hasTxHashBeenIndexed.indexed) {
                    removeAttachments([])
                    setAttachments([])
                    getPublication({
                        variables: {
                            request: { txHash: data.hasTxHashBeenIndexed.txHash },
                            reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
                            profileId: currentProfile?.id ?? null
                        }
                    });
                }
            }
        }
    });
    const splicedMedia = pin?.previews?.length > 4 ? pin?.previews?.slice(0, 5) : pin?.previews
    
    return (
        <motion.div
            className="group"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring", stiffness: 200, damping: 24
            }}
        >
        
            <div className="overflow-hidden group relative flex flex-col items-center">
                <div 
                    onClick={() => {
                        Analytics.track('clicked_from_pin_card_pin_link', {
                            pin_id: pin.id
                        })
                    }}
                    className='cursor-zoom group w-full flex z-0 bg-gray-100 dark:bg-gray-700 rounded-lg relative flex-col' 
                    onMouseEnter={() => setShow(true)} 
                    onMouseLeave={() => setShow(false)}
                >
                    <img
                        alt={`Pin by ${formatHandle(currentProfile?.handle)}`}
                        src={thumbnailUrl}
                        onLoad={() => setLoading(false)}
                        className={clsx('rounded-lg border w-full dark:border-gray-700 border-gray-100', {
                        'h-60': loading
                        })}
                        />
                    {pin?.previews?.length > 1 ? (
                        <span
                        className={clsx(
                            'absolute bottom-0 z-20 left-0 w-full p-2 flex flex-row items-center justify-start overflow-hidden'
                        )}
                        >
                        {
                            splicedMedia.map((media: any, index: number) => {
                                if (index == 0) return null
                                const thumbnailUrl = media.previewItem
                                if(index === 4 && pin?.previews?.length > 4){
                                    return (
                                        <>
                                            <div
                                                key={uuid()}
                                                className={clsx(
                                                    'rounded-full shadow-md border w-8 h-8 overflow-hidden dark:border-gray-700 border-gray-50 -ml-3'
                                                )}
                                            >
                                                <span 
                                                    className="flex items-center justify-center w-full h-full bg-black bg-opacity-50"
                                                >
                                                    <span className="text-white dark:text-gray-800 font-bold text-sm">+{pin?.previews.length - 4}</span>
                                                </span>
                                            </div>
                                        </>
                                    )
                                }
                                return (
                                    <>
                                        <div
                                            key={uuid()}
                                            className={clsx(
                                                'rounded-full border-2 shadow-md w-8 h-8 overflow-hidden dark:border-gray-700 border-gray-50',
                                                pin?.previews.length > 1 && index !== 1 ? '-ml-3' : ''
                                            )}
                                        >
                                            <img 
                                                alt={`Pin by ${formatHandle(currentProfile?.handle)}`}
                                                src={thumbnailUrl}
                                                className={clsx(
                                                    'rounded-full w-8 h-8'
                                                )}
                                            />
                                        </div>
                                    </>
                                )
                            })
                        }
                        </span>
                    ) :
                        null
                    }
                    <div className="p-2 absolute top-0 right-0">
                        <span className="flex h-4 w-4 bg-white items-center justify-center rounded-full">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                        </span>
                    </div>
                    <span className={`${show ? `opacity-100` : `opacity-0`} rounded-lg flex absolute top-0 left-0 bg-black bg-opacity-40 delay-75 duration-75 w-full h-full cursor-zoom group flex-col items-start justify-start px-4 py-1`}></span>
                </div>
            </div>
        </motion.div>
    )
}

export default QueuedPinCard