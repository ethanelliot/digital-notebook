import type { Timestamp } from "firebase/firestore";

export type statusType = "In-progress" | "Completed" | "Not-started";

export type Note = {
  id: string;
  content: string;
  status: statusType;
  dueDate: Timestamp;
  groupName: string;
  groupId: string;
};