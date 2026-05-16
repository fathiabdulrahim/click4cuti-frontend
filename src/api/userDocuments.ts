import { api } from './axios'
import type { UserDocument } from '@/lib/types'

export const userDocumentsApi = {
  list: () => api.get<UserDocument[]>('/user_documents'),
  create: (remarks: string, file: File) => {
    const fd = new FormData()
    fd.append('remarks', remarks)
    fd.append('file', file)
    return api.post<UserDocument>('/user_documents', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  update: (id: string, remarks?: string, file?: File) => {
    const fd = new FormData()
    if (remarks !== undefined) fd.append('remarks', remarks)
    if (file) fd.append('file', file)
    return api.patch<UserDocument>(`/user_documents/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  destroy: (id: string) => api.delete(`/user_documents/${id}`),
}
