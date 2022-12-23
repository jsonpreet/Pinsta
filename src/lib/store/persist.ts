import { QueuedCommentType } from '@utils/custom-types'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  currentProfileId: string | null
  sidebarCollapsed: boolean
  notificationCount: number
  queuedComments: QueuedCommentType[]
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void
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
      setQueuedComments: (queuedComments) => set(() => ({ queuedComments })),
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