import type { Timestamp } from 'firebase/firestore'

export type GroupColor = 'blue' | 'yellow' | 'purple' | 'green' | 'red'

export interface Group {
  id: string
  name: string
  isHidden: boolean
  color: GroupColor
  createdAt: Timestamp
  updatedAt: Timestamp
}
