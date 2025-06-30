import type { DocumentReference, Timestamp } from "firebase/firestore";

export type statusType = "In-progress" | "Completed" | "Not-started";

export type Note = {
  id: string;
  content: string;
  status: statusType;
  dueDate: Timestamp;
  groupRef: DocumentReference;
  groupName: string;
  groupId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
