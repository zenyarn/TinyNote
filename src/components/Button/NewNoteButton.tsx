import { ActionButton, ActionButtonProps } from '@/components'
import { noteNameDialogAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { LuFileSignature } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  const setNoteNameDialog = useSetAtom(noteNameDialogAtom)

  const handleCreation = async () => {
    setNoteNameDialog({
      mode: 'create',
      initialValue: 'Untitled'
    })
  }

  return (
    <ActionButton onClick={handleCreation} {...props}>
      <LuFileSignature className='h-4 w-4 text-zinc-300' />
    </ActionButton>
  )
}
