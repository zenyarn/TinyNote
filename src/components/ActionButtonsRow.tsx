import { DeleteNoteButton, NewNoteButton, RenameNoteButton, ToggleEditorModeButton } from '@/components'
import { ComponentProps } from 'react'

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <RenameNoteButton />
      <ToggleEditorModeButton />
      <DeleteNoteButton />
    </div>
  )
}
