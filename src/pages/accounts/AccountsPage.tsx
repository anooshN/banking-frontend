import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery, useCreateAccountMutation } from '@/store/api/accountsApi'
import { Wallet, Plus, Eye, Copy } from 'lucide-react'

const AccountsPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: accounts, isLoading, refetch } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })
  const [createAccount, { isLoading: creating }] = useCreateAccountMutation()
  const [showCreate, setShowCreate] = useState(false)
  const [newAccountType, setNewAccountType] = useState('CHECKING')

  const handleCreate = async () => {
    if (!userId) return
    try {
      await createAccount({ userId, type: newAccountType }).unwrap()
      setShowCreate(false)
      refetch()
    } catch (err) {
      console.error('Failed to create account', err)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const typeColors: Record<string, string> = {
    CHECKING:   'bg-blue-100 text-blue-700',
    SAVINGS:    'bg-green-100 text-green-700',
    INVESTMENT: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-500 mt-1">Manage your bank accounts</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-banking-primary text-white rounded-lg hover:bg-banking-secondary transition text-sm font-medium"
        >
          <Plus size={16} /> Open Account
        </button>
      </div>

      {showCreate && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Open New Account</h2>
          <div className="flex gap-3 mb-4">
            {['CHECKING', 'SAVINGS', 'INVESTMENT'].map((type) => (
              <button
                key={type}
                onClick={() => setNewAccountType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  newAccountType === type
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-banking-primary text-white rounded-lg text-sm font-medium hover:bg-banking-secondary disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Account'}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts?.map((account) => (
            <div key={account.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[account.accountType] ?? 'bg-gray-100 text-gray-600'}`}>
                  {account.accountType}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {account.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-mono">{account.accountNumber}</p>
                <button onClick={() => navigator.clipboard.writeText(account.accountNumber)} className="text-gray-400 hover:text-gray-600">
                  <Copy size={12} />
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-3">
                {formatCurrency(account.balance)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Available: {formatCurrency(account.availableBalance)}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Routing: {account.routingNumber ?? '—'}</span>
                <span>{account.currencyCode}</span>
              </div>
            </div>
          ))}
          {(!accounts || accounts.length === 0) && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <Wallet size={40} className="mx-auto mb-3 opacity-30" />
              <p>No accounts found. Open your first account.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountsPage
