import {
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin
} from '@mdxeditor/editor'
import { MarkdownEditorErrorBoundary } from '@renderer/components/MarkdownEditorErrorBoundary'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { NoteContent } from '@shared/models'
import { editorModeAtom, saveNoteAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'

export const MarkdownEditor = () => {
  const editorMode = useAtomValue(editorModeAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()
  const [markdownError, setMarkdownError] = useState<{ error: string; source: string } | null>(null)
  const [fallbackMarkdown, setFallbackMarkdown] = useState('')

  useEffect(() => {
    if (!selectedNote) {
      setMarkdownError(null)
      setFallbackMarkdown('')
      return
    }

    setMarkdownError(null)
    setFallbackMarkdown(selectedNote.content)
  }, [selectedNote, editorMode])

  if (!selectedNote) return null

  const handleEditorError = (payload: { error: string; source: string }) => {
    console.error('Markdown processing error:', payload)
    setMarkdownError(payload)
    setFallbackMarkdown(payload.source)
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

  if (markdownError) {
    return renderFallback(markdownError.error)
  }

  return (
    <MarkdownEditorErrorBoundary
      resetKey={`${selectedNote.title}-${editorMode}`}
      fallback={(error) => renderFallback(error.message)}
    >
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
          codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              text: 'Plain text',
              js: 'JavaScript',
              jsx: 'JavaScript (React)',
              ts: 'TypeScript',
              tsx: 'TypeScript (React)',
              json: 'JSON',
              bash: 'Bash',
              sh: 'Shell',
              html: 'HTML',
              css: 'CSS',
              md: 'Markdown',
              yaml: 'YAML',
              py: 'Python',
              rs: 'Rust'
            }
          }),
          markdownShortcutPlugin(),
          diffSourcePlugin({ viewMode: editorMode })
        ]}
        contentEditableClassName='outline-none min-h-screen max-w-none px-8 pb-5 pt-14 text-lg caret-yellow-500 prose prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[""] prose-code:after:content-[""]'
      />
    </MarkdownEditorErrorBoundary>
  )
}
