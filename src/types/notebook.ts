import type { JSONContent } from "@tiptap/react";
import type { DocumentReference, Timestamp } from "firebase/firestore";

export interface Notebook {
  id: string;
  name: string;
  content: JSONContent;
  groupRef: DocumentReference;
  groupName: string;
  groupId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type NotebookMetaData = Omit<Notebook, "content">;
