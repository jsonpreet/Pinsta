import { Button } from "@components/UI/Button";
import { Input } from "@components/UI/Input";
import { Loader } from "@components/UI/Loader";
import { useMessagePersistStore, useMessageStore } from "@lib/store/message";
import { MIN_WIDTH_DESKTOP } from "@utils/constants";
import useWindowSize from "@utils/hooks/useWindowSize";
import { ChangeEvent, FC, useRef } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BsArrowRightShort,
  BsCameraVideo,
  BsFillPatchQuestionFill,
  BsImage,
} from "react-icons/bs";
import { uploadToIPFS } from "@utils/functions/uploadToIPFS";
import { ContentTypeId, ContentTypeText, SendOptions } from "@xmtp/xmtp-js";
import type {
  Attachment as TAttachment,
  RemoteAttachment,
} from "xmtp-content-type-remote-attachment";
import {
  AttachmentCodec,
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec,
} from "xmtp-content-type-remote-attachment";
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from "@utils/constants";
import type { IGif } from "@giphy/js-types";
import { v4 as uuid } from "uuid";

import Giphy from "./Giphy";
import DropMenu from "@components/UI/DropMenu";
import { Analytics, TRACK } from "@utils/analytics";
import { isBrowser, isMobile } from "react-device-detect";
import { MdOutlineAttachFile, MdOutlineClose } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import useStreamMessages from "@hooks/useStreamMessages";
import sanitizeIpfsUrl from "@utils/functions/sanitizeIpfsUrl";
import Attachment from "./Attachment";

interface Props {
  sendMessage: (
    content: string | RemoteAttachment,
    contentType: ContentTypeId,
    fallback?: string
  ) => Promise<boolean>;
  conversationKey: string;
  disabledInput: boolean;
}

interface AttachmentPreviewProps {
  onDismiss: () => void;
  dismissDisabled: boolean;
  attachment: TAttachment;
}

const AttachmentPreview: FC<AttachmentPreviewProps> = ({
  onDismiss,
  dismissDisabled,
  attachment,
}) => {
  return (
    <div className="relative ml-12 inline-block rounded pt-6">
      <button
        disabled={dismissDisabled}
        type="button"
        className="absolute top-2 rounded-full bg-gray-900 p-1.5 opacity-75"
        onClick={onDismiss}
      >
        <MdOutlineClose className="h-4 w-4 text-white" />
      </button>
      <Attachment attachment={attachment} />
    </div>
  );
};

