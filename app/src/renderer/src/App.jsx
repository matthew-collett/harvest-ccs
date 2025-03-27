import { DraggableTopBar, AppRoutes } from '@/components'
import { AuthProvider } from '@/context'

const App = () => {
  return (
    <AuthProvider>
      <DraggableTopBar />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
