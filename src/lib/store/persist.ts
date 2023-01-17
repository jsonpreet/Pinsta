import { BoardType, QueuedCommentType, QueuedPublicationType } from '@utils/custom-types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
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
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      currentProfileId: null,
      sidebarCollapsed: true,
      notificationCount: 0,
      queuedComments: [],
      queuedPublications: [],
      currentBoard: [],
      setCurrentBoard: (currentBoard) => set(() => ({ currentBoard })),
      setQueuedComments: (queuedComments) => set(() => ({ queuedComments })),
      setQueuedPublications: (queuedPublications) => set(() => ({ queuedPublications })),
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      setCurrentProfileId: (id) => set(() => ({ currentProfileId: id })),
    }),
    {
      name: 'pinsta.store'
    }
  )
)

export default usePersistStore