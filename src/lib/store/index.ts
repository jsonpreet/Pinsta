import type { FetchSignerResult } from '@wagmi/core'
import type { Profile } from '@utils/lens'
import create from 'zustand'

interface AppState {
    showCreateAccount: boolean
    profiles: Profile[] | []
    hasNewNotification: boolean
    userSigNonce: number
    currentProfile: Profile | null
    activeTagFilter: string
    activeSortFilter: string
    setActiveSortFilter: (activeSortFilter: string) => void
    setActiveTagFilter: (activeTagFilter: string) => void
    setCurrentProfile: (profile: Profile | null) => void
    setUserSigNonce: (userSigNonce: number) => void
    setProfiles: (profiles: Profile[]) => void
    setShowCreateAccount: (showCreateAccount: boolean) => void
    setHasNewNotification: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
    profiles: [],
    showCreateAccount: false,
    hasNewNotification: false,
    userSigNonce: 0,
    currentProfile: null,
    activeTagFilter: 'all',
    activeSortFilter: 'commented',
    setActiveSortFilter: (activeSortFilter) => set(() => ({ activeSortFilter })),
    setActiveTagFilter: (activeTagFilter) => set(() => ({ activeTagFilter })),
    setCurrentProfile: (profile) => set(() => ({ currentProfile: profile })),
    setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
    setHasNewNotification: (b) => set(() => ({ hasNewNotification: b })),
    setShowCreateAccount: (showCreateAccount) => set(() => ({ showCreateAccount })),
    setProfiles: (profiles) => set(() => ({ profiles })),
}))

export default useAppStore