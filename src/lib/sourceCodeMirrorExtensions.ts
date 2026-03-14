import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { markdown } from '@codemirror/lang-markdown'
import { LanguageDescription } from '@codemirror/language'

const SOURCE_CODE_LANGUAGES = [
  LanguageDescription.of({
    name: 'JavaScript',
    alias: ['js', 'javascript', 'mjs', 'cjs'],
    support: javascript()
  }),
  LanguageDescription.of({
    name: 'TypeScript',
    alias: ['ts', 'typescript'],
    support: javascript({
      typescript: true
    })
  }),
  LanguageDescription.of({
    name: 'JSX',
    alias: ['jsx'],
    support: javascript({
      jsx: true
    })
  }),
  LanguageDescription.of({
    name: 'TSX',
    alias: ['tsx'],
    support: javascript({
      jsx: true,
      typescript: true
    })
  }),
  LanguageDescription.of({
    name: 'HTML',
    alias: ['html'],
    support: html()
  }),
  LanguageDescription.of({
    name: 'CSS',
    alias: ['css', 'scss', 'less'],
    support: css()
  }),
  LanguageDescription.of({
    name: 'Markdown',
    alias: ['md', 'markdown'],
    support: markdown()
  })
]

export const sourceCodeMirrorExtensions = [
  markdown({
    codeLanguages: SOURCE_CODE_LANGUAGES
  }).extension
]
