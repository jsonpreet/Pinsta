import getUniqueMessages from '@utils/functions/getUniqueMessages';
import type { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { toNanoString } from '@xmtp/xmtp-js';
import type { Profile } from '@utils/lens';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewPinstaAttachment } from '@utils/custom-types';

export type TabValues = 'All' | 'Lens' | 'Other' | 'Requests';

interface MessageState {
    client: Client | undefined;
    setClient: (client: Client | undefined) => void;
    conversations: Map<string, Conversation>;
    setConversations: (conversations: Map<string, Conversation>) => void;
    addConversation: (key: string, newConversation: Conversation) => void;
    messages: Map<string, DecodedMessage[]>;
    setMessages: (messages: Map<string, DecodedMessage[]>) => void;
    addMessages: (key: string, newMessages: DecodedMessage[]) => number;
    messageProfiles: Map<string, Profile>;
    setMessageProfiles: (messageProfiles: Map<string, Profile>) => void;
    addProfileAndSelectTab: (key: string, profile: Profile) => void;
    previewMessages: Map<string, DecodedMessage>;
    setPreviewMessage: (key: string, message: DecodedMessage) => void;
    setPreviewMessages: (previewMessages: Map<string, DecodedMessage>) => void;
    ensNames: Map<string, string>;
    setEnsNames: (ensNames: Map<string, string>) => void;
    previewMessagesNonLens: Map<string, DecodedMessage>;
    setPreviewMessagesNonLens: (
        previewMessagesNonLens: Map<string, DecodedMessage>
    ) => void;
    selectedProfileId: string;
    setSelectedProfileId: (selectedProfileId: string) => void;
    selectedTab: TabValues;
    setSelectedTab: (selectedTab: TabValues) => void;
    attachment: string;
    setAttachment: (attachment: string) => void;
    isUploading: boolean;
    setIsUploading: (isUploading: boolean) => void;
    reset: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    client: undefined,
    setClient: (client) => set(() => ({ client })),
    conversations: new Map(),
    setConversations: (conversations) => set(() => ({ conversations })),
    addConversation: (key: string, newConversation: Conversation) => {
        set((state) => {
            const conversations = new Map(state.conversations);
            conversations.set(key, newConversation);
            return { conversations };
        });
    },
    messages: new Map(),
    setMessages: (messages) => set(() => ({ messages })),
    addMessages: (key: string, newMessages: DecodedMessage[]) => {
        let numAdded = 0;
        set((state) => {
            const messages = new Map(state.messages);
            const existing = state.messages.get(key) || [];
            const updated = getUniqueMessages([...existing, ...newMessages]);
            numAdded = updated.length - existing.length;
            // If nothing has been added, return the old item to avoid unnecessary refresh
            if (!numAdded) {
                return { messages: state.messages };
            }
            messages.set(key, updated);
            return { messages };
        });
        return numAdded;
    },
    messageProfiles: new Map(),
    setMessageProfiles: (messageProfiles) => set(() => ({ messageProfiles })),
    addProfileAndSelectTab: (key, profile) =>
        set((state) => {
            let profiles: Map<string, Profile>;
            if (!state.messageProfiles.get(key)) {
                profiles = new Map(state.messageProfiles);
                profiles.set(key, profile);
            } else {
                profiles = state.messageProfiles;
            }
            const selectedTab: TabValues = profile.isFollowedByMe ? 'Lens' : 'Requests';
            return { messageProfiles: profiles, selectedTab: selectedTab };
        }),
    previewMessages: new Map(),
    setPreviewMessages: (previewMessages) => set(() => ({ previewMessages })),
    ensNames: new Map(),
    setEnsNames: (ensNames) => set(() => ({ ensNames })),
    previewMessagesNonLens: new Map(),
    setPreviewMessagesNonLens: (previewMessagesNonLens) => set(() => ({ previewMessagesNonLens })),
    selectedProfileId: '',
    setSelectedProfileId: (selectedProfileId) => set(() => ({ selectedProfileId })),
    selectedTab: 'All',
    setSelectedTab: (selectedTab) => set(() => ({ selectedTab })),
    setPreviewMessage: (key: string, message: DecodedMessage) =>
        set((state) => {
            const newPreviewMessages = new Map(state.previewMessages);
            newPreviewMessages.set(key, message);
            return { previewMessages: newPreviewMessages };
        }),
    attachment: '',
    setAttachment: (attachment) => set(() => ({ attachment })),
    isUploading: false,
    setIsUploading: (isUploading) => set(() => ({ isUploading })),
    reset: () =>
    set((state) => {
        return {
            ...state,
            conversations: new Map(),
            messages: new Map(),
            messageProfiles: new Map(),
            previewMessages: new Map(),
            selectedTab: 'All',
            previewMessagesNonLens: new Map(),
            ensNames: new Map()
        };
    })
}));

// Each Map is storing a profileId as the key.
interface MessagePersistState {
    viewedMessagesAtNs: Map<string, string | undefined>;
    showMessagesBadge: Map<string, boolean>;
    setShowMessagesBadge: (showMessagesBadge: Map<string, boolean>) => void;
    clearMessagesBadge: (profileId: string) => void;
    unsentMessages: Map<string, string>;
    setUnsentMessage: (key: string, message: string | null) => void;
    setUnsentMessages: (unsentMessages: Map<string, string>) => void;
}

export const useMessagePersistStore = create(
    persist<MessagePersistState>(
        (set) => ({
            viewedMessagesAtNs: new Map(),
            showMessagesBadge: new Map(),
            setShowMessagesBadge: (showMessagesBadge) => set(() => ({ showMessagesBadge })),
            clearMessagesBadge: (profileId: string) => {
                set((state) => {
                    const viewedAt = new Map(state.viewedMessagesAtNs);
                    viewedAt.set(profileId, toNanoString(new Date()));
                    if (!state.showMessagesBadge.get(profileId)) {
                        return { viewedMessagesAtNs: viewedAt };
                    }
                    const show = new Map(state.showMessagesBadge);
                    show.set(profileId, false);
                    return { viewedMessagesAtNs: viewedAt, showMessagesBadge: show };
                });
            },
            unsentMessages: new Map(),
            setUnsentMessage: (key: string, message: string | null) =>
                set((state) => {
                    const newUnsentMessages = new Map(state.unsentMessages);
                    if (message) {
                        newUnsentMessages.set(key, message);
                    } else {
                        newUnsentMessages.delete(key);
                    }
                    return { unsentMessages: newUnsentMessages };
                }),
            setUnsentMessages: (unsentMessages) => set(() => ({ unsentMessages }))
        }),
        {
            name: 'pinsta.message.store',
            // Persist storage doesn't work well with Map by default.
            // Workaround from: https://github.com/pmndrs/zustand/issues/618#issuecomment-954806720.
            serialize: (data) => {
                return JSON.stringify({
                    ...data,
                    state: {
                        ...data.state,
                        viewedMessagesAtNs: Array.from(data.state.viewedMessagesAtNs),
                        showMessagesBadge: Array.from(data.state.showMessagesBadge),
                        unsentMessages: Array.from(data.state.unsentMessages)
                    }
                });
            },
            deserialize: (value) => {
                const data = JSON.parse(value);
                data.state.viewedMessagesAtNs = new Map(data.state.viewedMessagesAtNs);
                data.state.showMessagesBadge = new Map(data.state.showMessagesBadge);
                data.state.unsentMessages = new Map(data.state.unsentMessages);
                return data;
            }
        }
    )
);