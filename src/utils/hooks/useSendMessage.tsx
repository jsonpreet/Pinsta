import type { Conversation, SendOptions } from '@xmtp/xmtp-js';
import { useCallback } from 'react';

const useSendMessage = (conversation?: Conversation) => {
    const sendMessage = useCallback(
        async (message: string, options?: SendOptions): Promise<boolean> => {
            if (!conversation) {
                return false;
            }
            try {
                const res = await conversation.send(message, options);
            } catch (error) {
                return false;
            }
            return true;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [conversation]
    );

    return { sendMessage };
};

export default useSendMessage;