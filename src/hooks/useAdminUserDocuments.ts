import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUserDocumentsApi } from '@/api/admin/userDocuments'

const key = (userId: string) => ['admin', 'users', userId, 'documents'] as const

export function useAdminUserDocuments(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => adminUserDocumentsApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useAdminCreateUserDocument(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ remarks, file }: { remarks: string; file: File }) =>
      adminUserDocumentsApi.create(userId, remarks, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminUpdateUserDocument(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, remarks, file }: { id: string; remarks?: string; file?: File }) =>
      adminUserDocumentsApi.update(userId, id, remarks, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminDeleteUserDocument(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminUserDocumentsApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}
