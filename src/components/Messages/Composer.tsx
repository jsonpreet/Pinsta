import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { Loader } from '@components/UI/Loader';
import { useMessagePersistStore } from '@lib/store/message';
import { MIN_WIDTH_DESKTOP } from '@utils/constants';
import useWindowSize from '@utils/hooks/useWindowSize';
import { FC, useRef } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsArrowRightShort, BsCameraVideo, BsImage } from 'react-icons/bs';
import { uploadToIPFS } from '@utils/functions/uploadToIPFS';
import { ContentTypeImageKey } from '@hooks/codecs/Image';
import { SendOptions } from '@xmtp/xmtp-js';
import { ContentTypeVideoKey } from '@hooks/codecs/Video';
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from '@utils/constants';

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
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (file.size > 10000000) {
            toast.error(`Image size should be less than 10MB`);
            return;
        }

        const { url } = await uploadToIPFS(file)
        if (url) {
            const sent = await sendMessage(url.toString(), {
                contentType: ContentTypeImageKey,
                contentFallback: 'Image'
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
        console.log(url);
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
        <div className="flex space-x-4 p-4">
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
            <button onClick={handleSendVideo}>
                <BsCameraVideo size={24}/>
            </button>
            <button onClick={handleSendImage}>
                <BsImage size={24}/>
            </button>
            <Button disabled={!canSendMessage} onClick={handleSend} variant="primary" aria-label="Send message">
                <div className="flex items-center space-x-2">
                    <span>Send</span>
                    {sending && <Loader size="sm" className="h-5 w-5" />}
                </div>
            </Button>
        </div>
    );
};

export default Composer;