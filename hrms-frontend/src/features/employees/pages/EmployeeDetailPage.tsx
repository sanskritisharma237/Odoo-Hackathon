import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Building2, Camera } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockEmployeeService, mockPayrollService } from '@/services/mock-data'
import { Avatar } from '@/components/common/Avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PageLoading, EmptyState } from '@/components/feedback'
import { formatDate, formatCurrency, cn } from '@/utils'
import type { Employee, SalaryStructure, Document as DocType } from '@/types'

type ProfileTab = 'personal' | 'job' | 'salary' | 'documents'

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [salary, setSalary] = useState<SalaryStructure | null>(null)
  const [documents, setDocuments] = useState<DocType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal')
  const canViewSalary = user?.role === 'admin' || user?.role === 'hr'

  useEffect(() => {
    loadData(id)
  }, [id, user])

  const loadData = async (empId?: string) => {
    try {
      if (!empId && !user) return;
      const emp = empId 
        ? await mockEmployeeService.getById(empId)
        : await mockEmployeeService.getByUserId(user!.id)
      
      const docs = await mockEmployeeService.getDocuments(emp.id)
      
      setEmployee(emp)
      setDocuments(docs)
      
      if (canViewSalary) {
        const sal = await mockPayrollService.getSalaryStructure(emp.id)
        setSalary(sal)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoading />
  if (!employee) return <EmptyState title="Employee not found" />

  const tabs: { key: ProfileTab; label: string; hidden?: boolean }[] = [
    { key: 'personal', label: 'Personal Details' },
    { key: 'job', label: 'Job Details' },
    { key: 'salary', label: 'Salary Structure', hidden: !canViewSalary },
    { key: 'documents', label: 'Documents' },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Employees &gt; {employee.full_name}
        </div>
      </div>

      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <Avatar name={employee.full_name} src={employee.profile_picture_url} size="xl" />
            {(canViewSalary) && (
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-dark">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{employee.full_name}</h1>
              <StatusBadge status={employee.employment_status} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{employee.designation} · {employee.department_name}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{employee.email}</span>
              {employee.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{employee.phone}</span>}
              {employee.work_location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{employee.work_location}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.filter(t => !t.hidden).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'personal' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Employee ID', value: employee.employee_id },
                { label: 'Full Name', value: employee.full_name },
                { label: 'Email', value: employee.email },
                { label: 'Phone', value: employee.phone || '-' },
                { label: 'Date of Birth', value: employee.dob ? formatDate(employee.dob) : '-' },
                { label: 'Gender', value: employee.gender ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1) : '-' },
                { label: 'Blood Group', value: employee.blood_group || '-' },
                { label: 'Nationality', value: employee.nationality || '-' },
                { label: 'Marital Status', value: employee.marital_status || '-' },
                { label: 'Address', value: employee.address || '-' },
                { label: 'Emergency Contact', value: employee.emergency_contact || '-' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'job' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">Job Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Department', value: employee.department_name || '-' },
                { label: 'Designation', value: employee.designation || '-' },
                { label: 'Manager', value: employee.manager_name || '-' },
                { label: 'Date of Joining', value: formatDate(employee.joining_date) },
                { label: 'Employment Type', value: employee.employment_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) },
                { label: 'Work Location', value: employee.work_location || '-' },
                { label: 'Role', value: employee.role.charAt(0).toUpperCase() + employee.role.slice(1) },
                { label: 'Status', value: employee.employment_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'salary' && salary && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">Salary Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Earnings</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Basic', value: salary.basic },
                    { label: 'HRA', value: salary.hra },
                    { label: 'Standard Allowance', value: salary.standard_allowance },
                    { label: 'Performance Bonus', value: salary.performance_bonus },
                    { label: 'LTA', value: salary.lta },
                    { label: 'Fixed Allowance', value: salary.fixed_allowance },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-1.5">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-700 font-semibold">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Gross Salary</span>
                    <span className="text-sm text-slate-900 dark:text-white">{formatCurrency(salary.gross_salary)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Deductions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Provident Fund', value: salary.pf_deduction },
                    { label: 'Professional Tax', value: salary.professional_tax },
                    { label: 'Additional Deductions', value: salary.additional_deductions },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-1.5">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className="text-sm font-medium text-rose-600">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Salary</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(salary.net_salary)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-400">Yearly</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{formatCurrency(salary.yearly_salary)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">Documents</h2>
            {documents.length === 0 ? (
              <EmptyState title="No documents" description="No documents have been uploaded yet." />
            ) : (
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Uploaded {formatDate(doc.uploaded_at)}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-slate-600 dark:text-slate-300 uppercase">{doc.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
