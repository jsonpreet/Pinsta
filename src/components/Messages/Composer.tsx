import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { Loader } from '@components/UI/Loader';
import { useMessagePersistStore, useMessageStore } from '@lib/store/message';
import { MIN_WIDTH_DESKTOP } from '@utils/constants';
import useWindowSize from '@utils/hooks/useWindowSize';
import { FC, useRef } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsArrowRightShort, BsCameraVideo, BsFillPatchQuestionFill, BsImage } from 'react-icons/bs';
import { uploadToIPFS } from '@utils/functions/uploadToIPFS';
import { ContentTypeImageKey } from '@hooks/codecs/Image';
import { SendOptions } from '@xmtp/xmtp-js';
import { ContentTypeVideoKey } from '@hooks/codecs/Video';
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from '@utils/constants';
import type { IGif } from '@giphy/js-types';
import { v4 as uuid } from 'uuid';

import Giphy from './Giphy';
import DropMenu from '@components/UI/DropMenu';
import { Analytics, TRACK } from '@utils/analytics';
import { isBrowser } from 'react-device-detect';
import { MdOutlineAttachFile } from 'react-icons/md';
import { BiSend } from 'react-icons/bi';

interface Props {
    sendMessage: (message: string, option?: SendOptions) => Promise<boolean>;
    conversationKey: string;
    disabledInput: boolean;
}

