import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'
import { EmptyTab } from './shared'
import type { PublicHoliday } from '@/lib/types'

interface HolidaysTabProps {
  holidays: PublicHoliday[]
  search: string
}

export function HolidaysTab({ holidays, search }: HolidaysTabProps) {
  const q = search.toLowerCase()
  const filtered = holidays.filter((h) => h.name.toLowerCase().includes(q))

  if (holidays.length === 0) {
    return <EmptyTab icon={CalendarDays} message="No public holidays" sub="Holidays are managed in the Holidays section" />
  }

  if (filtered.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="pl-4">Holiday</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Replacement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((h) => (
            <TableRow key={h.id}>
              <TableCell className="pl-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50">
                    <CalendarDays className="h-4 w-4 text-pink-600" />
                  </div>
                  <span className="font-medium">{h.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(h.holiday_date)}
              </TableCell>
              <TableCell>
                <Badge variant={h.is_mandatory ? 'default' : 'outline'}>
                  {h.is_mandatory ? 'Mandatory' : 'Optional'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {h.is_replacement ? 'Yes' : 'No'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
