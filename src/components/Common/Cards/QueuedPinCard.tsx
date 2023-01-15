/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FC, useState } from 'react'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import { motion } from "framer-motion"
import { Loader } from '@components/UI/Loader'
import formatHandle from '@utils/functions/formatHandle'
import { Analytics } from '@utils/analytics'
import usePersistStore from '@lib/store/persist'
import useAppStore from '@lib/store'
import { useApolloClient } from '@apollo/client'
import { PublicationDocument, PublicationMetadataStatusType, useHasTxHashBeenIndexedQuery, usePublicationLazyQuery } from '@utils/lens/generated'

dayjs.extend(relativeTime)

type Props = {
  pin: any
}

const QueuedPinCard: FC<Props> = ({ pin }) => {
    console.log(pin)
    const thumbnailUrl = pin?.publication?.preview
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const queuedPublications = usePersistStore((state) => state.queuedPublications)
    const setQueuedPublications = usePersistStore((state) => state.setQueuedPublications)

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
        onCompleted: (data) => {
        if (data?.publication) {
            cache.modify({
                fields: {
                    publications() {
                        cache.writeQuery({ data: data?.publication as any, query: PublicationDocument });
                    }
                }
            });
            removeTxn();
        }
        }
    });

    useHasTxHashBeenIndexedQuery({
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
    
    return (
        <motion.div
            className="group"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring", stiffness: 200, damping: 24
            }}
        >
        {!pin.hidden ? (
            <>
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
                        alt={`Pin by ${formatHandle(pin.profile?.handle)}`}
                        src={thumbnailUrl}
                        onLoad={() => setLoading(false)}
                        className={clsx('rounded-lg border w-full dark:border-gray-700 border-gray-100', {
                        'h-60': loading
                        })}
                    />
                    <div className="p-2 relative">
                        <span className="flex h-2 w-2 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                        </span>
                    </div>
                    <span className={`${show ? `opacity-100` : `opacity-0`} rounded-lg flex absolute top-0 left-0 bg-black bg-opacity-40 delay-75 duration-75 w-full h-full cursor-zoom group flex-col items-start justify-start px-4 py-1`}></span>
                    {/* {loading ?
                        <span className='absolute bg-gray-100 dark:bg-gray-700 top-0 rounded-lg left-0 right-0 bottom-0 h-full w-full flex items-center justify-center'>
                            <Loader/>
                        </span>
                        : null
                    } */}
                    </div>
                </div>
            </>
        ) : (
            null
        )}
        </motion.div>
    )
}

export default QueuedPinCard