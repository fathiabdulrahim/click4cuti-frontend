import { api } from './axios'
import type { User } from '@/lib/types'

export const profileApi = {
  get: () => api.get<User>('/profile'),

  update: (payload: { full_name?: string; phone?: string; address?: string }) =>
    api.put<User>('/profile', payload),
}
