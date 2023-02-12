/* eslint-disable @next/next/no-img-element */
import type { DecodedMessage } from '@xmtp/xmtp-js';
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
import { ContentTypeImageKey } from '@hooks/codecs/Image';
import { ContentTypeVideoKey } from '@hooks/codecs/Video';

dayjs.extend(relativeTime);

interface Props {
    profile: Profile;
    message: DecodedMessage;
    conversationKey: string;
    isSelected: boolean;
}

const Preview: FC<Props> = ({ profile, message, conversationKey, isSelected }) => {
    const router = useRouter();
    const currentProfile = useAppStore((state) => state.currentProfile);
    const address = currentProfile?.ownedBy;

    const onConversationSelected = (profileId: string) => {
        router.push(profileId ? `/messages/${conversationKey}` : '/messages');
    };

    return (
        <div
            className={clsx(
                'cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-gray-800',
                isSelected && 'bg-gray-50 dark:bg-gray-800'
            )}
            onClick={() => onConversationSelected(profile.id)}
        >
            <div className="flex justify-between space-x-3 px-5">
                <img
                    src={getProfilePicture(profile)}
                    loading="lazy"
                    className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
                    height={40}
                    width={40}
                    alt={formatHandle(profile?.handle)}
                />
                <div className="w-full">
                    <div className="flex w-full justify-between space-x-1">
                        <div className="flex max-w-sm items-center gap-1">
                            <div className="line-clamp-1 text-md">{profile?.name ?? formatHandle(profile.handle)}</div>
                            <IsVerified id={profile.id} />
                        </div>
                        {message.sent && (
                            <span className="lt-text-gray-500 min-w-fit pt-0.5 text-xs" title={formatTime(message.sent)}>
                                {dayjs(new Date(message.sent)).fromNow()}
                            </span>
                        )}
                    </div>
                    <span className="lt-text-gray-500 line-clamp-1 break-all text-sm">
                        {address === message.senderAddress && 'You: '}
                        {
                            message.contentType.typeId == ContentTypeImageKey.typeId ? 'Sent a Image' :
                            message.contentType.typeId == ContentTypeVideoKey.typeId ? 'Sent a Video'
                            : message.content
                        }
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Preview;