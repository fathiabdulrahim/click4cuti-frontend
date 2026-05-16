import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  equipmentAssignmentsApi,
  type EquipmentAssignmentPayload,
} from '@/api/equipmentAssignments'

const ROOT = ['profile', 'equipment'] as const

export function useEquipmentAssignments() {
  return useQuery({
    queryKey: ROOT,
    queryFn: () => equipmentAssignmentsApi.list().then((r) => r.data),
  })
}

export function useCreateEquipmentAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      payload,
      file,
    }: {
      payload: EquipmentAssignmentPayload
      file?: File | null
    }) => equipmentAssignmentsApi.create(payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useUpdateEquipmentAssignment() {
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
    }) => equipmentAssignmentsApi.update(id, payload, file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useDeleteEquipmentAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => equipmentAssignmentsApi.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}
