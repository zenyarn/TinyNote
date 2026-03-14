import { noteNameDialogAtom, selectedNoteAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const setNoteNameDialog = useSetAtom(noteNameDialogAtom)

  if (!selectedNote) return null

  const handleRenameStart = () => {
    setNoteNameDialog({
      mode: 'rename',
      initialValue: selectedNote.title
    })
  }

  return (
    <div
      className={twMerge('pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center', className)}
      {...props}
    >
      <button
        type='button'
        onClick={handleRenameStart}
        className='pointer-events-auto min-w-[180px] rounded-md border border-white/8 bg-transparent px-4 py-1 text-center text-gray-400 transition hover:border-white/15 hover:bg-white/[0.03] hover:text-zinc-200'
        title='Rename note'
      >
        {selectedNote.title}
      </button>
    </div>
  )
}
