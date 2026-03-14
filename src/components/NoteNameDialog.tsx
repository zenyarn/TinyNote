import { createEmptyNoteAtom, noteNameDialogAtom, renameSelectedNoteAtom } from '@/store'
import { useAtom, useSetAtom } from 'jotai'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

export const NoteNameDialog = () => {
  const [dialogState, setDialogState] = useAtom(noteNameDialogAtom)
  const createEmptyNote = useSetAtom(createEmptyNoteAtom)
  const renameSelectedNote = useSetAtom(renameSelectedNoteAtom)
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(dialogState?.initialValue ?? '')

  useEffect(() => {
    setValue(dialogState?.initialValue ?? '')
  }, [dialogState])

  useEffect(() => {
    if (!dialogState) return

    inputRef.current?.focus()
    inputRef.current?.select()
  }, [dialogState])

  if (!dialogState) return null

  const closeDialog = () => {
    setDialogState(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (dialogState.mode === 'create') {
      await createEmptyNote(value)
      return
    }

    await renameSelectedNote(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      closeDialog()
    }
  }

  return (
    <div
      className='absolute inset-0 z-30 flex items-center justify-center bg-black/25 px-6 backdrop-blur-[2px]'
      onKeyDown={handleKeyDown}
    >
      <form
        className='w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900/70 p-5 shadow-2xl backdrop-blur-xl'
        onSubmit={handleSubmit}
      >
        <div className='mb-4'>
          <h2 className='text-sm font-semibold text-zinc-100'>
            {dialogState.mode === 'create' ? 'New note' : 'Rename note'}
          </h2>
          <p className='mt-1 text-xs text-zinc-400'>
            {dialogState.mode === 'create'
              ? 'Enter a note name. The file will be created directly in NoteMark.'
              : 'Update the note title. The markdown file will be renamed in place.'}
          </p>
        </div>

        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className='w-full rounded-md border border-white/10 bg-zinc-950/75 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-sky-400'
          placeholder='Untitled'
        />

        <div className='mt-4 flex justify-end gap-2'>
          <button
            type='button'
            onClick={closeDialog}
            className='rounded-md border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-md border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-sm text-sky-100 transition hover:bg-sky-400/20'
          >
            {dialogState.mode === 'create' ? 'Create' : 'Rename'}
          </button>
        </div>
      </form>
    </div>
  )
}
