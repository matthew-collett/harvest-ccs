import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const Content = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={twMerge('flex-1 overflow-auto p-6', className)} {...props}>
    {children}
  </div>
))

Content.displayName = 'Content'
