type StatusVariant = 'normal' | 'warning' | 'critical'

interface StatusChipProps {
  status: StatusVariant
  label: string
}

export function StatusChip({ status, label }: StatusChipProps) {
  const styles = {
    normal: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200',
    warning: 'border-amber-400/25 bg-amber-500/10 text-amber-200',
    critical: 'border-rose-400/25 bg-rose-500/10 text-rose-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${styles[status]}`}>
      {label}
    </span>
  )
}
