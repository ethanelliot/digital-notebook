
import type { DocumentReference, Timestamp } from "firebase/firestore";
import type { Group, GroupColor } from "./group";

export interface Notebook {
  id: string;
  name: string;
  groupId: string;
  groupRef: DocumentReference<Group>;
  groupColor:GroupColor;
  groupName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


export type NotebookDataFromFirestore = Omit<Notebook,"groupId"|"groupColor"|"groupName">
