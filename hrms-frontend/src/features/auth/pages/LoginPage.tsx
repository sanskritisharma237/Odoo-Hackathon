import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockAuthService } from '@/services/mock-data'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await mockAuthService.login(loginId, password)
      setSuccess(true)
      setTimeout(() => {
        setAuth(res.user, res.company, res.tokens)
        navigate('/dashboard')
      }, 1200)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f9fafb',
    }}>
      <div style={{
        background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb', width: '100%', maxWidth: 440, padding: '40px 36px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 28, fontWeight: 700, color: 'var(--primary)',
            fontFamily: 'Inter, sans-serif',
          }}>
            odoo
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827', marginTop: 12 }}>
            Sign in to your account
          </h1>
          <p style={{ fontSize: 13.5, color: '#6b7280', marginTop: 4 }}>
            Enter your credentials to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
            padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626',
          }} className="animate-scale-in">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
            padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#16a34a',
          }} className="animate-scale-in">
            Login successful! Redirecting...
            <div style={{ marginTop: 8, height: 3, background: '#bbf7d0', borderRadius: 2, overflow: 'hidden' }}>
              <div className="login-progress" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Email / Login ID</label>
            <input
              type="text"
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              placeholder="admin@odoo"
              className="form-input"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              <span style={{ fontSize: 13, color: '#6b7280' }}>Remember me</span>
            </label>
            <button type="button" style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary"
            style={{ justifyContent: 'center', padding: '10px 16px', fontSize: 14 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo creds */}
        <div style={{
          marginTop: 24, padding: '14px 16px', background: '#f9fafb',
          border: '1px solid #f3f4f6', borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Demo Accounts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { role: 'Admin', login: 'admin@odoo', pass: 'admin123' },
              { role: 'HR', login: 'hr@odoo', pass: 'hr123' },
              { role: 'Employee', login: 'employee@odoo', pass: 'emp123' },
            ].map(d => (
              <button
                key={d.role}
                type="button"
                onClick={() => { setLoginId(d.login); setPassword(d.pass) }}
                style={{
                  display: 'flex', gap: 8, alignItems: 'center', background: 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left', padding: '3px 0',
                }}
              >
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--primary)', minWidth: 52 }}>{d.role}:</span>
                <span style={{ fontSize: 11.5, color: '#6b7280', fontFamily: 'monospace' }}>{d.login} / {d.pass}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 20 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
