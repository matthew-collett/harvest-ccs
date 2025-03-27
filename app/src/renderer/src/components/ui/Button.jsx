import { twMerge } from 'tailwind-merge'

export const Button = ({ variant = 'primary', className, children, ...props }) => {
  const variants = {
    primary: 'disabled:bg-blue-600/50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700',
    danger: 'disabled:bg-red-500/50 disabled:cursor-not-allowed bg-red-500 hover:bg-red-600'
  }

  return (
    <button
      className={twMerge(
        'px-4 py-2 rounded transition-colors disabled:opacity-75',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
