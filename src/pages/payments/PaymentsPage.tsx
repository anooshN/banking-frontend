import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { useGetPaymentsQuery } from '@/store/api/paymentsApi'
import { Receipt } from 'lucide-react'
import { format } from 'date-fns'

const statusColors: Record<string, string> = {
  COMPLETED:   'bg-green-100 text-green-700',
  INITIATED:   'bg-blue-100 text-blue-700',
  PROCESSING:  'bg-yellow-100 text-yellow-700',
  FAILED:      'bg-red-100 text-red-700',
  REVERSED:    'bg-gray-100 text-gray-600',
}

const PaymentsPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: accounts } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })
  const primaryAccountId = accounts?.[0]?.id ?? ''
  const { data: payments, isLoading } = useGetPaymentsQuery(primaryAccountId, { skip: !primaryAccountId })

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">View your payment history — SWIFT, FEDWIRE, CHIPS, ACH</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Reference', 'To', 'Rail', 'Date', 'Status', 'Amount'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments?.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{payment.paymentReference}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{payment.receiverName}</p>
                    <p className="text-xs text-gray-400">{payment.receiverAccountNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                      {payment.paymentRail}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[payment.status] ?? ''}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">
                    -{formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}
              {(!payments || payments.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Receipt size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No payments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PaymentsPage
