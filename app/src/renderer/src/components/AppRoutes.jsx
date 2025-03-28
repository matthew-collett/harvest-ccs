import { useAuth } from '@/context'
import { LoginView } from '@/views/login'
import { LoadingView } from '@/views/loading'

import { AppLayout } from '@/components'

export const AppRoutes = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingView />
  }

  return user ? <AppLayout /> : <LoginView />
}
