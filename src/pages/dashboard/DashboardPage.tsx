import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { useGetTransactionsQuery } from '@/store/api/transactionsApi'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Wallet, TrendingUp, CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'

const DashboardPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: accounts, isLoading: loadingAccounts } = useGetMyAccountsQuery(userId ?? '', {
    skip: !userId,
  })

  const primaryAccount = accounts?.[0]
  const { data: txnPage } = useGetTransactionsQuery(
    { accountId: primaryAccount?.id ?? '', size: 5 },
    { skip: !primaryAccount?.id }
  )

  const totalBalance = accounts?.reduce((sum, a) => sum + a.balance, 0) ?? 0

  const chartData = txnPage?.content
    ? [...txnPage.content].reverse().map((t, i) => ({
        name: format(new Date(t.createdAt), 'MMM dd'),
        balance: t.balanceAfter,
      }))
    : []

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  if (loadingAccounts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={<Wallet className="text-blue-600" size={20} />}
          bg="bg-blue-50"
          change="+2.4%"
          positive
        />
        <SummaryCard
          title="Accounts"
          value={String(accounts?.length ?? 0)}
          icon={<CreditCard className="text-green-600" size={20} />}
          bg="bg-green-50"
        />
        <SummaryCard
          title="Total Credited"
          value={formatCurrency(
            txnPage?.content
              .filter(t => t.transactionType === 'CREDIT')
              .reduce((s, t) => s + t.amount, 0) ?? 0
          )}
          icon={<ArrowDownLeft className="text-emerald-600" size={20} />}
          bg="bg-emerald-50"
          positive
        />
        <SummaryCard
          title="Total Debited"
          value={formatCurrency(
            txnPage?.content
              .filter(t => t.transactionType === 'DEBIT')
              .reduce((s, t) => s + t.amount, 0) ?? 0
          )}
          icon={<ArrowUpRight className="text-red-600" size={20} />}
          bg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Balance History</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="balance" stroke="#3182ce" fill="#ebf8ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              No transaction data yet
            </div>
          )}
        </div>

        {/* Accounts list */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Accounts</h2>
          <div className="space-y-3">
            {accounts?.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{account.accountType}</p>
                  <p className="text-xs text-gray-500">••••{account.accountNumber.slice(-4)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {account.status}
                  </span>
                </div>
              </div>
            ))}
            {(!accounts || accounts.length === 0) && (
              <p className="text-gray-400 text-sm text-center py-4">No accounts found</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="divide-y divide-gray-100">
          {txnPage?.content.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  txn.transactionType === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {txn.transactionType === 'CREDIT'
                    ? <ArrowDownLeft size={14} className="text-green-600" />
                    : <ArrowUpRight size={14} className="text-red-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{txn.description || txn.referenceNumber}</p>
                  <p className="text-xs text-gray-500">{format(new Date(txn.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  txn.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.transactionType === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                </p>
                <span className={`text-xs ${
                  txn.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
          {(!txnPage?.content || txnPage.content.length === 0) && (
            <p className="text-gray-400 text-sm text-center py-8">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  )
}

const SummaryCard: React.FC<{
  title: string
  value: string
  icon: React.ReactNode
  bg: string
  change?: string
  positive?: boolean
}> = ({ title, value, icon, bg, change, positive }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-gray-500">{title}</p>
      <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>{icon}</div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {change && (
      <p className={`text-xs mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change} this month
      </p>
    )}
  </div>
)

export default DashboardPage
