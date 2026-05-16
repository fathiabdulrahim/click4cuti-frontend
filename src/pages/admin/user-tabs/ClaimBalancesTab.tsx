import { useState } from 'react'
import { SectionCard } from '@/components/shared/SectionCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUserClaimBalances } from '@/hooks/useClaims'

export default function ClaimBalancesTab({ userId }: { userId: string }) {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const { data = [], isLoading } = useUserClaimBalances(userId, year)

  return (
    <SectionCard
      title="Claim Balances"
      description="Year-to-date claim balances (read-only)"
      action={
        <div className="flex items-center gap-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Year</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value) || year)}
            className="w-24 h-8"
          />
        </div>
      }
      flush
    >
      <div>
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : data.length === 0 ? (
          <EmptyState title="No balances for this year" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Limit</TableHead>
                <TableHead className="text-right">Used</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.claim_type?.name ?? '—'}</TableCell>
                  <TableCell className="text-right">RM {Number(b.annual_limit).toFixed(2)}</TableCell>
                  <TableCell className="text-right">RM {Number(b.used_amount).toFixed(2)}</TableCell>
                  <TableCell className="text-right">RM {Number(b.pending_amount).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    RM {Number(b.remaining_amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </SectionCard>
  )
}
