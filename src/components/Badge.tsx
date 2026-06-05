// ─── Status / severity badge ──────────────────────────────────────────────────
type Variant = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray'

const variants: Record<Variant, { bg: string; text: string }> = {
  green:  { bg: '#f0fdf4', text: '#16a34a' },
  red:    { bg: '#fef2f2', text: '#dc2626' },
  yellow: { bg: '#fffbeb', text: '#d97706' },
  blue:   { bg: '#eff6ff', text: '#2563eb' },
  purple: { bg: '#faf5ff', text: '#7c3aed' },
  gray:   { bg: '#f9fafb', text: '#6b7280' },
}

interface BadgeProps { children: React.ReactNode; variant?: Variant }

export function Badge({ children, variant = 'green' }: BadgeProps) {
  const { bg, text } = variants[variant]
  return (
    <span style={{ background: bg, color: text, fontSize: 10, fontWeight: 600,
      padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}
