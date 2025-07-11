import type { LucideIcon } from 'lucide-react'

export interface FilterOption {
  label: string
  value: unknown
  color?: string
  icon?: LucideIcon //todo impliment this
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    label?: string
    placeholder?: string
    variant?: 'text' | 'select' | 'multiSelect'
    options?: FilterOption[]
    headerClassName?: string
    cellClassName?: string
  }
}
