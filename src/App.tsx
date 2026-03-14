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
import { useEffect, useRef, useState } from 'react'

const DEFAULT_SIDEBAR_WIDTH = 250
const MIN_SIDEBAR_WIDTH = 220
const MAX_SIDEBAR_WIDTH = 420
const MIN_CONTENT_WIDTH = 360

const App = () => {
  const rootLayoutRef = useRef<HTMLElement>(null)
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const isResizingRef = useRef(false)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizingRef.current || !rootLayoutRef.current) return

      const { left, width } = rootLayoutRef.current.getBoundingClientRect()
      const nextWidth = event.clientX - left
      const maxAllowedWidth = Math.min(MAX_SIDEBAR_WIDTH, width - MIN_CONTENT_WIDTH)
      const clampedWidth = Math.min(Math.max(nextWidth, MIN_SIDEBAR_WIDTH), maxAllowedWidth)

      setSidebarWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      if (!isResizingRef.current) return

      isResizingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleResizeStart = () => {
    isResizingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <>
      <DraggableTopBar />
      <RootLayout ref={rootLayoutRef}>
        <Sidebar className='shrink-0 p-2' style={{ width: sidebarWidth }}>
          <div className='px-2 pr-1'>
            <ActionButtonsRow className='mt-0 flex justify-between' />
          </div>
          <div className='note-list-scroll mt-4 flex-1 overflow-y-auto pl-2 pr-1'>
            <NotePreviewList className='space-y-1' onSelect={resetScroll} />
          </div>
        </Sidebar>

        <div
          role='separator'
          aria-orientation='vertical'
          aria-label='Resize notes sidebar'
          onMouseDown={handleResizeStart}
          className='group flex w-3 shrink-0 cursor-col-resize items-stretch justify-center bg-transparent'
        >
          <div className='w-px bg-white/12 transition group-hover:bg-white/25' />
        </div>

        <Content
          ref={contentContainerRef}
          className='relative min-w-0 bg-zinc-900/50'
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
