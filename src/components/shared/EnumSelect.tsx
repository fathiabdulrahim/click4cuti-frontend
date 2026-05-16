import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { enumOptions } from '@/lib/enums'

interface EnumSelectProps<T extends string> {
  options: Readonly<Record<T, string>>
  value?: T | null
  onChange: (value: T | null) => void
  placeholder?: string
  disabled?: boolean
  /** If true, surfaces a "(none)" item that clears the value. */
  allowEmpty?: boolean
}

export function EnumSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  disabled,
  allowEmpty = false,
}: EnumSelectProps<T>) {
  const items = enumOptions(options)

  return (
    <Select
      value={value ?? '__none__'}
      onValueChange={(v) => onChange(v === '__none__' ? null : (v as T))}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && <SelectItem value="__none__">(none)</SelectItem>}
        {items.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
