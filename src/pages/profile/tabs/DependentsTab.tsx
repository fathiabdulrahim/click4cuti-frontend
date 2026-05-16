import { useState } from 'react'
import { CrudListPage } from '@/components/shared/CrudListPage'
import { Badge } from '@/components/ui/badge'
import {
  useFamilyMembers,
  useCreateFamilyMember,
  useUpdateFamilyMember,
  useDeleteFamilyMember,
} from '@/hooks/useFamilyMembers'
import { FamilyMemberDialog, type FamilyMemberFormValues } from './FamilyMemberDialog'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import { ENUM_LABELS, upperEnum } from '@/lib/enums'
import type { FamilyMember, FamilyRelation, FamilyEmploymentStatus } from '@/lib/types'

export default function DependentsTab() {
  const { data, isLoading } = useFamilyMembers()
  const create = useCreateFamilyMember()
  const update = useUpdateFamilyMember()
  const remove = useDeleteFamilyMember()
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<FamilyMember | null>(null)

  function handleSubmit(values: FamilyMemberFormValues) {
    const payload = {
      ...values,
      last_name: values.last_name || null,
      nric_or_passport: values.nric_or_passport || null,
      phone: values.phone || null,
      email: values.email || null,
      address: values.address || null,
    }
    const after = () => {
      addToast({ title: editing ? 'Dependent updated' : 'Dependent added', variant: 'success' })
      setDialogOpen(false)
      setEditing(null)
    }
    if (editing) {
      update.mutate({ id: editing.id, payload }, { onSuccess: after })
    } else {
      create.mutate(payload, { onSuccess: after })
    }
  }

  function handleDelete(row: FamilyMember) {
    if (!confirm(`Remove "${row.first_name}"?`)) return
    remove.mutate(row.id, {
      onSuccess: () => addToast({ title: 'Removed', variant: 'success' }),
    })
  }

  return (
    <>
      <CrudListPage<FamilyMember>
        title="Dependents"
        description="Spouse, children, parents — used for compassionate leave and tax relief"
        data={data}
        isLoading={isLoading}
        columns={[
          {
            key: 'relation',
            header: 'Relation',
            render: (r) => (
              <Badge variant="secondary">
                {ENUM_LABELS.family_relation[upperEnum<FamilyRelation>(r.relation) ?? 'CHILD']}
              </Badge>
            ),
          },
          {
            key: 'name',
            header: 'Name',
            render: (r) => `${r.first_name}${r.last_name ? ' ' + r.last_name : ''}`,
          },
          {
            key: 'gender',
            header: 'Gender',
            render: (r) => (String(r.gender).toUpperCase() === 'MALE' ? 'Male' : 'Female'),
          },
          { key: 'dob', header: 'Date of Birth', render: (r) => formatDate(r.date_of_birth) },
          {
            key: 'employment',
            header: 'Employment',
            render: (r) =>
              ENUM_LABELS.family_employment_status[
                upperEnum<FamilyEmploymentStatus>(r.employment_status) ?? 'NOT_WORKING'
              ],
          },
          {
            key: 'oku',
            header: 'OKU',
            render: (r) => (r.oku_status ? <Badge variant="default">OKU</Badge> : '—'),
          },
        ]}
        onCreate={() => {
          setEditing(null)
          setDialogOpen(true)
        }}
        onEdit={(row) => {
          setEditing(row)
          setDialogOpen(true)
        }}
        onDelete={handleDelete}
        emptyMessage="No dependents added yet"
      />
      <FamilyMemberDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o)
          if (!o) setEditing(null)
        }}
        initial={editing}
        onSubmit={handleSubmit}
        isSubmitting={create.isPending || update.isPending}
      />
    </>
  )
}
