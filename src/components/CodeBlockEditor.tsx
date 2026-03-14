import {
  CodeMirrorEditor,
  type CodeBlockEditorProps,
  useCodeBlockEditorContext
} from '@mdxeditor/editor'
import { CODE_BLOCK_LANGUAGES } from '@renderer/lib/codeBlockLanguages'

type LocalCodeBlockEditorProps = CodeBlockEditorProps & {
  readOnlyPreview?: boolean
}

const normalizePreviewCode = (code: string) => {
  const trimmed = code.replace(/^\n+/, '').replace(/\n+$/, '')
  const lines = trimmed.split('\n')
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0)
  const sharedIndent = indents.length > 0 ? Math.min(...indents) : 0

  if (sharedIndent === 0) {
    return trimmed
  }

  return lines.map((line) => line.slice(sharedIndent)).join('\n')
}

export const CodeBlockEditor = (props: LocalCodeBlockEditorProps) => {
  const codeBlock = useCodeBlockEditorContext()
  const currentLanguage = props.language || 'text'
  const languageOptions = Object.entries(CODE_BLOCK_LANGUAGES)

  if (props.readOnlyPreview) {
    const languageLabel =
      CODE_BLOCK_LANGUAGES[currentLanguage as keyof typeof CODE_BLOCK_LANGUAGES] ?? currentLanguage
    const previewCode = normalizePreviewCode(props.code)

    return (
      <div className='my-5 overflow-hidden rounded-xl border border-white/10 bg-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'>
        <div className='flex items-center justify-between border-b border-white/8 bg-white/[0.025] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400'>
          <span>Code</span>
          <span>{languageLabel}</span>
        </div>
        <pre className='m-0 overflow-x-auto bg-transparent px-1 py-3 text-[15px] leading-7 text-zinc-100'>
          <code>{previewCode}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className='my-5 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] backdrop-blur-sm'>
      <div className='flex items-center gap-3 border-b border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400'>
        <span>Code block language</span>

        <select
          value={currentLanguage}
          onChange={(event) => codeBlock.setLanguage(event.target.value)}
          className='ml-auto rounded-md border border-white/10 bg-zinc-900/70 px-2 py-1 text-xs text-zinc-100 outline-none transition focus:border-sky-400'
        >
          {!CODE_BLOCK_LANGUAGES[currentLanguage as keyof typeof CODE_BLOCK_LANGUAGES] ? (
            <option value={currentLanguage}>{currentLanguage}</option>
          ) : null}

          {languageOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <CodeMirrorEditor {...props} language={currentLanguage} />
    </div>
  )
}
