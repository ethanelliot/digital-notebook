import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemNodeViewProps {
  node: {
    attrs: {
      checked: boolean;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  updateAttributes: (attrs: { checked: boolean }) => void;
}

export default function TaskItemNodeView({
  node,
  updateAttributes,
}: TaskItemNodeViewProps) {
  const checked = node.attrs.checked;

  return (
    <NodeViewWrapper as="li" className="flex items-center gap-2">
      <div className="flex items-center">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) =>
            updateAttributes({ checked: checked === true })
          }
        />
      </div>
      <div className="flex-1">
        <NodeViewContent as="div" />
      </div>
    </NodeViewWrapper>
  );
}
