import {
  ActionButtonsRow,
  Content,
  DraggableTopBar,
  FloatingNoteTitle,
  MarkdownEditor,
  NoteNameDialog,
  NotePreviewList,
  RootLayout,
  Sidebar
} from '@/components'
import { useRef } from 'react'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className='p-2'>
          <ActionButtonsRow className='mt-0 flex justify-between' />
          <NotePreviewList className='mt-4 space-y-1' onSelect={resetScroll} />
        </Sidebar>

        <Content
          ref={contentContainerRef}
          className='relative border-l border-l-white/20 bg-zinc-900/50'
        >
          <FloatingNoteTitle className='pt-2' />
          <MarkdownEditor />
        </Content>
      </RootLayout>
      <NoteNameDialog />
    </>
  )
}

export default App
