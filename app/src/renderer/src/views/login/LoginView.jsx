import { useState } from 'react'
import { useAuth } from '@/context'
import { Input, Button, Logo } from '@/components/ui'

export const LoginView = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-900/50">
      <div className="w-96 p-8 bg-zinc-900/50 rounded-lg border border-zinc-700">
        <Logo className="text-xl font-bold py-3" showText iconSize="w-28" />

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
              placeholder="Enter Email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
              placeholder="Enter Password"
            />
          </div>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
