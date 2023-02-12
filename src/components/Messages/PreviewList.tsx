import Preview from '@components/Messages/Preview';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import clsx from 'clsx';
import { ERROR_MESSAGE } from '@utils/constants';
import type { Profile } from '@utils/lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import useAppStore from '@lib/store';
import { useMessagePersistStore, useMessageStore } from '@lib/store/message';
import useMessagePreviews from '@utils/hooks/useMessagePreviews';
import buildConversationId from '@utils/functions/buildConversationId';
import { buildConversationKey } from '@utils/functions/conversationKey';
import { Loader } from '@components/UI/Loader';
import Modal from '@components/UI/Modal';
import { BiMessageRoundedDots, BiPlusCircle } from 'react-icons/bi';
import { HiOutlineUsers } from 'react-icons/hi';
import Following from '@components/Profile/Following';

interface Props {
  className?: string;
  selectedConversationKey?: string;
}

const PreviewList: FC<Props> = ({ className, selectedConversationKey }) => {
    const router = useRouter();
    const currentProfile = useAppStore((state) => state.currentProfile);
    const addProfileAndSelectTab = useMessageStore((state) => state.addProfileAndSelectTab);
    const selectedTab = useMessageStore((state) => state.selectedTab);
    const setSelectedTab = useMessageStore((state) => state.setSelectedTab);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const { authenticating, loading, messages, profilesToShow, requestedCount, profilesError } =
        useMessagePreviews();
    const clearMessagesBadge = useMessagePersistStore((state) => state.clearMessagesBadge);

    const sortedProfiles = Array.from(profilesToShow).sort(([keyA], [keyB]) => {
        const messageA = messages.get(keyA);
        const messageB = messages.get(keyB);
        return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0) ? -1 : 1;
    });

    useEffect(() => {
        if (!currentProfile) {
        return;
        }
        clearMessagesBadge(currentProfile.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProfile]);

    const showAuthenticating = currentProfile && authenticating;
    const showLoading = loading && (messages.size === 0 || profilesToShow.size === 0);

    const newMessageClick = () => {
        setShowSearchModal(true);
    };

    const onProfileSelected = (profile: Profile) => {
        const conversationId = buildConversationId(currentProfile?.id, profile.id);
        const conversationKey = buildConversationKey(profile.ownedBy, conversationId);
        addProfileAndSelectTab(conversationKey, profile);
        router.push(`/messages/${conversationKey}`);
        setShowSearchModal(false);
    };

    return (
        <div
            className={clsx(
                'xs:h-[85vh] mb-0 sm:h-[76vh] md:w-1/3 md:h-[80vh] xl:h-[84vh]',
                className
            )}
        >
            <Card className="flex h-full flex-col justify-between !border-r-0 !rounded-tl-xl !rounded-bl-xl !rounded-none">
                <div className="flex items-center justify-between border-b p-5 dark:border-gray-700">
                    <div className="font-bold">Messages</div>
                    {currentProfile && !showAuthenticating && !showLoading && (
                        <button onClick={newMessageClick} type="button">
                            <BiPlusCircle className="h-6 w-6" />
                        </button>
                    )}
                </div>
                <div className="flex">
                    <div
                        onClick={() => setSelectedTab('Following')}
                        className={clsx(
                            'text-brand2-500 tab-bg m-2 ml-4 flex flex-1 cursor-pointer items-center justify-center rounded-full p-2 font-bold',
                            selectedTab === 'Following' ? 'bg-brand2-100' : ''
                        )}
                    >
                        <HiOutlineUsers className="mr-2 h-4 w-4" />
                        Following
                    </div>
                    <div
                        onClick={() => setSelectedTab('Requested')}
                        className={clsx(
                        'text-brand2-500 tab-bg m-2 mr-4 flex flex-1 cursor-pointer items-center justify-center rounded-full p-2 font-bold',
                        selectedTab === 'Requested' ? 'bg-brand2-100' : ''
                        )}
                    >
                        Requested
                        {requestedCount > 0 && (
                            <span className="bg-brand2-200 ml-2 rounded-2xl px-3 py-0.5 text-sm font-bold">
                                {requestedCount > 99 ? '99+' : requestedCount}
                            </span>
                        )}
                    </div>
                </div>
                {selectedTab === 'Requested' ? (
                <div className="mt-1 bg-yellow-100 p-2 px-5 text-sm text-yellow-800">
                    These conversations are from Lens profiles that you don&apos;t currently follow.
                </div>
                ) : null}
                <div className="h-full overflow-y-auto overflow-x-hidden">
                {showAuthenticating ? (
                    <div className="flex h-full flex-grow items-center justify-center">
                        <Loader/>
                    </div>
                ) : showLoading ? (
                    <div className="flex h-full flex-grow items-center justify-center">
                        <Loader />
                    </div>
                ) : profilesError ? (
                    <ErrorMessage
                        className="m-5"
                        title={`Failed to load messages`}
                        error={{ message: ERROR_MESSAGE, name: ERROR_MESSAGE }}
                    />
                ) : sortedProfiles.length === 0 ? (
                    <button className="h-full w-full justify-items-center" onClick={newMessageClick} type="button">
                        <EmptyState
                            message={`Start messaging your Lens frens`}
                            icon={<BiMessageRoundedDots className="text-brand h-8 w-8" />}
                            hideCard
                        />
                    </button>
                ) : (
                    sortedProfiles?.map(([key, profile]) => {
                        const message = messages.get(key);
                        if (!message) {
                            return null;
                        }

                        return (
                            <Preview
                                isSelected={key === selectedConversationKey}
                                key={key}
                                profile={profile}
                                conversationKey={key}
                                message={message}
                            />
                        );
                    })
                )}
                </div>
            </Card>
            <Modal
                title={`New message`}
                icon={<BiMessageRoundedDots className="text-brand2 h-5 w-5" />}
                size="sm"
                show={showSearchModal}
                onClose={() => setShowSearchModal(false)}
            >
                <div className="w-full px-4 pt-4">
                {/* <Search
                    modalWidthClassName="max-w-lg"
                    placeholder={`Search for someone to message...`}
                    onProfileSelected={onProfileSelected}
                /> */}
                </div>
                {currentProfile && <Following profile={currentProfile} onProfileSelected={onProfileSelected} />}
            </Modal>
        </div>
    );
};

export default PreviewList;