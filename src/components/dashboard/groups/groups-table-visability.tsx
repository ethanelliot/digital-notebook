import { Button } from '@/components/ui/button'
import { useWorkspaceContext } from '@/contexts/workspace-context'
import type { Group } from '@/types/group'
import { Eye, EyeOff } from 'lucide-react'
import React, { useCallback } from 'react'

interface GroupsTableVisabilityProps {
  group: Group
}

const GroupsTableVisability: React.FC<GroupsTableVisabilityProps> = ({
  group,
}) => {
  const { updateGroup } = useWorkspaceContext()
  const toggleVisability = useCallback(() => {
    void updateGroup({ group: group, newData: { isHidden: !group.isHidden } })
  }, [group, updateGroup])

  return (
    <Button variant={'ghost'} onClick={() => toggleVisability()}>
      {group.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
    </Button>
  )
}

export default GroupsTableVisability
