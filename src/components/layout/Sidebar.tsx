import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  LayoutDashboard, Wallet, ArrowLeftRight, CreditCard,
  Receipt, Bell, User, FileText, Settings, Shield
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts',      icon: Wallet,           label: 'Accounts' },
  { to: '/transactions',  icon: ArrowLeftRight,   label: 'Transactions' },
  { to: '/transfers',     icon: ArrowLeftRight,   label: 'Transfers' },
  { to: '/payments',      icon: Receipt,          label: 'Payments' },
  { to: '/cards',         icon: CreditCard,       label: 'Cards' },
  { to: '/loans',         icon: FileText,         label: 'Loans' },
  { to: '/notifications', icon: Bell,             label: 'Notifications' },
  { to: '/reports',       icon: FileText,         label: 'Reports' },
  { to: '/profile',       icon: User,             label: 'Profile' },
]

const Sidebar: React.FC = () => {
  const { roles } = useSelector((state: RootState) => state.auth)
  const isAdmin = roles.includes('ROLE_ADMIN')

  return (
    <aside className="w-64 bg-banking-primary text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-xl font-bold">BankingApp</h1>
        <p className="text-blue-300 text-xs mt-1">Secure Banking</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-red-700 text-white' : 'text-red-300 hover:bg-red-800 hover:text-white'
              }`
            }
          >
            <Shield size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
