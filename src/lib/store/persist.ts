import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  currentProfileId: string | null
  sidebarCollapsed: boolean
  notificationCount: number
  setNotificationCount: (count: number) => void
  setCurrentProfileId: (currentProfileId: string | null) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      currentProfileId: null,
      sidebarCollapsed: true,
      notificationCount: 0,
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