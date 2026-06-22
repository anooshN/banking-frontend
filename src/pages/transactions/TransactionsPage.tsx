import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { useGetTransactionsQuery } from '@/store/api/transactionsApi'
import { Search, ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

const TransactionsPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: accounts } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')

  const accountId = selectedAccountId || accounts?.[0]?.id || ''

  const { data: txnPage, isLoading } = useGetTransactionsQuery(
    { accountId, page, size: 20 },
    { skip: !accountId }
  )

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const filtered = txnPage?.content.filter(t =>
    !search || t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.referenceNumber.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const typeIcon = (type: string) =>
    type === 'CREDIT' || type === 'TRANSFER_IN'
      ? <ArrowDownLeft size={14} className="text-green-600" />
      : <ArrowUpRight size={14} className="text-red-600" />

  const typeColor = (type: string) =>
    type === 'CREDIT' || type === 'TRANSFER_IN' ? 'text-green-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500 mt-1">View and search your transaction history</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Account selector */}
          <select
            value={selectedAccountId}
            onChange={e => { setSelectedAccountId(e.target.value); setPage(0) }}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {accounts?.map(a => (
              <option key={a.id} value={a.id}>
                {a.accountType} — ••••{a.accountNumber.slice(-4)}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 py-3">Reference</th>
                    <th className="text-left text-xs font-medium text-gray-400 py-3">Description</th>
                    <th className="text-left text-xs font-medium text-gray-400 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-gray-400 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-gray-400 py-3">Amount</th>
                    <th className="text-right text-xs font-medium text-gray-400 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 text-xs font-mono text-gray-500">{txn.referenceNumber.slice(0, 12)}…</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            txn.transactionType === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {typeIcon(txn.transactionType)}
                          </span>
                          <span className="text-sm text-gray-900">{txn.description || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-gray-500">{format(new Date(txn.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          txn.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className={`py-3 text-right text-sm font-semibold ${typeColor(txn.transactionType)}`}>
                        {txn.transactionType === 'CREDIT' || txn.transactionType === 'TRANSFER_IN' ? '+' : '-'}
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="py-3 text-right text-sm text-gray-600">{formatCurrency(txn.balanceAfter)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {txnPage && txnPage.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {page * 20 + 1}–{Math.min((page + 1) * 20, txnPage.totalElements)} of {txnPage.totalElements}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={txnPage.first}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-gray-700">{page + 1} / {txnPage.totalPages}</span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={txnPage.last}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionsPage
