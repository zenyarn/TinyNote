import {
  chooseWorkspaceDirectory,
  createNote,
  deleteNote,
  getNotes,
  getWorkspaceDirectory,
  readNote,
  renameNote,
  writeNote
} from '@/lib'
import { NoteContent, NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

export type EditorMode = 'rich-text' | 'source'
export type NoteNameDialogState =
  | {
      mode: 'create'
      initialValue: string
    }
  | {
      mode: 'rename'
      initialValue: string
    }

const loadNotes = async () => {
  const notes = await getNotes()

  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const workspaceDirectoryAtomAsync = atom<string | Promise<string>>(getWorkspaceDirectory())
const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const workspaceDirectoryAtom = unwrap(workspaceDirectoryAtomAsync, (prev) => prev ?? '')
export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const selectedNoteIndexAtom = atom<number | null>(0)
export const editorModeAtom = atom<EditorMode>('rich-text')
export const noteNameDialogAtom = atom<NoteNameDialogState | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex == null || !notes) return null

  const selectedNote = notes[selectedNoteIndex]

  if (!selectedNote) return null

  const noteContent = await readNote(selectedNote.title)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(selectedNoteAtomAsync, (prev) => prev ?? null)

export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  await writeNote(selectedNote.title, newContent)

  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }

      return note
    })
  )
})

export const createEmptyNoteAtom = atom(null, async (get, set, title?: string) => {
  const notes = get(notesAtom)

  if (!notes) return

  const createdTitle = await createNote(title)

  if (!createdTitle) return

  const newNote: NoteInfo = {
    title: createdTitle,
    lastEditTime: Date.now()
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])
  set(selectedNoteIndexAtom, 0)
  set(noteNameDialogAtom, null)
})

export const selectWorkspaceDirectoryAtom = atom(null, async (_get, set) => {
  const workspaceDirectory = await chooseWorkspaceDirectory()

  if (!workspaceDirectory) return

  const notes = await loadNotes()

  set(workspaceDirectoryAtom, workspaceDirectory)
  set(notesAtom, notes)
  set(selectedNoteIndexAtom, notes.length > 0 ? 0 : null)
})

export const renameSelectedNoteAtom = atom(null, async (get, set, newTitle: string) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const renamedTitle = await renameNote(selectedNote.title, newTitle)

  if (!renamedTitle) return

  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          title: renamedTitle
        }
      }

      return note
    })
  )
  set(noteNameDialogAtom, null)
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isDeleted = await deleteNote(selectedNote.title)

  if (!isDeleted) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})
