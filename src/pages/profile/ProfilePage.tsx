import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { User, Shield, Bell, Key } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { email, roles } = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState<'profile'|'security'|'notifications'>('profile')

  const tabs = [
    { id: 'profile',        icon: <User size={16} />,   label: 'Profile' },
    { id: 'security',       icon: <Shield size={16} />, label: 'Security & KYC' },
    { id: 'notifications',  icon: <Bell size={16} />,   label: 'Notifications' },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and settings</p>
      </div>

      {/* Avatar + email */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-banking-primary flex items-center justify-center text-white text-2xl font-bold">
          {email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{email}</p>
          <div className="flex gap-2 mt-1">
            {roles.map(role => (
              <span key={role} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {activeTab === 'profile' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'First Name', placeholder: 'John' },
              { label: 'Last Name', placeholder: 'Doe' },
              { label: 'Phone Number', placeholder: '+1 555 000 0000' },
              { label: 'Date of Birth', placeholder: 'MM/DD/YYYY', type: 'date' },
              { label: 'Address', placeholder: '123 Main St', full: true },
              { label: 'City', placeholder: 'New York' },
              { label: 'State', placeholder: 'NY' },
              { label: 'Postal Code', placeholder: '10001' },
              { label: 'Country', placeholder: 'United States' },
            ].map(({ label, placeholder, type, full }) => (
              <div key={label} className={full ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type ?? 'text'}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <button className="px-4 py-2 bg-banking-primary text-white rounded-lg text-sm font-medium hover:bg-banking-secondary transition">
            Save Changes
          </button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Key size={18} /> Change Password
            </h2>
            <div className="space-y-3 max-w-sm">
              {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <button className="px-4 py-2 bg-banking-primary text-white rounded-lg text-sm font-medium hover:bg-banking-secondary transition">
                Update Password
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Shield size={18} /> KYC Verification
            </h2>
            <p className="text-sm text-gray-500 mb-4">Submit your identity documents for KYC verification.</p>
            <div className="space-y-3 max-w-sm">
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>PASSPORT</option>
                <option>DRIVING_LICENSE</option>
                <option>NATIONAL_ID</option>
              </select>
              <input type="text" placeholder="Document Number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="px-4 py-2 bg-banking-primary text-white rounded-lg text-sm font-medium hover:bg-banking-secondary transition">
                Submit KYC
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { label: 'Transaction Alerts', desc: 'Notify on every debit/credit' },
              { label: 'Login Alerts', desc: 'Notify on new logins from unknown devices' },
              { label: 'Payment Reminders', desc: 'Remind before EMI due date' },
              { label: 'Promotional Offers', desc: 'Receive offers and news' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-blue-600 transition">
                  <span className="translate-x-5 inline-block h-3 w-3 transform rounded-full bg-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
