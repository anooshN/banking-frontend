import React from 'react'

const AdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-gray-500 mt-1">System administration — ADMIN role only</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-400">Coming in Phase 7 — Full implementation with API integration</p>
      </div>
    </div>
  )
}

export default AdminPage
