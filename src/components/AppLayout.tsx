import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const RootLayout = forwardRef<HTMLElement, ComponentProps<'main'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <main ref={ref} className={twMerge('relative flex h-screen flex-row', className)} {...props}>
        {children}
      </main>
    )
  }
)

RootLayout.displayName = 'RootLayout'

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    <aside
      className={twMerge('w-[250px] mt-7 h-[100vh + 10px] overflow-auto', className)}
      {...props}
    >
      {children}
    </aside>
  )
}

export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={twMerge('flex-1 overflow-auto', className)} {...props}>
      {children}
    </div>
  )
)

Content.displayName = 'Content'
