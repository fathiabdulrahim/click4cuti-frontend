import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { SectionCard } from '@/components/shared/SectionCard'
import { WorkExperienceDialog, type WorkExperienceFormValues } from '@/pages/profile/tabs/WorkExperienceDialog'
import {
  useAdminWorkExperiences,
  useAdminCreateWorkExperience,
  useAdminUpdateWorkExperience,
  useAdminDeleteWorkExperience,
} from '@/hooks/useAdminWorkExperiences'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import type { WorkExperience } from '@/lib/types'

export default function WorkExperienceAdminTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useAdminWorkExperiences(userId)
  const create = useAdminCreateWorkExperience(userId)
  const update = useAdminUpdateWorkExperience(userId)
  const remove = useAdminDeleteWorkExperience(userId)
  const addToast = useNotificationStore((s) => s.addToast)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<WorkExperience | null>(null)

  function handleSubmit(values: WorkExperienceFormValues) {
    const payload = { ...values, end_date: values.end_date || null }
    const after = () => {
      addToast({ title: editing ? 'Updated' : 'Added', variant: 'success' })
      setOpen(false)
      setEditing(null)
    }
    if (editing) {
      update.mutate({ id: editing.id, payload }, { onSuccess: after })
    } else {
      create.mutate(payload, { onSuccess: after })
    }
  }

  return (
    <>
      <SectionCard
        title="Work Experience"
        description="Previous companies and roles"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setOpen(true) }}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add experience
          </Button>
        }
        flush
      >
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : data.length === 0 ? (
          <EmptyState title="No work history yet" message="Add previous roles to build the employee's career history." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-6">Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-medium">{r.company_name}</TableCell>
                  <TableCell>{r.position}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.start_date)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.end_date)}</TableCell>
                  <TableCell className="text-muted-foreground">{r.period ?? '—'}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete "${r.company_name}"?`)) {
                          remove.mutate(r.id, { onSuccess: () => addToast({ title: 'Removed', variant: 'success' }) })
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
      <WorkExperienceDialog
        open={open}
        onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null) }}
        initial={editing}
        onSubmit={handleSubmit}
        isSubmitting={create.isPending || update.isPending}
      />
    </>
  )
}
