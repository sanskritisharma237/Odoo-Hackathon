import { NavLink, useLocation, Link } from 'react-router-dom'
import {
  Home, ChevronDown, ChevronRight, Settings, Menu
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useSidebarStore } from '@/store/sidebar-store'
import { ROUTES } from '@/config'
import { useState } from 'react'

// Icons as SVG strings matching Odoo style
function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function IconLeaves() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function IconEmployees() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function IconNotif() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}
function IconActivity() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}
function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/>
    </svg>
  )
}

interface NavGroup {
  label: string
  icon: React.ElementType
  path?: string
  roles?: string[]
  children?: { label: string; path: string }[]
}

export function Sidebar() {
  const { user, company, logout } = useAuthStore()
  const { isMobileOpen, closeMobile } = useSidebarStore()
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Leaves'])

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    )
  }

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const isExpanded = (label: string) => expandedMenus.includes(label)

  // Build navigation based on role
  const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr'
  const isAdmin = user?.role === 'admin'

  const navGroups: NavGroup[] = isAdminOrHr ? [
    { label: 'Dashboard', icon: IconHome, path: ROUTES.DASHBOARD },
    { label: 'Employees', icon: IconEmployees, path: ROUTES.EMPLOYEES },
    { label: 'Attendance', icon: IconActivity, path: ROUTES.ATTENDANCE },
    { label: 'Leave Approvals', icon: IconLeaves, path: '/leave' },
    { label: 'Payroll', icon: IconActivity, path: ROUTES.PAYROLL }, // Will use better icon later if needed
    { label: 'Reports', icon: IconActivity, path: '/reports' },
    { label: 'Settings', icon: IconSettings, path: ROUTES.SETTINGS },
    { label: 'Company Settings', icon: IconSettings, path: '/settings/company' },
    { label: 'Profile', icon: IconEmployees, path: ROUTES.PROFILE },
  ] : [
    { label: 'Dashboard', icon: IconHome, path: ROUTES.DASHBOARD },
    { label: 'Time Off', icon: IconLeaves, path: '/leave' },
    { label: 'Attendance', icon: IconActivity, path: ROUTES.ATTENDANCE },
    { label: 'Payroll', icon: IconActivity, path: ROUTES.PAYROLL },
    { label: 'Profile', icon: IconEmployees, path: ROUTES.PROFILE },
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const content = (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        odoo
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav scrollbar-thin">
        {navGroups.map((group) => {
          const Icon = group.icon
          const hasChildren = group.children && group.children.length > 0
          const groupActive = group.path ? isActive(group.path) : group.children?.some(c => isActive(c.path))

          return (
            <div key={group.label}>
              {hasChildren ? (
                <button
                  onClick={() => toggleMenu(group.label)}
                  className={`sidebar-item ${groupActive ? 'active' : ''}`}
                >
                  <Icon />
                  <span style={{ flex: 1 }}>{group.label}</span>
                  {isExpanded(group.label)
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />
                  }
                </button>
              ) : (
                <NavLink
                  to={group.path!}
                  onClick={closeMobile}
                  className={({ isActive: ia }) => `sidebar-item${ia ? ' active' : ''}`}
                >
                  <Icon />
                  <span>{group.label}</span>
                </NavLink>
              )}

              {/* Sub-items */}
              {hasChildren && isExpanded(group.label) && (
                <div>
                  {group.children!.map(child => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={closeMobile}
                      className={({ isActive: ia }) =>
                        `sidebar-sub-item${ia ? ' active' : ''}`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Settings */}
      <div style={{ padding: '4px 0', borderTop: '1px solid #f3f4f6' }}>
        <NavLink
          to={ROUTES.SETTINGS}
          onClick={closeMobile}
          className={({ isActive: ia }) => `sidebar-item${ia ? ' active' : ''}`}
        >
          <IconSettings />
          <span>Settings</span>
        </NavLink>
      </div>

      {/* User Profile */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, flexShrink: 0
          }}>
            {user ? getInitials(user.login_id) : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.login_id || 'User'}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>
              {user?.role === 'admin' ? 'Administrator' :
               user?.role === 'hr' ? 'HR Manager' : 'Employee'}
            </div>
          </div>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            onClick={() => logout()}
            title="Logout"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {content}
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 39, background: 'rgba(0,0,0,0.4)' }}
          onClick={closeMobile}
          className="lg:hidden"
        />
      )}
    </>
  )
}
