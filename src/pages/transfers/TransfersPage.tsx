import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { useInitiatePaymentMutation } from '@/store/api/paymentsApi'
import { ArrowRight, CheckCircle } from 'lucide-react'

const RAILS = ['INTERNAL', 'ACH', 'FEDWIRE', 'SWIFT', 'CHIPS']

const TransfersPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: accounts } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })
  const [initiate, { isLoading, isSuccess, reset }] = useInitiatePaymentMutation()

  const [form, setForm] = useState({
    senderAccountId: '', receiverAccountNumber: '', receiverBankCode: '',
    receiverName: '', amount: '', currency: 'USD', paymentRail: 'INTERNAL', description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await initiate({
      ...form,
      senderAccountId: form.senderAccountId || accounts?.[0]?.id || '',
      amount: Number(form.amount),
    })
  }

  if (isSuccess) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <CheckCircle size={56} className="text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Initiated!</h2>
      <p className="text-gray-500 mb-6">Your transfer has been submitted and is being processed.</p>
      <button onClick={reset} className="px-6 py-2 bg-banking-primary text-white rounded-lg font-medium hover:bg-banking-secondary transition">
        Make Another Transfer
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
        <p className="text-gray-500 mt-1">Send money via INTERNAL, ACH, FEDWIRE, SWIFT, or CHIPS</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
            <select name="senderAccountId" value={form.senderAccountId} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {accounts?.map(a => (
                <option key={a.id} value={a.id}>
                  {a.accountType} — ••••{a.accountNumber.slice(-4)} (${a.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Rail</label>
            <div className="flex flex-wrap gap-2">
              {RAILS.map(rail => (
                <button
                  key={rail} type="button"
                  onClick={() => setForm(f => ({ ...f, paymentRail: rail }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    form.paymentRail === rail
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {rail}
                </button>
              ))}
            </div>
          </div>

          {['receiverAccountNumber', 'receiverBankCode', 'receiverName'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === 'receiverAccountNumber' ? 'Receiver Account Number' :
                 field === 'receiverBankCode' ? 'Bank Code (SWIFT/BIC/ABA)' : 'Receiver Name'}
              </label>
              <input
                type="text"
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                required={field !== 'receiverBankCode'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['USD','EUR','GBP','JPY','CAD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Rent, invoice #123..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-banking-primary text-white rounded-lg font-semibold hover:bg-banking-secondary transition disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : <><ArrowRight size={18} /> Initiate Transfer</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TransfersPage
