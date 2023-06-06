/* eslint-disable @next/next/no-img-element */
import useXmtpClient from '@hooks/useXmtpClient'
import imageCdn from '@utils/functions/imageCdn'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import React, { FC, useEffect, useState } from 'react'
import type {
  Attachment as TAttachment,
  RemoteAttachment
} from 'xmtp-content-type-remote-attachment';
import { RemoteAttachmentCodec } from 'xmtp-content-type-remote-attachment';
import Attachment from './Attachment';
import { Loader } from '@components/UI/Loader';

interface Props {
    remoteAttachment: any
}

enum Status {
  UNLOADED = 'unloaded',
  LOADING = 'loading',
  LOADED = 'loaded'
}

const isImage = (mimeType: string): boolean => ['image/png', 'image/jpeg', 'image/gif'].includes(mimeType);

const MessageMedia: FC<Props> = ({ remoteAttachment }) => {
    const [status, setStatus] = useState<Status>(Status.UNLOADED);
    const [attachment, setAttachment] = useState<TAttachment | null>(null);
    const { client } = useXmtpClient();

    useEffect(() => {
        async function load() {
            if (!client) {
                return;
            }
            const attachment: TAttachment = await RemoteAttachmentCodec.load(
                remoteAttachment,
                client
            );

            setAttachment(attachment)
            setStatus(Status.LOADED)
        }

        load();
    }, [
        client,
        remoteAttachment,
    ])

    return (
        <>
            <div className="mt-1 items-center flex flex-col space-y-1">
                {attachment ? <Attachment attachment={attachment} /> : null}
                {status === Status.LOADING && (
                    <Loader className="mx-28 my-4 h-48 w-48" size="sm" />
                )}
            </div>    
        </>
    )
}

export default MessageMedia