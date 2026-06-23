import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Shield, Users, Activity, Settings, AlertTriangle } from 'lucide-react'

const AdminPage: React.FC = () => {
  const { roles } = useSelector((state: RootState) => state.auth)
  const isAdmin = roles.includes('ROLE_ADMIN')
  const [activeTab, setActiveTab] = useState('overview')

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-gray-500 mt-2">This page requires ADMIN role.</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview',  icon: <Activity size={16} />, label: 'Overview' },
    { id: 'users',     icon: <Users size={16} />,    label: 'Users' },
    { id: 'system',    icon: <Settings size={16} />, label: 'System' },
  ]

  const stats = [
    { label: 'Total Users',        value: '12,483',  change: '+234 today',   color: 'text-blue-600' },
    { label: 'Active Sessions',    value: '1,847',   change: 'Live',         color: 'text-green-600' },
    { label: 'Transactions Today', value: '48,291',  change: '$24.5M volume',color: 'text-purple-600' },
    { label: 'Fraud Alerts',       value: '7',       change: '3 critical',   color: 'text-red-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield size={24} className="text-red-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-0.5">System administration and monitoring</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, change, color }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-1">{change}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Fraud Alerts</h2>
            <div className="space-y-3">
              {[
                { user: 'user-7823', amount: '$45,000', rail: 'SWIFT', risk: 'CRITICAL', time: '2 min ago' },
                { user: 'user-1124', amount: '$12,500', rail: 'FED',   risk: 'HIGH',     time: '15 min ago' },
                { user: 'user-5591', amount: '$8,200',  rail: 'ACH',   risk: 'MEDIUM',   time: '1 hr ago' },
              ].map(alert => (
                <div key={alert.user} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      alert.risk === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      alert.risk === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{alert.risk}</span>
                    <span className="text-sm font-mono text-gray-700">{alert.user}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{alert.amount} via {alert.rail}</p>
                    <p className="text-xs text-gray-400">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">User Management</h2>
          <p className="text-gray-400 text-sm">Full user CRUD, role assignment, KYC review, and account locking — connects to user-service and auth-service APIs.</p>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">System Configuration</h2>
          <p className="text-gray-400 text-sm">Feature flags, rate limits, fraud thresholds, Kafka topic management, and service health — ADMIN only.</p>
        </div>
      )}
    </div>
  )
}

export default AdminPage
