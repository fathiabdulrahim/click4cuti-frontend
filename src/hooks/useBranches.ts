import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { branchesApi, type BranchPayload } from '@/api/admin/branches'

const ROOT = ['admin', 'branches', 'list'] as const

export function useBranches() {
  return useQuery({
    queryKey: ROOT,
    queryFn: () => branchesApi.list().then((r) => r.data),
    staleTime: 5 * 60_000,
  })
}

export function useCreateBranch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: BranchPayload) => branchesApi.create(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useUpdateBranch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BranchPayload> }) =>
      branchesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useDeleteBranch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => branchesApi.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT }),
  })
}
