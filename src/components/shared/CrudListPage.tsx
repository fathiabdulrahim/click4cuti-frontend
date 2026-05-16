import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'
import { EmptyState } from './EmptyState'

export interface CrudColumn<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

interface CrudListPageProps<T> {
  title: string
  description?: string
  data: T[] | undefined
  isLoading?: boolean
  columns: CrudColumn<T>[]
  onCreate?: () => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  emptyMessage?: string
  emptyAction?: React.ReactNode
}

export function CrudListPage<T extends { id: string }>({
  title,
  description,
  data,
  isLoading,
  columns,
  onCreate,
  onEdit,
  onDelete,
  emptyMessage = 'No data yet',
  emptyAction,
}: CrudListPageProps<T>) {
  const showActions = Boolean(onEdit || onDelete)
  const rows = data ?? []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {onCreate && (
          <Button onClick={onCreate} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : rows.length === 0 ? (
          <EmptyState message={emptyMessage} action={emptyAction} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.key} className={c.className}>
                    {c.header}
                  </TableHead>
                ))}
                {showActions && <TableHead className="w-24 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.render(row)}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell className="text-right space-x-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(row)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(row)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
