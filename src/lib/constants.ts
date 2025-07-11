import type { GroupColor } from '@/types/group'
import type { statusType } from '@/types/note'
import { CircleCheck, Clock, Eye, EyeOff, RefreshCcw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const MAX_VISIBLE_GROUPS = 30 // this is a hard limit set by the firebase in query

export interface StatusOption {
  value: statusType
  label: string
  icon: LucideIcon
}

export const statuses: StatusOption[] = [
  {
    value: 'Not-started',
    label: 'Not started',
    icon: Clock,
  },
  {
    value: 'In-progress',
    label: 'In progress',
    icon: RefreshCcw,
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: CircleCheck,
  },
]

export interface VisibilityOption {
  value: boolean
  label: string
  icon: LucideIcon
}

export const visibility: VisibilityOption[] = [
  {
    value: false,
    label: 'Visible',
    icon: Eye,
  },
  {
    value: true,
    label: 'Hidden',
    icon: EyeOff,
  },
]

export interface GroupColorOption {
  value: string
  label: string
  background: string
  text: string
  border: string
}

export const groupColors: Record<GroupColor, GroupColorOption> = {
  blue: {
    value: 'blue',
    label: 'Blue',
    background: 'bg-blue-200 dark:bg-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-800 dark:border-blue-200',
  },
  yellow: {
    value: 'yellow',
    label: 'Yellow',
    background: 'bg-yellow-200 dark:bg-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-800 dark:border-yellow-200',
  },
  purple: {
    value: 'purple',
    label: 'Purple',
    background: 'bg-purple-200 dark:bg-purple-800',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-800 dark:border-purple-200',
  },
  green: {
    value: 'green',
    label: 'Green',
    background: 'bg-green-200 dark:bg-green-800',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-800 dark:border-green-200',
  },
  red: {
    value: 'red',
    label: 'Red',
    background: 'bg-red-200 dark:bg-red-800',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-800 dark:border-red-200',
  },
}

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
