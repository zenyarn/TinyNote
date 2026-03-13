import { DeleteNoteButton, NewNoteButton, ToggleEditorModeButton } from '@/components'
import { ComponentProps } from 'react'

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <ToggleEditorModeButton />
      <DeleteNoteButton />
    </div>
  )
}
