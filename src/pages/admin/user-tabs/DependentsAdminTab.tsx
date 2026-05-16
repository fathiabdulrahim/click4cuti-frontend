import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { FamilyMemberDialog, type FamilyMemberFormValues } from '@/pages/profile/tabs/FamilyMemberDialog'
import {
  useAdminFamilyMembers,
  useAdminCreateFamilyMember,
  useAdminUpdateFamilyMember,
  useAdminDeleteFamilyMember,
} from '@/hooks/useAdminFamilyMembers'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/lib/utils'
import { ENUM_LABELS, upperEnum } from '@/lib/enums'
import type { FamilyMember, FamilyRelation, FamilyEmploymentStatus } from '@/lib/types'

export default function DependentsAdminTab({ userId }: { userId: string }) {
  const { data = [], isLoading } = useAdminFamilyMembers(userId)
  const create = useAdminCreateFamilyMember(userId)
  const update = useAdminUpdateFamilyMember(userId)
  const remove = useAdminDeleteFamilyMember(userId)
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

  return (
    <>
      <SectionCard
        title="Dependents"
        description="Spouse, children, parents — used for compassionate leave and tax relief"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true) }}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add dependent
          </Button>
        }
        flush
      >
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : data.length === 0 ? (
          <EmptyState title="No dependents yet" message="Add a dependent to enable compassionate leave eligibility." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="pl-6">Relation</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>OKU</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6">
                    <Badge variant="secondary">
                      {ENUM_LABELS.family_relation[upperEnum<FamilyRelation>(r.relation) ?? 'CHILD']}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {r.first_name}{r.last_name ? ' ' + r.last_name : ''}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {String(r.gender).toUpperCase() === 'MALE' ? 'Male' : 'Female'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.date_of_birth)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {ENUM_LABELS.family_employment_status[upperEnum<FamilyEmploymentStatus>(r.employment_status) ?? 'NOT_WORKING']}
                  </TableCell>
                  <TableCell>{r.oku_status ? <Badge variant="default">OKU</Badge> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setDialogOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Remove "${r.first_name}"?`)) {
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
      <FamilyMemberDialog
        open={dialogOpen}
        onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null) }}
        initial={editing}
        onSubmit={handleSubmit}
        isSubmitting={create.isPending || update.isPending}
      />
    </>
  )
}
