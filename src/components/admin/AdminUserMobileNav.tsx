import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ADMIN_USER_NAV } from './adminUserNav'

interface Props {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function AdminUserMobileNav({ value, onChange, className }: Props) {
  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select section" />
        </SelectTrigger>
        <SelectContent>
          {ADMIN_USER_NAV.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel className="text-[10px] uppercase tracking-wider">
                {group.label}
              </SelectLabel>
              {group.items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
