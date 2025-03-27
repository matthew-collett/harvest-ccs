import { twMerge } from 'tailwind-merge'

export const IconButton = ({ icon: Icon, className, ...props }) => (
  <button className={twMerge('p-1 rounded transition-colors', className)} {...props}>
    <Icon className="w-4 h-4" />
  </button>
)
