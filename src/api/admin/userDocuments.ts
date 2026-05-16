import { api } from '../axios'
import type { UserDocument } from '@/lib/types'

export const adminUserDocumentsApi = {
  list: (userId: string) => api.get<UserDocument[]>(`/admin/users/${userId}/user_documents`),
  create: (userId: string, remarks: string, file: File) => {
    const fd = new FormData()
    fd.append('remarks', remarks)
    fd.append('file', file)
    return api.post<UserDocument>(`/admin/users/${userId}/user_documents`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  update: (userId: string, id: string, remarks?: string, file?: File) => {
    const fd = new FormData()
    if (remarks !== undefined) fd.append('remarks', remarks)
    if (file) fd.append('file', file)
    return api.patch<UserDocument>(`/admin/users/${userId}/user_documents/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  destroy: (userId: string, id: string) =>
    api.delete(`/admin/users/${userId}/user_documents/${id}`),
}
