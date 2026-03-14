import {
  DeleteNoteButton,
  NewNoteButton,
  RenameNoteButton,
  SelectWorkspaceButton,
  ToggleEditorModeButton
} from '@/components'
import { ComponentProps } from 'react'

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <SelectWorkspaceButton />
      <NewNoteButton />
      <RenameNoteButton />
      <ToggleEditorModeButton />
      <DeleteNoteButton />
    </div>
  )
}
