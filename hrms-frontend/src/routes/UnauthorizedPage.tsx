import { ShieldOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          You don't have permission to access this page. Contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/25"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
