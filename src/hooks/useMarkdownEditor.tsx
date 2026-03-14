import { MDXEditorMethods } from '@mdxeditor/editor'
import { saveNoteAtom, selectedNoteAtom } from '@renderer/store'
import { autoSavingTime } from '@shared/constants'
import { NoteContent } from '@shared/models'
import { useAtomValue, useSetAtom } from 'jotai'
import { throttle } from 'lodash'
import { useEffect, useRef } from 'react'

export const useMarkdownEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const editorRef = useRef<MDXEditorMethods>(null)
  const throttledSaveRef = useRef(
    throttle(
      async ({ title, content }: { title: string; content: NoteContent }) => {
        await saveNote({ title, content })
      },
      autoSavingTime,
      {
        leading: false,
        trailing: true
      }
    )
  )

  useEffect(() => {
    return () => {
      throttledSaveRef.current.cancel()
    }
  }, [selectedNote?.title])

  const handleAutoSaving = async (content: NoteContent) => {
    if (!selectedNote) return

    console.info('Auto saving:', selectedNote.title)

    throttledSaveRef.current({
      title: selectedNote.title,
      content
    })
  }

  const handleBlur = async () => {
    if (!selectedNote) return

    throttledSaveRef.current.cancel()

    const content = editorRef.current?.getMarkdown()

    if (content != null) {
      await saveNote({
        title: selectedNote.title,
        content
      })
    }
  }

  return {
    editorRef,
    selectedNote,
    handleAutoSaving,
    handleBlur
  }
}
