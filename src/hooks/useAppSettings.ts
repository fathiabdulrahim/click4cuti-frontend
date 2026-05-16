import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appSettingsApi } from '@/api/appSettings'
import type { AppSettings } from '@/lib/types'

const KEY = ['app-settings'] as const

export function useAppSettings() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => appSettingsApi.get().then((r) => r.data),
    staleTime: 5 * 60_000,
  })
}

export function useUpdateAppSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<AppSettings>) =>
      appSettingsApi.update(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
