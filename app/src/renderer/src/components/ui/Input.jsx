import { twMerge } from 'tailwind-merge'

export const Input = ({ className, ...props }) => (
  <input
    className={twMerge('bg-zinc-800 rounded px-3 py-2 focus:outline-none', className)}
    {...props}
  />
)
