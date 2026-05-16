import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminFamilyMembersApi } from '@/api/admin/familyMembers'
import type { FamilyMemberPayload } from '@/api/familyMembers'

const key = (userId: string) => ['admin', 'users', userId, 'family-members'] as const

export function useAdminFamilyMembers(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => adminFamilyMembersApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useAdminCreateFamilyMember(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: FamilyMemberPayload) =>
      adminFamilyMembersApi.create(userId, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminUpdateFamilyMember(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<FamilyMemberPayload> }) =>
      adminFamilyMembersApi.update(userId, id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminDeleteFamilyMember(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminFamilyMembersApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}
