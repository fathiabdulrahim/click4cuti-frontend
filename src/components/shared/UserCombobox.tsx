import { useQuery } from '@tanstack/react-query'
import { Combobox } from '@/components/ui/combobox'
import { api } from '@/api/axios'
import type { User } from '@/lib/types'

interface UserComboboxProps {
  value?: string | null
  onChange: (userId: string | null) => void
  placeholder?: string
  /** Use the admin endpoint (lists all users in tenant) instead of self-service. */
  admin?: boolean
  /** Exclude these user IDs from the dropdown (e.g. current user for supervisor pickers). */
  excludeIds?: string[]
}

export function UserCombobox({
  value,
  onChange,
  placeholder = 'Select a user',
  admin = false,
  excludeIds = [],
}: UserComboboxProps) {
  const { data: users = [] } = useQuery({
    queryKey: admin ? ['admin', 'users', 'list'] : ['users', 'list'],
    queryFn: () =>
      api
        .get<User[]>(admin ? '/admin/users' : '/admin/users') // admin only; future: self-service company directory
        .then((r) => (Array.isArray(r.data) ? r.data : (r.data as { data: User[] }).data)),
    staleTime: 5 * 60_000,
  })

  const options = users
    .filter((u) => !excludeIds.includes(u.id))
    .map((u) => ({ value: u.id, label: u.full_name }))

  return (
    <Combobox
      options={options}
      value={value ?? ''}
      onValueChange={(v) => onChange(v || null)}
      placeholder={placeholder}
      searchPlaceholder="Start typing to search..."
    />
  )
}
