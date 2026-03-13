import { invoke } from '@tauri-apps/api/core'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'

export const getNotes: GetNotes = () => invoke('get_notes')
export const readNote: ReadNote = (title) => invoke('read_note', { title })
export const writeNote: WriteNote = (title, content) => invoke('write_note', { title, content })
export const createNote: CreateNote = async () => {
  const title = await invoke<string | null>('create_note')

  return title ?? false
}
export const deleteNote: DeleteNote = (title) => invoke('delete_note', { title })
