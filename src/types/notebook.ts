
import type { DocumentReference, Timestamp } from "firebase/firestore";
import type { GroupColor } from "./group";

export interface Notebook {
  id: string;
  name: string;
  groupId: string;
  groupRef: DocumentReference;
  groupColor:GroupColor;
  groupName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type NotebookMetaData = Omit<Notebook, "content">;
