import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminWarningLettersApi, type WarningLetterPayload } from '@/api/admin/warningLetters'

const LIST = ['admin', 'warning-letters', 'list'] as const

export function useAdminWarningLetters() {
  return useQuery({
    queryKey: LIST,
    queryFn: () => adminWarningLettersApi.getAll().then((r) => r.data),
  })
}

export function useAdminWarningLettersForUser(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId, 'warning-letters'],
    queryFn: () =>
      adminWarningLettersApi.getAll().then((r) => r.data.filter((w) => w.user_id === userId)),
    enabled: !!userId,
  })
}

export function useCreateWarningLetter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, file }: { payload: WarningLetterPayload; file?: File | null }) =>
      adminWarningLettersApi.create(payload, file).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: LIST })
      qc.invalidateQueries({
        queryKey: ['admin', 'users', variables.payload.user_id, 'warning-letters'],
      })
    },
  })
}
