import {
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'
import { CodeBlockEditor } from '@renderer/components/CodeBlockEditor'
import { MarkdownEditorErrorBoundary } from '@renderer/components/MarkdownEditorErrorBoundary'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { CODE_BLOCK_LANGUAGES } from '@renderer/lib/codeBlockLanguages'
import { NoteContent } from '@shared/models'
import { editorModeAtom, saveNoteAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'

const imageUploadHandler = async () => {
  throw new Error('Image upload is not configured in this build.')
}

export const MarkdownEditor = () => {
  const editorMode = useAtomValue(editorModeAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()
  const [markdownWarning, setMarkdownWarning] = useState<string | null>(null)
  const [fallbackMarkdown, setFallbackMarkdown] = useState('')

  useEffect(() => {
    if (!selectedNote) {
      setMarkdownWarning(null)
      setFallbackMarkdown('')
      return
    }

    setMarkdownWarning(null)
    setFallbackMarkdown(selectedNote.content)
  }, [selectedNote, editorMode])

  if (!selectedNote) return null

  const handleEditorError = (payload: { error: string; source: string }) => {
    console.error('Markdown processing error:', payload)
    setMarkdownWarning(payload.error)
  }

  const handleFallbackChange = (content: NoteContent) => {
    setFallbackMarkdown(content)
  }

  const handleFallbackBlur = async () => {
    if (!selectedNote) return

    await saveNote({
      title: selectedNote.title,
      content: fallbackMarkdown
    })
  }

  const renderFallback = (message: string) => (
    <div className='flex min-h-full flex-col px-8 pb-5 pt-14'>
      <div className='mb-4 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100'>
        <p className='font-semibold'>Markdown rendering fallback</p>
        <p className='mt-1 text-amber-50/90'>{message}</p>
      </div>

      <textarea
        value={fallbackMarkdown}
        onChange={(event) => handleFallbackChange(event.target.value)}
        onBlur={handleFallbackBlur}
        className='min-h-[calc(100vh-8rem)] w-full resize-none rounded-lg border border-white/10 bg-zinc-950/70 p-4 text-sm leading-relaxed text-zinc-100 outline-none transition focus:border-sky-400'
        spellCheck={false}
      />
    </div>
  )

  return (
    <MarkdownEditorErrorBoundary
      resetKey={`${selectedNote.title}-${editorMode}`}
      fallback={(error) => renderFallback(error.message)}
    >
      <div className='relative min-h-full'>
        {markdownWarning ? (
          <div className='pointer-events-none absolute inset-x-8 top-14 z-10 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100'>
            {markdownWarning}
          </div>
        ) : null}

        <MDXEditor
          className='dark-theme mdxeditor-dark'
          ref={editorRef}
          key={`${selectedNote.title}-${editorMode}`}
          markdown={selectedNote.content}
          onChange={handleAutoSaving}
          onBlur={handleBlur}
          onError={handleEditorError}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            thematicBreakPlugin(),
            tablePlugin(),
            imagePlugin({
              imageUploadHandler,
              imageAutocompleteSuggestions: []
            }),
            codeBlockPlugin({
              defaultCodeBlockLanguage: 'text',
              codeBlockEditorDescriptors: [
                {
                  priority: -10,
                  match: () => true,
                  Editor: CodeBlockEditor
                }
              ]
            }),
            codeMirrorPlugin({
              codeBlockLanguages: CODE_BLOCK_LANGUAGES
            }),
            markdownShortcutPlugin(),
            diffSourcePlugin({ viewMode: editorMode })
          ]}
          contentEditableClassName='outline-none min-h-screen max-w-none px-8 pb-5 pt-14 text-lg caret-yellow-500 prose prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[""] prose-code:after:content-[""] prose-a:text-sky-300 prose-a:decoration-sky-400/40 prose-a:underline-offset-4 hover:prose-a:text-sky-200 prose-hr:my-8 prose-hr:border-white/10 prose-table:my-6 prose-table:w-full prose-table:table-fixed prose-thead:border-b prose-thead:border-white/10 prose-th:border-white/10 prose-th:bg-white/[0.04] prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-td:border-white/10 prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-img:rounded-lg prose-img:border prose-img:border-white/10 prose-img:bg-black/10'
        />
      </div>
    </MarkdownEditorErrorBoundary>
  )
}
