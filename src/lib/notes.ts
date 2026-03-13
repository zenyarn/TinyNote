import { invoke } from '@tauri-apps/api/core'
import { basename, dirname, homeDir, join } from '@tauri-apps/api/path'
import { confirm, message, save } from '@tauri-apps/plugin-dialog'
import { appDirectoryName } from '@shared/constants'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'

export const getNotes: GetNotes = () => invoke('get_notes')
export const readNote: ReadNote = (title) => invoke('read_note', { title })
export const writeNote: WriteNote = (title, content) => invoke('write_note', { title, content })
export const createNote: CreateNote = async () => {
  const rootDir = await join(await homeDir(), appDirectoryName)
  const filePath = await save({
    title: 'New note',
    defaultPath: await join(rootDir, 'Untitled.md'),
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (!filePath) {
    return false
  }

  if ((await dirname(filePath)) !== rootDir) {
    await message(`All notes must be saved under ${rootDir}.\nAvoid using other directories!`, {
      kind: 'error',
      title: 'Creation failed'
    })

    return false
  }

  const title = await basename(filePath, '.md')

  return invoke('create_note', { title })
}
export const deleteNote: DeleteNote = async (title) => {
  const shouldDelete = await confirm(`Are you sure you want to delete ${title}?`, {
    kind: 'warning',
    title: 'Delete note',
    okLabel: 'Delete',
    cancelLabel: 'Cancel'
  })

  if (!shouldDelete) {
    return false
  }

  return invoke('delete_note', { title })
}
