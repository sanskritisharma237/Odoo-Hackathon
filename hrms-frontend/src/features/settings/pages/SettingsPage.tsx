import { useState, useEffect } from 'react'
import { Building2, Plus, Pencil, Trash2, Users } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockAdminService } from '@/services/mock-data'
import { DashboardSkeleton } from '@/components/feedback'
import { cn } from '@/utils'
import type { Company, Department } from '@/types'

export function SettingsPage() {
  const { company, updateCompany } = useAuthStore()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'company' | 'departments'>('company')
  const [companyForm, setCompanyForm] = useState({
    name: company?.name || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    website: company?.website || '',
    industry: company?.industry || '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const deps = await mockAdminService.getDepartments()
      setDepartments(deps)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    await mockAdminService.updateCompany(companyForm)
    updateCompany(companyForm)
  }

  if (loading) return <DashboardSkeleton />

  const tabs = [
    { key: 'company' as const, label: 'Company', icon: Building2 },
    { key: 'departments' as const, label: 'Departments', icon: Users },
  ]

  const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400'
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Tab Bar */}
          <div className="md:hidden flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'company' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">Company Information</h2>
              <form onSubmit={handleSaveCompany} className="space-y-4 max-w-lg">
                <div>
                  <label className={labelCls}>Company Name</label>
                  <input type="text" value={companyForm.name} onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <textarea value={companyForm.address} onChange={(e) => setCompanyForm(prev => ({ ...prev, address: e.target.value }))} rows={2} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" value={companyForm.phone} onChange={(e) => setCompanyForm(prev => ({ ...prev, phone: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={companyForm.email} onChange={(e) => setCompanyForm(prev => ({ ...prev, email: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Website</label>
                    <input type="url" value={companyForm.website} onChange={(e) => setCompanyForm(prev => ({ ...prev, website: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Industry</label>
                    <input type="text" value={companyForm.industry} onChange={(e) => setCompanyForm(prev => ({ ...prev, industry: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <button type="submit" className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-semibold text-slate-900 dark:text-white">Departments</h2>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark">
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Employees</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id}>
                      <td className="font-medium text-slate-900 dark:text-white">{dept.name}</td>
                      <td className="text-slate-600 dark:text-slate-400">{dept.employee_count ?? 0}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
