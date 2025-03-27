import { twMerge } from 'tailwind-merge'

export const RootLayout = ({ className, children, ...props }) => (
  <main className={twMerge('flex flex-row h-screen', className)} {...props}>
    {children}
  </main>
)
