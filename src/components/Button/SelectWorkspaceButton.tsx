import { ActionButton, ActionButtonProps } from '@/components'
import { selectWorkspaceDirectoryAtom, workspaceDirectoryAtom } from '@/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { LuFolderOpen } from 'react-icons/lu'

export const SelectWorkspaceButton = ({ ...props }: ActionButtonProps) => {
  const selectWorkspaceDirectory = useSetAtom(selectWorkspaceDirectoryAtom)
  const workspaceDirectory = useAtomValue(workspaceDirectoryAtom)

  const handleSelectWorkspace = async () => {
    await selectWorkspaceDirectory()
  }

  return (
    <ActionButton
      onClick={handleSelectWorkspace}
      title={workspaceDirectory ? `Choose folder\n${workspaceDirectory}` : 'Choose folder'}
      {...props}
    >
      <LuFolderOpen className='h-4 w-4 text-zinc-300' />
    </ActionButton>
  )
}
