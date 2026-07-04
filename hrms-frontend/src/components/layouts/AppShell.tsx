import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppShell() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <div className="app-main">
        <Header />
        <main style={{ padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
