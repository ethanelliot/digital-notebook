import type { Timestamp } from "firebase/firestore";

export type Group = {
  id: string;
  name:string;
  isHidden:boolean;
  createdOn: Timestamp;
};