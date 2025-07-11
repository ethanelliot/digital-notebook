import type { DocumentReference, Timestamp } from "firebase/firestore";
import type { Group, GroupColor } from "./group";

export type statusType = "In-progress" | "Completed" | "Not-started";

export interface Note {
  id: string;
  content: string;
  status: statusType;
  dueDate: Timestamp;
  groupRef: DocumentReference<Group>;
  groupId: string;
  groupName: string;
  groupColor: GroupColor;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};


export type NoteDataFromFirestore = Omit<Note,"groupId"|"groupName"|"groupColor"> // Removed Derived from the linked group