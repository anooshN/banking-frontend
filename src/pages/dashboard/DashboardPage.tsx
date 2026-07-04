import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { useGetTransactionsQuery } from '@/store/api/transactionsApi'
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, Send, Plus, CreditCard, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'

const DashboardPage: React.FC = () => {
  const { userId, email } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const { data: accounts, isLoading } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })
  const primaryAccount = accounts?.[0]
  const { data: txnPage } = useGetTransactionsQuery(
    { accountId: primaryAccount?.id ?? '', size: 5 },
    { skip: !primaryAccount?.id }
  )

  const totalBalance = accounts?.reduce((s, a) => s + a.balance, 0) ?? 0
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
  const firstName = email?.split('@')[0] ?? 'there'

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Good morning, {firstName} 👋</h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your money today.</p>
        </div>
        <button onClick={() => navigate('/transfers')}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-200">
          <Send size={15} /> Send Money
        </button>
      </div>

      {/* Total balance hero card */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'white', transform: 'translate(-20%, 20%)' }} />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium mb-1">Total Balance</p>
          <p className="text-4xl font-bold mb-4">{fmt(totalBalance)}</p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-blue-300 text-xs">Accounts</p>
              <p className="text-white font-semibold">{accounts?.length ?? 0}</p>
            </div>
            <div className="w-px h-8 bg-blue-400/30" />
            <div>
              <p className="text-blue-300 text-xs">Primary</p>
              <p className="text-white font-semibold">
                ••••{primaryAccount?.accountNumber.slice(-4) ?? '----'}
              </p>
            </div>
            <div className="w-px h-8 bg-blue-400/30" />
            <div>
              <p className="text-blue-300 text-xs">Status</p>
              <p className="text-green-300 font-semibold">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Transfer', icon: Send, color: '#3b82f6', bg: '#eff6ff', path: '/transfers' },
          { label: 'Accounts', icon: Wallet, color: '#10b981', bg: '#f0fdf4', path: '/accounts' },
          { label: 'Cards', icon: CreditCard, color: '#8b5cf6', bg: '#f5f3ff', path: '/cards' },
          { label: 'Reports', icon: BarChart3, color: '#f59e0b', bg: '#fffbeb', path: '/reports' },
        ].map(({ label, icon: Icon, color, bg, path }) => (
          <button key={label} onClick={() => navigate(path)}
            className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: bg }}>
              <Icon size={22} style={{ color }} />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Accounts list */}
        <div className="col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Your Accounts</h3>
            <button onClick={() => navigate('/accounts')}
              className="text-blue-600 text-sm font-medium hover:text-blue-700">View all</button>
          </div>
          {accounts?.map(account => (
            <div key={account.id} className="card p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/accounts')}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold
                    ${account.accountType === 'CHECKING' ? 'bg-blue-600' :
                      account.accountType === 'SAVINGS' ? 'bg-green-600' : 'bg-purple-600'}`}>
                    {account.accountType[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{account.accountType}</p>
                    <p className="text-xs text-gray-400">••••{account.accountNumber.slice(-4)}</p>
                  </div>
                </div>
                <span className="badge-success text-xs">{account.status}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{fmt(account.balance)}</p>
            </div>
          ))}
          <button onClick={() => navigate('/accounts')}
            className="w-full card p-3 flex items-center justify-center gap-2 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors border-dashed border-2 border-blue-200">
            <Plus size={16} /> Open Account
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <button onClick={() => navigate('/transactions')}
              className="text-blue-600 text-sm font-medium hover:text-blue-700">View all</button>
          </div>
          <div className="card overflow-hidden">
            {txnPage?.content && txnPage.content.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {txnPage.content.slice(0, 6).map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${txn.transactionType === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {txn.transactionType === 'CREDIT'
                          ? <ArrowDownLeft size={18} className="text-green-600" />
                          : <ArrowUpRight size={18} className="text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{txn.description || txn.transactionType}</p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(txn.createdAt), 'MMM dd, yyyy • HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${txn.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-500'}`}>
                        {txn.transactionType === 'CREDIT' ? '+' : '-'}{fmt(txn.amount)}
                      </p>
                      <p className="text-xs text-gray-400">{txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <TrendingUp size={40} className="mb-3 opacity-30" />
                <p className="text-sm">No transactions yet</p>
                <p className="text-xs mt-1">Make your first transfer to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
