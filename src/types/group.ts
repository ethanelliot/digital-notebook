import type { Timestamp } from "firebase/firestore";

export type GroupColor = "blue"|"yellow"|"purple" 

export type Group = {
  id: string;
  name: string;
  isHidden: boolean;
  color: GroupColor;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
