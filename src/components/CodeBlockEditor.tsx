import {
  CodeMirrorEditor,
  type CodeBlockEditorProps,
  useCodeBlockEditorContext
} from '@mdxeditor/editor'
import { CODE_BLOCK_LANGUAGES } from '@renderer/lib/codeBlockLanguages'

export const CodeBlockEditor = (props: CodeBlockEditorProps) => {
  const codeBlock = useCodeBlockEditorContext()
  const currentLanguage = props.language || 'text'
  const languageOptions = Object.entries(CODE_BLOCK_LANGUAGES)

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
