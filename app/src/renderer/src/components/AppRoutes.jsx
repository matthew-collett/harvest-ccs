import { useAuth } from '@/context'
import { LoginView } from '@/views/login'
import { AppLayout } from '@/components'

export const AppRoutes = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return user ? <AppLayout /> : <LoginView />
}
