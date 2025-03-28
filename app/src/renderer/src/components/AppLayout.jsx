import { useEffect } from 'react'
import { RootLayout, Sidebar, Content, Nav } from '@/components'
import { useStore } from '@/store'

export const AppLayout = () => {
  const { getCurrentView, initializeStore, isInitialized } = useStore()
  const { component: CurrentView } = getCurrentView()

  useEffect(() => {
    if (!isInitialized) {
      initializeStore()
    }
  }, [initializeStore, isInitialized])

  return (
    <RootLayout>
      <Sidebar className="p-2">
        <Nav />
      </Sidebar>
      <Content className="border-l border-l-white/20 bg-zinc-900/50">
        <CurrentView />
      </Content>
    </RootLayout>
  )
}
