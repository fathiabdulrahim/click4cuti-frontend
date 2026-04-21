import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center text-sm font-medium',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        button_previous: 'absolute left-1 top-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer',
        button_next: 'absolute right-1 top-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer',
        month_grid: 'w-full border-collapse space-x-1',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#FE4E01]/10 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[#FE4E01]/5',
        day_button: cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-md p-0 font-normal cursor-pointer',
          'hover:bg-[#FE4E01]/10 hover:text-[#FE4E01]',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FE4E01]',
          'aria-selected:bg-[#FE4E01] aria-selected:text-white aria-selected:hover:bg-[#FE4E01] aria-selected:hover:text-white aria-selected:focus:bg-[#FE4E01] aria-selected:focus:text-white',
        ),
        range_start: 'day-range-start rounded-l-md',
        range_end: 'day-range-end rounded-r-md',
        selected: 'bg-[#FE4E01] text-white hover:bg-[#FE4E01] hover:text-white focus:bg-[#FE4E01] focus:text-white',
        today: 'bg-muted text-foreground font-semibold',
        outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-[#FE4E01]/10 aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle: 'aria-selected:bg-[#FE4E01]/10 aria-selected:text-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
