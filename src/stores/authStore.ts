import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AdminUser } from '@/lib/types'

interface AuthState {
  accessToken: string | null
  user: User | null
  adminUser: AdminUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  setAdminAuth: (token: string, adminUser: AdminUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      adminUser: null,
      isAuthenticated: false,

      setAuth: (token, user) =>
        set({ accessToken: token, user, adminUser: null, isAuthenticated: true }),

      setAdminAuth: (token, adminUser) =>
        set({ accessToken: token, adminUser, user: null, isAuthenticated: true }),

      clearAuth: () =>
        set({ accessToken: null, user: null, adminUser: null, isAuthenticated: false }),
    }),
    {
      name: 'click4cuti-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        adminUser: state.adminUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
