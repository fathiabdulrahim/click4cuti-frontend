import { create } from 'zustand'
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

export const useAuthStore = create<AuthState>((set) => ({
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
}))
