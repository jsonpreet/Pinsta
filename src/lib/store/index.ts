import type { Profile } from '@utils/lens'
import { create } from 'zustand'
import { WMATIC_TOKEN_ADDRESS } from '@utils/constants'
import { CREATOR_CATEGORIES } from '@utils/data/categories'
import { CreatePin } from '@utils/custom-types'

export const UPLOADED_FORM_DEFAULTS = {
  stream: null,
  preview: '',
  imageType: '',
  file: null,
  title: '',
  description: '',
  imageSource: '',
  percent: 0,
  board: {id: '', name: '', slug: '', pfp: '', description: '', user_id: '', cover: '', is_private: false, category: '', tags: [], created_at: new Date(), updated_at: new Date()},
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  buttonText: 'Create',
  imageAltTag: '',
  category: CREATOR_CATEGORIES[0],
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: false,
    isFeeCollect: false,
    isRevertCollect: true
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  },
  isNSFW: false,
  isNSFWThumbnail: false,
}

interface AppState {
  showCreateAccount: boolean
  profiles: Profile[] | []
  hasNewNotification: boolean
  slideImageLoading: boolean
  userSigNonce: number
  currentProfile: Profile | null
  activeTagFilter: string
  activeSortFilter: string
  showCreateBoard: boolean
  showLoginModal: boolean
  showSearchModal: boolean
  createdPin: CreatePin
  setCreatePin: (pin: { [k: string]: any }) => void
  setShowSearchModal: (showSearchModal: boolean) => void
  setShowLoginModal: (showLoginModal: boolean) => void
  setSlideImageLoading: (slideImageLoading: boolean) => void
  setShowCreateBoard: (showCreateBoard: boolean) => void
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
  showCreateBoard: false,
  showLoginModal: false,
  slideImageLoading: true,
  showSearchModal: false,
  userSigNonce: 0,
  currentProfile: null,
  activeTagFilter: 'all',
  activeSortFilter: 'commented',
  createdPin: UPLOADED_FORM_DEFAULTS,
  setCreatePin: (pinData) =>
  set((state) => ({
    createdPin: { ...state.createdPin, ...pinData }
  })),
  setSlideImageLoading: (slideImageLoading) => set({ slideImageLoading }),
  setShowSearchModal: (showSearchModal) => set({ showSearchModal }),
  setShowLoginModal: (showLoginModal) => set({ showLoginModal }),
  setShowCreateBoard: (showCreateBoard) => set({ showCreateBoard }),
  setActiveSortFilter: (activeSortFilter) => set({ activeSortFilter }),
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setUserSigNonce: (userSigNonce) => set({ userSigNonce }),
  setHasNewNotification: (b) => set({ hasNewNotification: b }),
  setShowCreateAccount: (showCreateAccount) => set({ showCreateAccount }),
  setProfiles: (profiles) => set({ profiles }),
}))

export default useAppStore