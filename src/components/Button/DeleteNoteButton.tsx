import { ActionButton, ActionButtonProps } from '@/components'
import { deleteNoteAtom, selectedNoteAtom } from '@/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { FaRegTrashCan } from 'react-icons/fa6'

export const DeleteNoteButton = ({ ...props }: ActionButtonProps) => {
  const deleteNote = useSetAtom(deleteNoteAtom)
  const selectedNote = useAtomValue(selectedNoteAtom)

  const handleDelete = async () => {
    await deleteNote()
  }

  return (
    <ActionButton
      onClick={handleDelete}
      disabled={!selectedNote?.title}
      className='disabled:cursor-not-allowed disabled:opacity-40'
      {...props}
    >
      <FaRegTrashCan className='h-4 w-4 text-zinc-300' />
    </ActionButton>
  )
}
