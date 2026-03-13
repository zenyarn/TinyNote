import { getCurrentWindow } from '@tauri-apps/api/window'
import { MouseEvent } from 'react'

export const DraggableTopBar = () => {
  const handleMouseDown = async (event: MouseEvent<HTMLElement>) => {
    if (event.buttons !== 1) return
    await getCurrentWindow().startDragging()
  }

  return (
    <header
      onMouseDown={handleMouseDown}
      className='fixed inset-x-0 top-0 z-50 h-8 bg-transparent'
    />
  )
}
