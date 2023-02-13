
import { Client } from '@xmtp/xmtp-js';
import { XMTP_ENV } from '@utils/constants';
import type { Profile } from '@utils/lens';
import { useEffect, useState } from 'react';
import useAppStore from '@lib/store';
import { useMessageStore } from '@lib/store/message';
import { parseConversationKey } from '@utils/functions/conversationKey';

const useGetConversation = (conversationKey: string, profile?: Profile) => {
    const client = useMessageStore((state) => state.client);
    const selectedConversation = useMessageStore((state) => state.conversations.get(conversationKey));
    const addConversation = useMessageStore((state) => state.addConversation);
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [missingXmtpAuth, setMissingXmtpAuth] = useState<boolean>();

    const reset = () => {
        setMissingXmtpAuth(false);
    };

    useEffect(() => {
        if (!profile || !client) {
            return;
        }
        if (selectedConversation) {
            setMissingXmtpAuth(false);
            return;
        }
        const createNewConversation = async () => {
            const conversationId = parseConversationKey(conversationKey)?.conversationId;
            const canMessage = await Client.canMessage(profile.ownedBy, { env: XMTP_ENV });
            setMissingXmtpAuth(!canMessage);

            if (!canMessage || !conversationId) {
                return;
            }
            const conversation = await client.conversations.newConversation(profile.ownedBy, {
                conversationId: conversationId,
                metadata: {}
            });
            addConversation(conversationKey, conversation);
        };
        createNewConversation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile, selectedConversation]);

    useEffect(() => {
        if (!currentProfile) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProfile]);

    return {
        selectedConversation,
        missingXmtpAuth
    };
};

export default useGetConversation;