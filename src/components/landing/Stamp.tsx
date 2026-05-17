import { brand } from './brand'

interface StampProps {
  children: React.ReactNode
  color?: string
  textColor?: string
  rotate?: number
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

const sizeMap = {
  sm: { fs: 11, py: 4, px: 10, br: 4 },
  md: { fs: 13, py: 6, px: 14, br: 6 },
  lg: { fs: 15, py: 8, px: 18, br: 8 },
} as const

export function Stamp({
  children,
  color = brand.orange,
  textColor = '#fff',
  rotate = 0,
  size = 'md',
  style,
}: StampProps) {
  const s = sizeMap[size]
  return (
    <span
      style={{
        display: 'inline-block',
        background: color,
        color: textColor,
        fontSize: s.fs,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: `${s.py}px ${s.px}px`,
        borderRadius: s.br,
        border: '2px solid #000',
        boxShadow: '3px 3px 0 #000',
        transform: `rotate(${rotate}deg)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
