import { NoteContent, NoteInfo } from './models'

export type GetNotes = () => Promise<NoteInfo[]>
export type ReadNote = (title: NoteInfo['title']) => Promise<NoteContent>
export type WriteNote = (title: NoteInfo['title'], content: NoteContent) => Promise<void>
export type GetWorkspaceDirectory = () => Promise<string>
export type SetWorkspaceDirectory = (path: string) => Promise<string>
export type CreateNote = (title?: NoteInfo['title']) => Promise<NoteInfo['title'] | false>
export type RenameNote = (
  title: NoteInfo['title'],
  newTitle: NoteInfo['title']
) => Promise<NoteInfo['title'] | false>
export type DeleteNote = (title: NoteInfo['title']) => Promise<boolean>
