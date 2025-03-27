import { useStore } from '@/store'

export const Header = () => {
  const { getCurrentView } = useStore()
  const view = getCurrentView()

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <view.icon className="w-6 h-6" />
        <h1 className="text-2xl font-bold">{view.label}</h1>
      </div>
      {view.description && <p className="text-zinc-400">{view.description}</p>}
    </div>
  )
}
