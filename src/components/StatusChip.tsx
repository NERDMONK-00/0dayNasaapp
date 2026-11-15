type StatusVariant = 'normal' | 'warning' | 'critical'

interface StatusChipProps {
  status: StatusVariant
  label: string
}

export function StatusChip({ status, label }: StatusChipProps) {
  const styles = {
    normal: 'border-emerald-400/25 bg-emerald-50 text-emerald-200',
    warning: 'border-amber-400/25 bg-amber-50 text-amber-700',
    critical: 'border-rose-400/25 bg-rose-50 text-rose-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${styles[status]}`}>
      {label}
    </span>
  )
}
