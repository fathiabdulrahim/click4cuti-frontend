import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function toValidDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null
  const d = typeof date === 'string' ? parseISO(date) : date
  return d instanceof Date && !isNaN(d.getTime()) ? d : null
}

export function formatDate(date: string | Date | null | undefined): string {
  const d = toValidDate(date)
  return d ? format(d, 'dd MMM yyyy') : '—'
}

export function formatDateShort(date: string | Date | null | undefined): string {
  const d = toValidDate(date)
  return d ? format(d, 'dd/MM/yyyy') : '—'
}

export function formatDays(days: number): string {
  return `${days} ${days === 1 ? 'day' : 'days'}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
