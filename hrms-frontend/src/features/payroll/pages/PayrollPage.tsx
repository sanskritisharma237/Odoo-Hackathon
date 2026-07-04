import { useState, useEffect } from 'react'
import { IndianRupee, Download, Eye, Calendar } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockPayrollService } from '@/services/mock-data'
import { StatCard } from '@/components/common/StatCard'
import { DashboardSkeleton, EmptyState } from '@/components/feedback'
import { formatCurrency, getMonthName, cn } from '@/utils'
import type { Payslip } from '@/types'

export function PayrollPage() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin' || user?.role === 'hr'
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = isAdmin
        ? await mockPayrollService.getAllPayroll()
        : await mockPayrollService.getMyPayslips()
      setPayslips(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Payroll</h1>
      </div>

      {/* Payslips Table */}
      <div className="card overflow-hidden">
        {payslips.length === 0 ? (
          <EmptyState title="No payslips" description="No payslips have been generated yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Month</th>
                  <th>Working Days</th>
                  <th>Payable Days</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map(ps => (
                  <tr key={ps.id}>
                    {isAdmin && (
                      <td className="font-medium text-slate-900 dark:text-white">{ps.employee_name}</td>
                    )}
                    <td className="font-medium text-slate-700 dark:text-slate-300">
                      {getMonthName(ps.month)} {ps.year}
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">{ps.working_days}</td>
                    <td className="text-slate-600 dark:text-slate-400">{ps.payable_days}</td>
                    <td className="text-slate-600 dark:text-slate-400">{formatCurrency(ps.gross_salary)}</td>
                    <td className="text-rose-600">
                      {formatCurrency(ps.pf_deduction + ps.professional_tax + ps.additional_deductions)}
                    </td>
                    <td className="font-semibold text-emerald-600">{formatCurrency(ps.net_salary)}</td>
                    <td>
                      <button
                        onClick={() => setSelectedPayslip(ps)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payslip Detail Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 animate-fade-in" onClick={() => setSelectedPayslip(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Payslip — {getMonthName(selectedPayslip.month)} {selectedPayslip.year}
              </h2>
              <button onClick={() => setSelectedPayslip(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl space-y-2">
                <p className="text-sm"><span className="text-slate-500">Employee:</span> <span className="font-medium text-slate-900 dark:text-white">{selectedPayslip.employee_name}</span></p>
                <p className="text-sm"><span className="text-slate-500">ID:</span> <span className="font-mono">{selectedPayslip.employee_id_code}</span></p>
                <p className="text-sm"><span className="text-slate-500">Department:</span> {selectedPayslip.department_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Earnings</h3>
                {[
                  { label: 'Basic', value: selectedPayslip.basic },
                  { label: 'HRA', value: selectedPayslip.hra },
                  { label: 'Standard Allowance', value: selectedPayslip.standard_allowance },
                  { label: 'Performance Bonus', value: selectedPayslip.performance_bonus },
                  { label: 'LTA', value: selectedPayslip.lta },
                  { label: 'Fixed Allowance', value: selectedPayslip.fixed_allowance },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5 text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deductions</h3>
                {[
                  { label: 'PF', value: selectedPayslip.pf_deduction },
                  { label: 'Professional Tax', value: selectedPayslip.professional_tax },
                  { label: 'Other Deductions', value: selectedPayslip.additional_deductions },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5 text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-medium text-rose-600">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Salary</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(selectedPayslip.net_salary)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
