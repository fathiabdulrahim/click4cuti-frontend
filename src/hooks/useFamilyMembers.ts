import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { familyMembersApi, type FamilyMemberPayload } from '@/api/familyMembers'

const ROOT = ['profile', 'family-members'] as const

export function useFamilyMembers() {
  return useQuery({
    queryKey: ROOT,
    queryFn: () => familyMembersApi.list().then((r) => r.data),
  })
}

export function useCreateFamilyMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: FamilyMemberPayload) =>
      familyMembersApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useUpdateFamilyMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<FamilyMemberPayload> }) =>
      familyMembersApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useDeleteFamilyMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => familyMembersApi.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}
