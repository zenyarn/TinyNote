import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>

export const ActionButton = ({ className, children, ...props }: ActionButtonProps) => {
  return (
    <button
      className={twMerge(
        'rounded-md border border-zinc-400/50 px-2 py-1 transition-colors duration-100 hover:bg-zinc-600/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
