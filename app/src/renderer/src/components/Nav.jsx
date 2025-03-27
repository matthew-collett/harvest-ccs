import { useStore } from '@/store'
import { VIEW_LIST } from '@/views'
import { Logo } from '@/components/ui'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/context'

export const Nav = () => {
  const { setCurrentView, isSidebarCollapsed, getCurrentView } = useStore()
  const { logout } = useAuth()
  const currentView = getCurrentView()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav
      className={`flex flex-col gap-2 overflow-hidden ${isSidebarCollapsed ? 'items-center' : ''}`}
    >
      <Logo
        className="px-3 py-2 font-bold whitespace-nowrap text-lg"
        showText={!isSidebarCollapsed}
      />
      {VIEW_LIST.map((view) => {
        const Icon = view.icon
        return (
          <button
            key={view.id}
            onClick={() => setCurrentView(view)}
            className={`p-2 text-left rounded-md transition-colors flex items-center gap-3 ${
              currentView.id === view.id ? 'bg-zinc-700/50' : 'hover:bg-zinc-700/50'
            } whitespace-nowrap`}
            title={view.label}
          >
            {Icon && <Icon size={18} className="flex-shrink-0" />}
            {!isSidebarCollapsed && <span className="truncate">{view.label}</span>}
          </button>
        )
      })}

      <button
        onClick={handleLogout}
        className="p-2 text-left rounded-md transition-colors flex items-center gap-3 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-100 whitespace-nowrap"
        title="Logout"
      >
        <LogOut size={18} className="flex-shrink-0" />
        {!isSidebarCollapsed && <span className="truncate">Logout</span>}
      </button>
    </nav>
  )
}
