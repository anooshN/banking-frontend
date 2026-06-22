import React from 'react'

const TransactionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-gray-500 mt-1">View and search your transaction history</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-400">Coming in Phase 7 — Full implementation with API integration</p>
      </div>
    </div>
  )
}

export default TransactionsPage