const Composer: FC<Props> = ({
  sendMessage,
  conversationKey,
  disabledInput,
}) => {
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const { width } = useWindowSize();
  const imageRef = useRef<HTMLInputElement>(null);
  const unsentMessage = useMessagePersistStore((state) =>
    state.unsentMessages.get(conversationKey)
  );
  const setUnsentMessage = useMessagePersistStore(
    (state) => state.setUnsentMessage
  );
  const setIsUploading = useMessageStore((state) => state.setIsUploading);
  const isUploading = useMessageStore((state) => state.isUploading);
  const [attachment, setAttachment] = useState<TAttachment | null>(null);
  const [sentMessage, setSentMessage] = useState<boolean>(false);

  const canSendMessage = !disabledInput && (attachment || message.length > 0);
	useStreamMessages(conversationKey);
	
	const onDismiss = () => {
    setAttachment(null);

    const el = imageRef.current;
    if (el) {
      el.value = "";
    }
  };

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    // a `null` value indicates that a message won't be sent
    let sendAttachment: Promise<boolean | null> = Promise.resolve(null);
    let sendText: Promise<boolean | null> = Promise.resolve(null);
    setSending(true);
    if (attachment) {
      const encryptedEncodedContent =
        await RemoteAttachmentCodec.encodeEncrypted(
          attachment,
          new AttachmentCodec()
        );

      const file = new File(
        [encryptedEncodedContent.payload],
        "XMTPEncryptedContent",
        {
          type: attachment.mimeType,
        }
      );

      const uploadedAttachment = await uploadToIPFS(file);
			const url = sanitizeIpfsUrl(uploadedAttachment?.url);
      console.log(url);
      if (url) {
        const remoteAttachment: RemoteAttachment = {
          url,
          contentDigest: encryptedEncodedContent.digest,
          salt: encryptedEncodedContent.salt,
          nonce: encryptedEncodedContent.nonce,
          secret: encryptedEncodedContent.secret,
          scheme: "https://",
          filename: attachment.filename,
          contentLength: attachment.data.byteLength,
        };
        // Since we're sending this, we should always load it
        /* @ts-ignore */
        setAttachment(url);

        const sentAttachment = await sendMessage(
          remoteAttachment,
          ContentTypeRemoteAttachment,
          `[Attachment] Cannot display "${attachment.filename}". This app does not support attachments yet.`
        );

        if (sentAttachment) {
          setAttachment(null);
        } else {
          toast.error(`Error sending attachment`);
        }
      } else {
        toast.error(`Error sending attachment`);
      }
    }

    if (message.length > 0) {
      sendText = sendMessage(message, ContentTypeText);
      setMessage("");
      setUnsentMessage(conversationKey, null);
      setSentMessage(true);
    }
    const sentMessage = await sendText;
    if (sentMessage) {
    } else {
      toast.error(`Error sending message`);
    }
    setSending(false);
  };

	const onAttachmentChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      const fileReader = new FileReader();
      fileReader.addEventListener("load", async function () {
        const data = fileReader.result;

        if (!(data instanceof ArrayBuffer)) {
          return;
        }

        const attachment: TAttachment = {
          filename: file.name,
          mimeType: file.type,
          data: new Uint8Array(data),
        };

        setAttachment(attachment);
      });

      fileReader.readAsArrayBuffer(file);
    } else {
      setAttachment(null);
    }
  };

  // const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setSending(true);
  //     setIsUploading(true);
  //     const file = event.target.files?.[0];
  //     if (!file) {
  //         return;
  //     }

  //     if (file.size > 10000000) {
  //         setIsUploading(false);
  //         toast.error(`Image size should be less than 10MB`);
  //         return;
  //     }

  //     setAttachment({
  //         id: uuid(),
  //         type: 'image',
  //         item: URL.createObjectURL(file),
  //         altTag: file.name,
  //         previewItem: URL.createObjectURL(file)
  //     })

  //     const { url } = await uploadToIPFS(file)
  //     if (url) {
  //         const sent = await sendMessage(url.toString(), {
  //             contentType: ContentTypeImageKey,
  //             contentFallback: 'Image'
  //         });
  //         if (sent) {
  //             setAttachment({
  //                 id: '',
  //                 type: '',
  //                 item: '',
  //                 altTag: '',
  //                 previewItem: ''
  //             })
  //             setMessage('');
  //             setIsUploading(false);
  //             setSending(false);
  //             setUnsentMessage(conversationKey, null);
  //         } else {
  //             setAttachment({
  //                 id: '',
  //                 type: '',
  //                 item: '',
  //                 altTag: '',
  //                 previewItem: ''
  //             })
  //             setIsUploading(false);
  //             setSending(false);
  //             toast.error(`Error sending message`);
  //         }
  //     }
  // };

  // const setGifAttachment = async(gif: IGif) => {
  //     setIsUploading(true);

  //     setAttachment({
  //         id: uuid(),
  //         type: 'image',
  //         item: gif.images.original.url,
  //         altTag: gif.title,
  //         previewItem: gif.images.original.url
  //     })
  //     const sent = await sendMessage(gif.images.original.url.toString(), {
  //         contentType: ContentTypeImageKey,
  //         contentFallback: gif.title
  //     });
  //     if (sent) {
  //         setAttachment({
  //             id: '',
  //             type: '',
  //             item: '',
  //             altTag: '',
  //             previewItem: ''
  //         })
  //         setIsUploading(false);
  //         setMessage('');
  //         setUnsentMessage(conversationKey, null);
  //     } else {
  //         setAttachment({
  //             id: '',
  //             type: '',
  //             item: '',
  //             altTag: '',
  //             previewItem: ''
  //         })
  //         setIsUploading(false);
  //         toast.error(`Error sending message`);
  //     }
  // }

  const handleSendImage = async () => {
    imageRef.current?.click();
  };

  useEffect(() => {
    setMessage(unsentMessage ?? "");
  }, [unsentMessage]);

  const onChangeCallback = (value: string) => {
    setUnsentMessage(conversationKey, value);
    setMessage(value);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

	return (
    <>
      {attachment && !sending ? (
        <AttachmentPreview
          onDismiss={onDismiss}
          dismissDisabled={!canSendMessage}
          attachment={attachment}
        />
      ) : null}
      <div className="flex space-x-2 md:space-x-4 items-center p-4">
        <Input
          type="text"
          className="!rounded-full"
          placeholder={`Type Something`}
          value={message}
          disabled={disabledInput}
          onKeyDown={handleKeyDown}
          onChange={(event) => onChangeCallback(event.target.value)}
        />
        <input
          ref={imageRef}
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          className="hidden w-full"
          onChange={onAttachmentChange}
        />
        <button onClick={handleSendImage} className="hidden md:block">
          <BsImage size={24} className="fill-brand-500 dark:fill-brand-400" />
        </button>
        {/* { isMobile ? 
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
										</div>
								</div>
						</DropMenu>
						:  
								<>
										<button onClick={handleSendVideo} className='hidden md:block'>
												<BsCameraVideo size={24} className="fill-brand-500 dark:fill-brand-400"/>
										</button>
										<Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
										<button onClick={handleSendImage} className='hidden md:block'>
												<BsImage size={24} className="fill-brand-500 dark:fill-brand-400"/>
										</button>
								</>
						} */}
        <Button
          disabled={!canSendMessage}
          onClick={handleSend}
          variant="primary"
          className="!p-0 !px-2 !w-10 !h-9 md:!px-5 md:!w-auto md:!rounded-full !rounded-md"
          aria-label="Send message"
        >
          <div className="flex items-center justify-center">
            <span className="hidden md:block">Send</span>
            <BiSend size={20} className="fill-white block md:hidden" />
            {sending && <Loader size="sm" />}
          </div>
        </Button>
      </div>
    </>
  );
};

export default Composer;
