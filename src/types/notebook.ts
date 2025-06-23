import type { JSONContent } from "@tiptap/react";
import type { Timestamp } from "firebase/firestore";

export interface NotebookData {
  title: string;
  content: JSONContent;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}