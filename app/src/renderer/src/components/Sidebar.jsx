import { useStore } from '@/store'
import { twMerge } from 'tailwind-merge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Sidebar = ({ className, children, ...props }) => {
  const isSidebarCollapsed = useStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useStore((state) => state.toggleSidebar)

  return (
    <aside
      className={twMerge(
        'transition-all duration-300 ease-in-out mt-10 h-[100vh + 10px] overflow-hidden relative',
        isSidebarCollapsed ? 'w-[80px]' : 'w-[200px]',
        className
      )}
      {...props}
    >
      <button
        onClick={toggleSidebar}
        className="absolute right-0 bottom-0 p-4 text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">{children}</div>
    </aside>
  )
}
