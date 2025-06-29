import type { statusType } from "@/types/note";
import { CircleCheck, Clock, RefreshCcw } from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type StatusOption = {
  value: statusType;
  label: string;
  icon: LucideIcon;
};

export const statuses: StatusOption[] = [
  {
    value: "Not-started",
    label: "Not started",
    icon: Clock,
  },
  {
    value: "In-progress",
    label: "In progress",
    icon: RefreshCcw,
  },
  {
    value: "Completed",
    label: "Completed",
    icon: CircleCheck,
  }
];