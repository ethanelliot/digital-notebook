import type { DocumentReference, Timestamp } from "firebase/firestore";
import type { GroupColor } from "./group";

export type statusType = "In-progress" | "Completed" | "Not-started";

export type Note = {
  id: string;
  content: string;
  status: statusType;
  dueDate: Timestamp;
  groupRef: DocumentReference;
  groupId: string;
  groupName: string;
  groupColor: GroupColor;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
