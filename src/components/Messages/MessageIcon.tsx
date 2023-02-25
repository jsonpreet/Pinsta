import useAppStore from '@lib/store';
import { useMessagePersistStore } from '@lib/store/message';
import conversationMatchesProfile from '@utils/functions/conversationMatchesProfile';
import useXmtpClient from '@utils/hooks/useXmtpClient';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { fromNanoString, SortDirection } from '@xmtp/xmtp-js';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { BsEnvelope } from 'react-icons/bs';

const MessageIcon: FC = () => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const clearMessagesBadge = useMessagePersistStore((state) => state.clearMessagesBadge);
    const viewedMessagesAtNs = useMessagePersistStore((state) => state.viewedMessagesAtNs);
    const showMessagesBadge = useMessagePersistStore((state) => state.showMessagesBadge);
    const setShowMessagesBadge = useMessagePersistStore((state) => state.setShowMessagesBadge);
    const { client: cachedClient } = useXmtpClient(true);

    const shouldShowBadge = (viewedAt: string | undefined, messageSentAt: Date | undefined): boolean => {
        if (!messageSentAt) {
            return false;
        }

        const viewedMessagesAt = fromNanoString(viewedAt);

        return (
            !viewedMessagesAt ||
            (viewedMessagesAt.getTime() < messageSentAt.getTime() && messageSentAt.getTime() < new Date().getTime())
        );
    };

    useEffect(() => {
        if (!cachedClient || !currentProfile) {
            return;
        }

        const matcherRegex = conversationMatchesProfile(currentProfile.id);

        const fetchShowBadge = async () => {
            const convos = await cachedClient.conversations.list();
            const matchingConvos = convos.filter(
                (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
            );

            if (matchingConvos.length <= 0) {
                return;
            }

            const topics = matchingConvos.map((convo) => convo.topic);
            const mostRecentMessages = await cachedClient.listEnvelopes(topics, async (e) => e, {
                limit: 1,
                direction: SortDirection.SORT_DIRECTION_DESCENDING
            });
            const mostRecentMessage = mostRecentMessages.length > 0 ? mostRecentMessages[0] : null;
            const sentAt = fromNanoString(mostRecentMessage?.timestampNs);
            const showBadge = shouldShowBadge(viewedMessagesAtNs.get(currentProfile.id), sentAt);
            showMessagesBadge.set(currentProfile.id, showBadge);
            setShowMessagesBadge(new Map(showMessagesBadge));
        };

        let messageStream: AsyncGenerator<DecodedMessage>;
        const closeMessageStream = async () => {
            if (messageStream) {
                await messageStream.return(undefined);
            }
        };

        // For v1 badging, only badge when not already viewing messages. Once we have
        // badging per-conversation, we can remove this.
        const newMessageValidator = (profileId: string): boolean => {
            return !window.location.pathname.startsWith('/messages') && currentProfile.id === profileId;
        };

        const streamAllMessages = async (messageValidator: (profileId: string) => boolean) => {
            messageStream = await cachedClient.conversations.streamAllMessages();

            for await (const message of messageStream) {
                if (messageValidator(currentProfile.id)) {
                    const conversationId = message.conversation.context?.conversationId;
                    const isFromPeer = currentProfile.ownedBy !== message.senderAddress;
                    if (isFromPeer && conversationId && matcherRegex.test(conversationId)) {
                        const showBadge = shouldShowBadge(viewedMessagesAtNs.get(currentProfile.id), message.sent);
                        showMessagesBadge.set(currentProfile.id, showBadge);
                        setShowMessagesBadge(new Map(showMessagesBadge));
                    }
                }
            }
        };

        fetchShowBadge();
        streamAllMessages(newMessageValidator);

        return () => {
            closeMessageStream();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cachedClient, currentProfile?.id]);

    return (
        <Link
            href="/messages"
            className="md:w-[40px] items-center justify-center rounded-full md:px-0 md:py-1.5 flex px-4 py-2 focus-visible:outline-none focus:outline-none group relative duration-75 delay-75 hover:bg-white"
            onClick={() => {
                currentProfile && clearMessagesBadge(currentProfile.id);
            }}
        >
        <BsEnvelope size={24} className='group-hover:text-gray-900 text-white font-semibold md:text-gray-800 duration-75 delay-75' />
            {showMessagesBadge.get(currentProfile?.id) ? (
                <span className="h-2 w-2 absolute top-1 -right-1 rounded-full bg-red-500" />
            ) : null}
        </Link>
    );
};

export default MessageIcon;