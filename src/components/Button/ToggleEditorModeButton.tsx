import { ActionButton, ActionButtonProps } from '@/components'
import { editorModeAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import { LuEye, LuFileCode } from 'react-icons/lu'

export const ToggleEditorModeButton = ({ ...props }: ActionButtonProps) => {
  const [editorMode, setEditorMode] = useAtom(editorModeAtom)

  const handleToggle = () => {
    setEditorMode(editorMode === 'rich-text' ? 'source' : 'rich-text')
  }

  return (
    <ActionButton
      onClick={handleToggle}
      title={editorMode === 'rich-text' ? 'Switch to source mode' : 'Switch to preview mode'}
      {...props}
    >
      {editorMode === 'rich-text' ? (
        <LuFileCode className='h-4 w-4 text-zinc-300' />
      ) : (
        <LuEye className='h-4 w-4 text-zinc-300' />
      )}
    </ActionButton>
  )
}
