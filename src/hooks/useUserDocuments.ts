import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userDocumentsApi } from '@/api/userDocuments'

const ROOT = ['profile', 'documents'] as const

export function useUserDocuments() {
  return useQuery({ queryKey: ROOT, queryFn: () => userDocumentsApi.list().then((r) => r.data) })
}

export function useCreateUserDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ remarks, file }: { remarks: string; file: File }) =>
      userDocumentsApi.create(remarks, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useUpdateUserDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, remarks, file }: { id: string; remarks?: string; file?: File }) =>
      userDocumentsApi.update(id, remarks, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useDeleteUserDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userDocumentsApi.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}
