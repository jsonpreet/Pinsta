import type { FetchSignerResult } from '@wagmi/core'
import type { Profile } from '@utils/lens'
import create from 'zustand'

interface AppState {
    showCreateChannel: boolean
    hasNewNotification: boolean
    userSigNonce: number
    currentProfile: Profile | null
    activeTagFilter: string
    setActiveTagFilter: (activeTagFilter: string) => void
    setCurrentProfile: (channel: Profile | null) => void
    setUserSigNonce: (userSigNonce: number) => void
    setShowCreateChannel: (showCreateChannel: boolean) => void
    setHasNewNotification: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
    showCreateChannel: false,
    hasNewNotification: false,
    userSigNonce: 0,
    currentProfile: null,
    activeTagFilter: 'all',
    setActiveTagFilter: (activeTagFilter) => set(() => ({ activeTagFilter })),
    setCurrentProfile: (channel) => set(() => ({ currentProfile: channel })),
    setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
    setHasNewNotification: (b) => set(() => ({ hasNewNotification: b })),
    setShowCreateChannel: (showCreateChannel) =>
        set(() => ({ showCreateChannel })),
}))

export default useAppStore