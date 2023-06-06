import { XMTP_PREFIX } from '@utils/constants';

const CONVERSATION_KEY_RE = /^(.*)\/lens\.dev\/dm\/(.*)-(.*)$/;

export const buildConversationKey = (peerAddress: string, conversationId: string): string =>
  conversationId
    ? `${peerAddress.toLowerCase()}/${conversationId}`
    : peerAddress.toLowerCase();

export const parseConversationKey = (
  conversationKey: string
): {
  peerAddress: string;
  members: string[];
  conversationId?: string;
} | null => {
  const matches = conversationKey.match(CONVERSATION_KEY_RE);

  if (!matches || matches.length !== 4) {
    return {
      peerAddress: conversationKey,
      members: []
    };
  }

  const [, peerAddress, memberA, memberB] = Array.from(matches);

  return {
    peerAddress,
    members: [memberA, memberB],
    conversationId: `${XMTP_PREFIX}/${memberA}-${memberB}`
  };
};