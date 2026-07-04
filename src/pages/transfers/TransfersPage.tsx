import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { useTransferMutation } from '@/store/api/transactionsApi'
import { ArrowRight, CheckCircle } from 'lucide-react'

const TransfersPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: accounts } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })
  const [transfer, { isLoading, isSuccess, reset }] = useTransferMutation()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.fromAccountId || !form.toAccountId || !form.amount) {
      setError('Please fill in all required fields')
      return
    }
    if (form.fromAccountId === form.toAccountId) {
      setError('Cannot transfer to the same account')
      return
    }
    try {
      await transfer({
        fromAccountId: form.fromAccountId || accounts?.[0]?.id || '',
        toAccountId: form.toAccountId,
        amount: Number(form.amount),
        description: form.description || 'Transfer',
      }).unwrap()
    } catch (err: any) {
      setError(err?.data?.message || 'Transfer failed. Please try again.')
    }
  }

  if (isSuccess) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <CheckCircle size={56} className="text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Completed!</h2>
      <p className="text-gray-500 mb-6">Your money has been transferred successfully.</p>
      <button onClick={reset} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
        Make Another Transfer
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
        <p className="text-gray-500 mt-1">Transfer money between your accounts</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
            <select name="fromAccountId" value={form.fromAccountId} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select account</option>
              {accounts?.map(a => (
                <option key={a.id} value={a.id}>
                  {a.accountType} — ••••{a.accountNumber.slice(-4)} (${a.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
            <select name="toAccountId" value={form.toAccountId} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select account</option>
              {accounts?.filter(a => a.id !== form.fromAccountId).map(a => (
                <option key={a.id} value={a.id}>
                  {a.accountType} — ••••{a.accountNumber.slice(-4)} (${a.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Transfer description"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Processing...' : (
              <>Transfer <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TransfersPage
