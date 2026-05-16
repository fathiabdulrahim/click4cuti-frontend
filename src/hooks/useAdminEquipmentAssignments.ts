import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminEquipmentAssignmentsApi } from '@/api/admin/equipmentAssignments'
import type { EquipmentAssignmentPayload } from '@/api/equipmentAssignments'

const key = (userId: string) => ['admin', 'users', userId, 'equipment'] as const

export function useAdminEquipmentAssignments(userId: string) {
  return useQuery({
    queryKey: key(userId),
    queryFn: () => adminEquipmentAssignmentsApi.list(userId).then((r) => r.data),
    enabled: !!userId,
  })
}

export function useAdminCreateEquipmentAssignment(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      payload,
      file,
    }: { payload: EquipmentAssignmentPayload; file?: File | null }) =>
      adminEquipmentAssignmentsApi.create(userId, payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminUpdateEquipmentAssignment(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
      file,
    }: {
      id: string
      payload: Partial<EquipmentAssignmentPayload>
      file?: File | null
    }) => adminEquipmentAssignmentsApi.update(userId, id, payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}

export function useAdminDeleteEquipmentAssignment(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminEquipmentAssignmentsApi.destroy(userId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(userId) }),
  })
}