const Composer: FC<Props> = ({ sendMessage, conversationKey, disabledInput }) => {
    const [message, setMessage] = useState<string>('');
    const imageRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLInputElement>(null);
    const [sending, setSending] = useState<boolean>(false);
    const { width } = useWindowSize();
    const unsentMessage = useMessagePersistStore((state) => state.unsentMessages.get(conversationKey));
    const setUnsentMessage = useMessagePersistStore((state) => state.setUnsentMessage);
    const setIsUploading = useMessageStore((state) => state.setIsUploading);
    const isUploading = useMessageStore((state) => state.isUploading);
    const setAttachment = useMessageStore((state) => state.setAttachment);

    const canSendMessage = !disabledInput && !sending && message.length > 0;

    const handleSend = async () => {
        if (!canSendMessage) {
            return;
        }
        setSending(true);
        const sent = await sendMessage(message);
        if (sent) {
            setMessage('');
            setUnsentMessage(conversationKey, null);
        } else {
            toast.error(`Error sending message`);
        }
        setSending(false);
    };

    const handleSendImage = async () => {
        imageRef.current?.click();
    };

    const handleSendVideo = async () => {
        videoRef.current?.click();
    };

    const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSending(true);
        setIsUploading(true);
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (file.size > 10000000) {
            setIsUploading(false);
            toast.error(`Image size should be less than 10MB`);
            return;
        }

        setAttachment({
            id: uuid(),
            type: 'image',
            item: URL.createObjectURL(file),
            altTag: file.name,
            previewItem: URL.createObjectURL(file)
        })

        const { url } = await uploadToIPFS(file)
        if (url) {
            const sent = await sendMessage(url.toString(), {
                contentType: ContentTypeImageKey,
                contentFallback: 'Image'
            });
            if (sent) {
                setAttachment({
                    id: '',
                    type: '',
                    item: '',
                    altTag: '',
                    previewItem: ''
                })
                setMessage('');
                setIsUploading(false);
                setSending(false);
                setUnsentMessage(conversationKey, null);
            } else {
                setAttachment({
                    id: '',
                    type: '',
                    item: '',
                    altTag: '',
                    previewItem: ''
                })
                setIsUploading(false);
                setSending(false);
                toast.error(`Error sending message`);
            }
        }
    };

    const setGifAttachment = async(gif: IGif) => {
        setIsUploading(true);

        setAttachment({
            id: uuid(),
            type: 'image',
            item: gif.images.original.url,
            altTag: gif.title,
            previewItem: gif.images.original.url
        })
        const sent = await sendMessage(gif.images.original.url.toString(), {
            contentType: ContentTypeImageKey,
            contentFallback: gif.title
        });
        if (sent) {
            setAttachment({
                id: '',
                type: '',
                item: '',
                altTag: '',
                previewItem: ''
            })
            setIsUploading(false);
            setMessage('');
            setUnsentMessage(conversationKey, null);
        } else {
            setAttachment({
                id: '',
                type: '',
                item: '',
                altTag: '',
                previewItem: ''
            })
            setIsUploading(false);
            toast.error(`Error sending message`);
        }
    };

    const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSending(true);
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (file.size > 100000000) {
            toast.error(`Video size should be less than 100MB`);
            return;
        }

        const { url } = await uploadToIPFS(file)
       
        if (url) {
            const sent = await sendMessage(url.toString(), {
                contentType: ContentTypeVideoKey,
                contentFallback: 'Video'
            });
            if (sent) {
                setMessage('');
                setUnsentMessage(conversationKey, null);
            } else {
                toast.error(`Error sending message`);
            }
        }

        setSending(false);
    };


    useEffect(() => {
        setMessage(unsentMessage ?? '');
    }, [unsentMessage]);

    const onChangeCallback = (value: string) => {
        setUnsentMessage(conversationKey, value);
        setMessage(value);
    };

    const handleKeyDown = (event: { key: string }) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex space-x-2 md:space-x-4 items-center p-4">
            <Input
                type="text"
                className='!rounded-full'
                placeholder={`Type Something`}
                value={message}
                disabled={disabledInput}
                onKeyDown={handleKeyDown}
                onChange={(event) => onChangeCallback(event.target.value)}
            />
            <input
                ref={imageRef}
                type='file'
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                multiple={false}
                className='hidden'
                onChange={handleUploadImage}
            />
            <input
                ref={videoRef}
                type='file'
                accept={ALLOWED_VIDEO_TYPES.join(',')}
                multiple={false}
                className='hidden'
                onChange={handleUploadVideo}
            />
            <DropMenu
                trigger={
                    <button
                        className="!p-0 flex-none ml-1"
                        onClick={() => {
                            Analytics.track(TRACK.CLICK_MESSAGE_ATTACHMENT)
                        }}
                    >
                        <MdOutlineAttachFile size={24} className="fill-brand-500 dark:fill-brand-400" />
                    </button>
                }
            >
                <div className="mt-1.5 focus-visible:outline-none focus:outline-none focus:ring-0 overflow-hidden py-1">
                    <div className="flex flex-col items-center space-y-3">
                        <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
                        <button onClick={handleSendImage}>
                            <BsImage size={24} className="fill-brand-500 dark:fill-brand-400"/>
                        </button>
                        <button onClick={handleSendVideo}>
                            <BsCameraVideo size={24} className="fill-brand-500 dark:fill-brand-400"/>
                        </button>
                    </div>
                </div>
            </DropMenu>
            {isBrowser ? 
                <>
                    <button onClick={handleSendVideo} className='hidden md:block'>
                        <BsCameraVideo size={24} className="fill-brand-500 dark:fill-brand-400"/>
                    </button>
                    <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
                    <button onClick={handleSendImage} className='hidden md:block'>
                        <BsImage size={24} className="fill-brand-500 dark:fill-brand-400"/>
                    </button>
                </>
            : null}
            <Button
                disabled={!canSendMessage}
                onClick={handleSend}
                variant="primary"
                className='!p-0 !px-2 !w-10 !h-9 md:!px-5 md:!w-auto md:!rounded-full !rounded-md'
                aria-label="Send message"
            >
                <div className="flex items-center justify-center">
                    <span className='hidden md:block'>Send</span>
                    <BiSend size={20} className="fill-white block md:hidden" />
                    {sending && <Loader size="sm" className="h-5 w-5" />}
                </div>
            </Button>
        </div>
    );
};

export default Composer;