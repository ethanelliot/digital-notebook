import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { Checkbox } from '@/components/ui/checkbox'

interface TaskItemAttrs {
  checked: boolean
}

export default function TaskItemNodeView({
  node,
  updateAttributes,
}: NodeViewProps) {
  const { checked } = node.attrs as TaskItemAttrs
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
  )
}
