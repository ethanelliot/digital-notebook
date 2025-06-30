import type { statusType } from "@/types/note";
import { CircleCheck, Clock, Eye, EyeOff, RefreshCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MAX_VISIBLE_GROUPS = 30;

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
  },
];
export type VisibilityOption = {
  value: boolean;
  label: string;
  icon: LucideIcon;
};

export const Visibility: VisibilityOption[] = [
  {
    value: false,
    label: "Visible",
    icon: Eye,
  },
  {
    value: true,
    label: "Hidden",
    icon: EyeOff ,
  },
];
