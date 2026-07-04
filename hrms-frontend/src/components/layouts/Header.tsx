import { Bell, Menu, Search, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useSidebarStore } from '@/store/sidebar-store'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { user, logout } = useAuthStore()
  const { toggleMobile } = useSidebarStore()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'white', borderBottom: '1px solid #e5e7eb',
      height: 56, display: 'flex', alignItems: 'center',
      paddingLeft: 20, paddingRight: 20, gap: 12,
    }}>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6b7280' }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#f3f4f6', borderRadius: 6,
        padding: '6px 12px', flex: 1, maxWidth: 280,
      }}>
        <Search size={15} color="#9ca3af" />
        <input
          placeholder="Search..."
          style={{
            border: 'none', background: 'transparent', outline: 'none',
            fontSize: 13, color: '#374151', width: '100%',
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Bell */}
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, position: 'relative', color: '#6b7280' }}>
        <Bell size={18} />
        <span style={{
          position: 'absolute', top: 3, right: 3, width: 8, height: 8,
          background: '#ef4444', borderRadius: '50%',
        }} />
      </button>

      {/* Profile */}
      <div ref={profileRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 8px', borderRadius: 6,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600,
          }}>
            {user?.login_id?.charAt(0).toUpperCase() || 'U'}
          </div>
        </button>

        {profileOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 4px)',
            background: 'white', border: '1px solid #e5e7eb',
            borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            padding: '6px', minWidth: 160, zIndex: 100,
          }} className="animate-scale-in">
            <button
              onClick={() => { setProfileOpen(false); navigate('/profile') }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px', border: 'none',
                background: 'none', cursor: 'pointer', borderRadius: 6,
                fontSize: 13, color: '#374151', textAlign: 'left',
              }}
            >
              <User size={14} /> My Profile
            </button>
            <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #f3f4f6' }} />
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px', border: 'none',
                background: 'none', cursor: 'pointer', borderRadius: 6,
                fontSize: 13, color: '#dc2626', textAlign: 'left',
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
