/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Profile } from '@utils/lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import useAppStore from '@lib/store';
import formatHandle from '@utils/functions/formatHandle';
import IsVerified from '@components/UI/IsVerified';
import formatTime from '@utils/functions/formatTime';
import getProfilePicture from '@utils/functions/getProfilePicture';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';
import getStampFyiURL from '@utils/functions/getStampFyiURL';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';
import formatAddress from '@utils/functions/formatAddress';
import sanitizeDisplayName from '@utils/functions/sanitizeDisplayName';


dayjs.extend(relativeTime);

interface PreviewProps {
  ensName?: string;
  profile?: Profile;
  message?: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

interface MessagePreviewProps {
  message: DecodedMessage;
}

const MessagePreview: FC<MessagePreviewProps> = ({ message }) => {
    if (message.contentType.sameAs(ContentTypeText)) {
        return <span>{message.content}</span>;
    } else if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
        const remoteAttachment: RemoteAttachment = message.content;
        return <span>{remoteAttachment.filename}</span>;
    } else {
        // eslint-disable-next-line react/no-unescaped-entities
        return <span>''</span>;
    }
};

const Preview: FC<PreviewProps> = ({ ensName, profile, message, conversationKey, isSelected }) => {
    const router = useRouter();
    const currentProfile = useAppStore((state) => state.currentProfile);
    const address = currentProfile?.ownedBy;

    const onConversationSelected = (profileId: string) => {
        router.push(profileId ? `/messages/${conversationKey}` : '/messages');
    };

    const url = (ensName && getStampFyiURL(conversationKey?.split('/')[0])) ?? '';

    return (
      <div
        className={clsx(
          "cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-gray-800",
          isSelected && "bg-gray-50 dark:bg-gray-800"
        )}
        onClick={() =>
          onConversationSelected(profile?.id ? profile.id : conversationKey)
        }
      >
        <div className="flex justify-between space-x-3 px-5">
          <img
            /* @ts-ignore */
            src={ensName ? url : getProfilePicture(profile)}
            loading="lazy"
            className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
            height={40}
            width={40}
            alt={formatHandle(profile?.handle)}
          />
          <div className="w-full">
            <div className="flex w-full justify-between space-x-1">
              <div className="flex max-w-sm items-center">
                <div className="line-clamp-1 text-md">
                  {profile?.name
                    ? sanitizeDisplayName(profile?.name) : profile?.handle ?
                      formatHandle(profile?.handle)
                    : ensName ?? formatAddress(conversationKey?.split("/")[0])}
                </div>
                <IsVerified id={profile?.id} size="xs" />
              </div>
              {message?.sent && (
                <span
                  className="lt-text-gray-500 min-w-fit pt-0.5 text-xs"
                  title={formatTime(message.sent)}
                >
                  {dayjs(new Date(message.sent)).fromNow()}
                </span>
              )}
            </div>
            <span className="lt-text-gray-500 line-clamp-1 break-all text-sm">
              {address === message?.senderAddress && "You: "}
              {/* @ts-ignore */}
              <MessagePreview message={message} />
            </span>
          </div>
        </div>
      </div>
    );
};

export default Preview;