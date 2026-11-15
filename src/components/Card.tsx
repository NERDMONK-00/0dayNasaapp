import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-[24px] border border-white/15/80 bg-[#111d2d] ${className}`}>
      {children}
    </div>
  )
}
