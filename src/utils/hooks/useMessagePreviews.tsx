import type { Conversation, Stream } from "@xmtp/xmtp-js";
import { SortDirection } from "@xmtp/xmtp-js";
import type { DecodedMessage } from "@xmtp/xmtp-js";
import type { Profile } from "@utils/lens";
import { useAllProfilesLazyQuery } from "@utils/lens";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMessageStore } from "@lib/store/message";
import useAppStore from "@lib/store";
import useXmtpClient from "./useXmtpClient";
import {
  buildConversationKey,
  parseConversationKey,
} from "@utils/functions/conversationKey";
import buildConversationId from "@utils/functions/buildConversationId";
import conversationMatchesProfile from "@utils/functions/conversationMatchesProfile";
import chunkArray from "@utils/functions/chunkArray";
import { resolveEns } from "@utils/functions/resolveEns";

const MAX_PROFILES_PER_REQUEST = 50;

const useMessagePreviews = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore(
    (state) => state.setMessageProfiles
  );
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore(
    (state) => state.setPreviewMessages
  );
  const selectedProfileId = useMessageStore((state) => state.selectedProfileId);
  const setSelectedProfileId = useMessageStore(
    (state) => state.setSelectedProfileId
  );
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage);
  const reset = useMessageStore((state) => state.reset);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [nonLensProfiles, setNonLensProfiles] = useState<Set<string>>(
    new Set<string>()
  );
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(false);
  const [profilesError, setProfilesError] = useState<Error | undefined>();
  const [loadProfiles] = useAllProfilesLazyQuery();
  const selectedTab = useMessageStore((state) => state.selectedTab);
  const setEnsNames = useMessageStore((state) => state.setEnsNames);
  const ensNames = useMessageStore((state) => state.ensNames);
  const [profilesToShow, setProfilesToShow] = useState<Map<string, Profile>>(
    new Map()
  );
  const [requestedCount, setRequestedCount] = useState(0);

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = currentProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

  useEffect(() => {
    if (profilesLoading) {
      return;
    }
    const toQuery = new Set(profileIds);
    // Don't both querying for already seen profiles
    for (const profile of Array.from(messageProfiles.values())) {
      toQuery.delete(profile.id);
    }

    if (!toQuery.size) {
      return;
    }

    const loadLatest = async () => {
      setProfilesLoading(true);
      const newMessageProfiles = new Map(messageProfiles);
      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST);
      try {
        for (const chunk of chunks) {
          const result = await loadProfiles({
            variables: { request: { profileIds: chunk } },
          });
          if (!result.data?.profiles.items.length) {
            continue;
          }

          const profiles = result.data.profiles.items as Profile[];
          for (const profile of profiles) {
            const peerAddress = profile.ownedBy as string;
            const key = buildConversationKey(
              peerAddress,
              buildConversationId(currentProfile?.id, profile.id)
            );
            newMessageProfiles.set(key, profile);
          }
        }
      } catch (error: unknown) {
        setProfilesError(error as Error);
      }

      setMessageProfiles(newMessageProfiles);
      setProfilesLoading(false);
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIds]);

  useEffect(() => {
    const getEns = async () => {
      if (
        (selectedTab === "Other" || selectedTab === "All") &&
        ensNames.size < nonLensProfiles.size
      ) {
        const chunks = chunkArray(
          Array.from(nonLensProfiles),
          MAX_PROFILES_PER_REQUEST
        );
        let newEnsNames = new Map();
        for (const chunk of chunks) {
          const ensNamesData = await resolveEns(chunk);
          let i = 0;
          for (const ensName of ensNamesData) {
            if (ensName !== "") {
              newEnsNames.set(chunk[i], ensName);
            }
            i++;
          }
        }
        setEnsNames(new Map(newEnsNames));
      }
    };
    getEns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, ensNames.size, nonLensProfiles.size]);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    const matcherRegex = conversationMatchesProfile(currentProfile.id);
    let messageStream: AsyncGenerator<DecodedMessage>;
    let conversationStream: Stream<Conversation>;

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;
        const key = buildConversationKey(
          message.conversation.peerAddress,
          conversationId ?? ""
        );
        setPreviewMessage(key, message);
      }
    };

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ key: string; message?: DecodedMessage }> => {
      const key = buildConversationKey(
        convo.peerAddress,
        (convo.context?.conversationId as string) ?? ""
      );

      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
      });
      if (newMessages.length <= 0) {
        return { key };
      }
      return { key, message: newMessages[0] };
    };

    const listConversations = async () => {
      setMessagesLoading(true);
      const newPreviewMessages = new Map(previewMessages);
      const newConversations = new Map(conversations);
      const newProfileIds = new Set(profileIds);
      const newNonLensProfiles = new Set(nonLensProfiles);
      const convos = await client.conversations.list();

      for (const convo of convos) {
        const key = buildConversationKey(
          convo.peerAddress,
          (convo.context?.conversationId as string) ?? ""
        );
        const profileId = getProfileFromKey(key);
        if (profileId) {
          newProfileIds.add(profileId);
        } else {
          newNonLensProfiles.add(key);
        }
        newConversations.set(key, convo);
      }
      const previews = await Promise.all(convos.map(fetchMostRecentMessage));

      for (const preview of previews) {
        const profileId = getProfileFromKey(preview.key);
        if (profileId) {
          newProfileIds.add(profileId);
        }
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
      setConversations(newConversations);
      setMessagesLoading(false);
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }

      if (newNonLensProfiles.size > nonLensProfiles.size) {
        setNonLensProfiles(newNonLensProfiles);
      }
    };

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return;
      }
      await conversationStream.return();
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined);
      }
    };

    const streamConversations = async () => {
      closeConversationStream();
      conversationStream = (await client?.conversations?.stream()) || [];
      for await (const convo of conversationStream) {
        const newConversations = new Map(conversations);
        const newProfileIds = new Set(profileIds);
        const newNonLensProfiles = new Set(nonLensProfiles);
        const key = buildConversationKey(
          convo.peerAddress,
          convo?.context?.conversationId ?? ""
        );
        newConversations.set(key, convo);
        const profileId = getProfileFromKey(key);
        if (profileId && !profileIds.has(profileId)) {
          newProfileIds.add(profileId);
          setProfileIds(newProfileIds);
        } else {
          newNonLensProfiles.add(key);
          setNonLensProfiles(newNonLensProfiles);
        }
        setConversations(newConversations);
      }
    };

    listConversations();
    streamConversations();
    streamAllMessages();

    return () => {
      closeConversationStream();
      closeMessageStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id, selectedProfileId]);

  useEffect(() => {
    if (selectedProfileId && currentProfile?.id !== selectedProfileId) {
      reset();
      setSelectedProfileId(currentProfile?.id);
      router.push("/messages");
    } else {
      setSelectedProfileId(currentProfile?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  useEffect(() => {
    const partitionedProfiles = Array.from(messageProfiles || []).reduce(
      (result, [key, profile]) => {
        if (previewMessages.has(key)) {
          if (profile.isFollowedByMe) {
            result[0].set(key, profile);
          } else {
            result[1].set(key, profile);
          }
        }
        return result;
      },
      [new Map<string, Profile>(), new Map<string, Profile>()]
    );

    const otherProfiles = new Map();
    Array.from(nonLensProfiles).map((key) => {
      otherProfiles.set(key, {} as Profile);
    });

    if (selectedTab === "Lens") {
      setProfilesToShow(partitionedProfiles[0]);
    } else if (selectedTab === "Requests") {
      setProfilesToShow(partitionedProfiles[1]);
    } else if (selectedTab === "Other") {
      setProfilesToShow(otherProfiles);
    } else {
      setProfilesToShow(new Map([...partitionedProfiles[0], ...otherProfiles]));
    }

    setRequestedCount(partitionedProfiles[1].size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageProfiles, selectedTab]);

  return {
    authenticating: creatingXmtpClient,
    loading: messagesLoading || profilesLoading,
    messages: previewMessages,
    profilesToShow,
    requestedCount,
    profilesError: profilesError,
  };
};

export default useMessagePreviews;
