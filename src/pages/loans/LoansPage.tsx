import React, { useState } from 'react'
import { useGetMyLoansQuery, useApplyForLoanMutation } from '@/store/api/loansApi'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FileText, Plus, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'

const statusColors: Record<string, string> = {
  ACTIVE:       'bg-green-100 text-green-700',
  APPLIED:      'bg-yellow-100 text-yellow-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED:     'bg-emerald-100 text-emerald-700',
  CLOSED:       'bg-gray-100 text-gray-600',
  DEFAULTED:    'bg-red-100 text-red-700',
  REJECTED:     'bg-red-100 text-red-700',
}

const LoansPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: loans, isLoading } = useGetMyLoansQuery()
  const { data: accounts } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })
  const [applyForLoan, { isLoading: applying }] = useApplyForLoanMutation()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    accountId: '', loanType: 'PERSONAL', amount: '', tenureMonths: '12',
    interestRate: '9.5', purpose: '',
  })

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await applyForLoan({
        accountId: form.accountId || accounts?.[0]?.id || '',
        loanType: form.loanType,
        amount: Number(form.amount),
        tenureMonths: Number(form.tenureMonths),
        interestRate: Number(form.interestRate),
        purpose: form.purpose,
      }).unwrap()
      setShowForm(false)
      setForm({ accountId: '', loanType: 'PERSONAL', amount: '', tenureMonths: '12', interestRate: '9.5', purpose: '' })
    } catch {}
  }

  // EMI preview
  const calcEmi = (principal: number, annualRate: number, months: number) => {
    if (!principal || !months) return 0
    const r = annualRate / 1200
    const emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
    return isNaN(emi) ? 0 : emi
  }
  const previewEmi = calcEmi(Number(form.amount), Number(form.interestRate), Number(form.tenureMonths))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-500 mt-1">Manage your loans and EMI schedule</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-banking-primary text-white rounded-lg hover:bg-banking-secondary transition text-sm font-medium"
        >
          <Plus size={16} /> Apply for Loan
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Loan Application</h2>
          <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
              <select
                value={form.loanType}
                onChange={e => setForm(f => ({ ...f, loanType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['PERSONAL','HOME','AUTO','BUSINESS','EDUCATION','CREDIT_LINE'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="10000"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (months)</label>
              <input
                type="number"
                value={form.tenureMonths}
                onChange={e => setForm(f => ({ ...f, tenureMonths: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={form.interestRate}
                onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <input
                type="text"
                value={form.purpose}
                onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                placeholder="Describe the purpose of the loan"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {previewEmi > 0 && (
              <div className="md:col-span-2 bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                Estimated EMI: <strong>{formatCurrency(previewEmi)}/month</strong>
                &nbsp;· Total payable: <strong>{formatCurrency(previewEmi * Number(form.tenureMonths))}</strong>
              </div>
            )}
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={applying}
                className="px-4 py-2 bg-banking-primary text-white rounded-lg text-sm font-medium hover:bg-banking-secondary disabled:opacity-50"
              >
                {applying ? 'Submitting…' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loans?.map((loan) => (
            <div key={loan.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[loan.status] ?? ''}`}>
                  {loan.status}
                </span>
                <span className="text-xs text-gray-400 font-mono">{loan.loanNumber}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{loan.loanType} LOAN</p>
              <p className="text-sm text-gray-500 mb-4">{loan.purpose}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Principal</p>
                  <p className="font-semibold">{formatCurrency(loan.principalAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Outstanding</p>
                  <p className="font-semibold text-orange-600">{formatCurrency(loan.outstandingBalance)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">EMI</p>
                  <p className="font-semibold">{formatCurrency(loan.emiAmount)}/mo</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Rate</p>
                  <p className="font-semibold">{loan.interestRate}% p.a.</p>
                </div>
              </div>
              {loan.nextEmiDate && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <TrendingDown size={12} />
                  Next EMI: {format(new Date(loan.nextEmiDate), 'MMM dd, yyyy')}
                </div>
              )}
            </div>
          ))}
          {(!loans || loans.length === 0) && (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p>No loans found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LoansPage
