import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean | ((date: Date) => boolean)
  className?: string
  minDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  className,
  minDate,
}: DatePickerProps) {
  const isButtonDisabled = typeof disabled === 'boolean' ? disabled : false

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={isButtonDisabled}
          className={cn(
            'w-full justify-start text-left font-normal cursor-pointer',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd MMM yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={typeof disabled === 'function' ? disabled : minDate ? (date) => date < minDate : undefined}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
