import type { Timestamp } from "firebase/firestore";

export type Note = {
  id: string;
  content: string;
  status: "In-progress" | "Completed" | "Not-started";
  dueDate: Timestamp;
  group: string;
};