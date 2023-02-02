import { BoardType, QueuedCommentType, QueuedPublicationType } from '@utils/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}

interface AppPerisistState {
  accessToken: Tokens['accessToken']
  refreshToken: Tokens['refreshToken']
  currentProfileId: string | null
  sidebarCollapsed: boolean
  notificationCount: number
  queuedComments: QueuedCommentType[]
  queuedPublications: QueuedPublicationType[]
  currentBoard: BoardType[] | string
  setCurrentBoard: (currentBoard: BoardType[] | string) => void
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void
  setQueuedPublications: (queuedPublications: QueuedPublicationType[]) => void
  setNotificationCount: (count: number) => void
  setCurrentProfileId: (currentProfileId: string | null) => void
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void
  signOut: () => void
  hydrateAuthTokens: () => Tokens
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      currentProfileId: null,
      sidebarCollapsed: true,
      notificationCount: 0,
      queuedComments: [],
      queuedPublications: [],
      currentBoard: [],
      setCurrentBoard: (currentBoard) => set({ currentBoard }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),
      setQueuedPublications: (queuedPublications) => set({ queuedPublications }),
      setNotificationCount: (notificationCount) => set({ notificationCount }),
      setCurrentProfileId: (currentProfileId) => set({ currentProfileId }),
      signIn: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      signOut: () => localStorage.removeItem('pinsta.store'),
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        }
      }
    }),
    {
      name: 'pinsta.store'
    }
  )
)

export default usePersistStore

export const signIn = (tokens: { accessToken: string; refreshToken: string }) => usePersistStore.getState().signIn(tokens)
export const signOut = () => usePersistStore.getState().signOut()
export const hydrateAuthTokens = () => usePersistStore.getState().hydrateAuthTokens()