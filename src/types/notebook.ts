import type { Group, GroupColor } from './group'
import type { DocumentReference, Timestamp } from 'firebase/firestore'

export interface Notebook {
  id: string
  name: string
  groupId: string
  groupRef: DocumentReference<Group>
  groupColor: GroupColor
  groupName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type NotebookDataFromFirestore = Omit<
  Notebook,
  'groupId' | 'groupColor' | 'groupName'
>
