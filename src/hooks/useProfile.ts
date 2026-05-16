import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi, type ProfileUpdatePayload } from '@/api/profile'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get().then((r) => r.data),
    staleTime: 5 * 60_000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) =>
      profileApi.update(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
