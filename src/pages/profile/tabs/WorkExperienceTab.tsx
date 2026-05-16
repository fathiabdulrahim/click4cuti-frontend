import { useState } from 'react'
import { CrudListPage } from '@/components/shared/CrudListPage'
import {
  useWorkExperiences,
  useCreateWorkExperience,
  useDeleteWorkExperience,
  useUpdateWorkExperience,
} from '@/hooks/useWorkExperiences'
import { WorkExperienceDialog, type WorkExperienceFormValues } from './WorkExperienceDialog'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import type { WorkExperience } from '@/lib/types'

export default function WorkExperienceTab() {
  const { data, isLoading } = useWorkExperiences()
  const create = useCreateWorkExperience()
  const update = useUpdateWorkExperience()
  const remove = useDeleteWorkExperience()
  const addToast = useNotificationStore((s) => s.addToast)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<WorkExperience | null>(null)

  function handleSubmit(values: WorkExperienceFormValues) {
    const payload = { ...values, end_date: values.end_date || null }
    if (editing) {
      update.mutate(
        { id: editing.id, payload },
        {
          onSuccess: () => {
            addToast({ title: 'Updated', variant: 'success' })
            setDialogOpen(false)
            setEditing(null)
          },
          onError: () => addToast({ title: 'Error', variant: 'destructive' }),
        },
      )
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          addToast({ title: 'Added', variant: 'success' })
          setDialogOpen(false)
        },
        onError: () => addToast({ title: 'Error', variant: 'destructive' }),
      })
    }
  }

  function handleDelete(row: WorkExperience) {
    if (!confirm(`Delete entry for "${row.company_name}"?`)) return
    remove.mutate(row.id, {
      onSuccess: () => addToast({ title: 'Removed', variant: 'success' }),
      onError: () => addToast({ title: 'Error', variant: 'destructive' }),
    })
  }

  return (
    <>
      <CrudListPage<WorkExperience>
        title="Work Experience"
        description="Previous companies and roles"
        data={data}
        isLoading={isLoading}
        columns={[
          { key: 'company', header: 'Company', render: (r) => r.company_name },
          { key: 'position', header: 'Position', render: (r) => r.position },
          { key: 'start', header: 'Start', render: (r) => formatDate(r.start_date) },
          { key: 'end', header: 'End', render: (r) => formatDate(r.end_date) },
          { key: 'period', header: 'Period', render: (r) => r.period ?? '—' },
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
        emptyMessage="No work experience entries yet"
      />
      <WorkExperienceDialog
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
