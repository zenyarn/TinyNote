import { invoke } from '@tauri-apps/api/core'
import { confirm, message, open } from '@tauri-apps/plugin-dialog'
import {
  CreateNote,
  DeleteNote,
  GetNotes,
  GetWorkspaceDirectory,
  ReadNote,
  RenameNote,
  SetWorkspaceDirectory,
  WriteNote
} from '@shared/types'

export const getNotes: GetNotes = () => invoke('get_notes')
export const readNote: ReadNote = (title) => invoke('read_note', { title })
export const writeNote: WriteNote = (title, content) => invoke('write_note', { title, content })
export const getWorkspaceDirectory: GetWorkspaceDirectory = () => invoke('get_workspace_dir')
export const setWorkspaceDirectory: SetWorkspaceDirectory = (path) =>
  invoke('set_workspace_dir', { path })

export const chooseWorkspaceDirectory = async () => {
  const selected = await open({
    directory: true,
    multiple: false,
    title: 'Choose knowledge base folder'
  })

  if (!selected || Array.isArray(selected)) {
    return false
  }

  try {
    return await setWorkspaceDirectory(selected)
  } catch (error) {
    await message(String(error), {
      kind: 'error',
      title: 'Folder selection failed'
    })

    return false
  }
}

export const createNote: CreateNote = async (title) => {
  try {
    return await invoke('create_note', { title })
  } catch (error) {
    await message(String(error), {
      kind: 'error',
      title: 'Creation failed'
    })

    return false
  }
}

export const renameNote: RenameNote = async (title, newTitle) => {
  const normalizedTitle = newTitle.trim()

  if (!normalizedTitle) {
    await message('Note title cannot be empty.', {
      kind: 'error',
      title: 'Rename failed'
    })

    return false
  }

  if (normalizedTitle === title) {
    return false
  }

  try {
    return await invoke('rename_note', { title, newTitle: normalizedTitle })
  } catch (error) {
    await message(String(error), {
      kind: 'error',
      title: 'Rename failed'
    })

    return false
  }
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
