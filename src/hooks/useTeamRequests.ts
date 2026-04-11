import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamRequestsApi } from '@/api/teamRequests'

export function useTeamRequests() {
  return useQuery({
    queryKey: ['team_requests'],
    queryFn: () => teamRequestsApi.getAll().then((r) => r.data),
  })
}

export function useUpdateTeamRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; status: string; reviewer_remarks?: string }) =>
      teamRequestsApi.update(id, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team_requests'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
