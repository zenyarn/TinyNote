import { ActionButton, ActionButtonProps } from '@/components'
import { noteNameDialogAtom, selectedNoteAtom } from '@/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { LuPencilLine } from 'react-icons/lu'

export const RenameNoteButton = ({ ...props }: ActionButtonProps) => {
  const setNoteNameDialog = useSetAtom(noteNameDialogAtom)
  const selectedNote = useAtomValue(selectedNoteAtom)

  const handleRename = async () => {
    if (!selectedNote?.title) return

    setNoteNameDialog({
      mode: 'rename',
      initialValue: selectedNote.title
    })
  }

  return (
    <ActionButton
      onClick={handleRename}
      disabled={!selectedNote?.title}
      title='Rename note'
      className='disabled:cursor-not-allowed disabled:opacity-40'
      {...props}
    >
      <LuPencilLine className='h-4 w-4 text-zinc-300' />
    </ActionButton>
  )
}
