import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes'
import { useAuthStore } from './store/authStore'

export default function App() {
  const checkAuth = useAuthStore(state => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
