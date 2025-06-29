import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Visibility } from "@/lib/constants";
import type { Group } from "@/types/group";
import { AlertCircleIcon } from "lucide-react";
import { forwardRef, useState } from "react";

interface GroupFormProps {
  onSubmit: (data: Omit<Group, "id">) => void;
  initialData?: Omit<Group, "id">;
}

export const GroupForm = forwardRef<HTMLFormElement, GroupFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const [formData, setFormData] = useState({
      name: initialData?.name || "",
      isHidden: initialData?.isHidden || false,
    });

    const [error, setError] = useState("");
    const handleSubmit = () => {
      if (!formData.name) {
        setError("Name cannot be empty");
      } else {
        setError("");
        onSubmit({
          name: formData.name,
          isHidden: formData.isHidden,
        });
      }
    };

    return (
      <form
        ref={ref}
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {error && (
          <div className="text-destructive flex gap-2 items-center mx-2 text-sm">
            <AlertCircleIcon size={16} />
            <span>{error} </span>
          </div>
        )}
        <div className="grid gap-3">
          <Label htmlFor="name-1">Content</Label>
          <Input
            id="name-1"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="Visibility-picker" className="px-1">
            Visability
          </Label>
          <Select
            value={String(formData.isHidden)}
            onValueChange={(value: string) =>
              setFormData((prev) => ({ ...prev, isHidden: value === "true" }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Visibility.map((value) => (
                <SelectItem
                  value={String(value.value)}
                  key={String(value.value)}
                >
                  <value.icon />
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
    );
  }
);
