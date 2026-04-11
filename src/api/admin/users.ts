import { api } from '../axios'
import type { User } from '@/lib/types'

export const adminUsersApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<User[]>('/admin/users', { params }),

  getOne: (id: string) =>
    api.get<User>(`/admin/users/${id}`),

  create: (payload: Record<string, unknown>) =>
    api.post<User>('/admin/users', { user: payload }),

  update: (id: string, payload: Record<string, unknown>) =>
    api.put<User>(`/admin/users/${id}`, { user: payload }),

  deactivate: (id: string) =>
    api.delete(`/admin/users/${id}`),
}
