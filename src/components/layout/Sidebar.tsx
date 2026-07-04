import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  LayoutDashboard, Wallet, ArrowLeftRight, CreditCard,
  Receipt, Bell, User, FileText, Shield, Send,
  TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard',    color: '#3b82f6' },
  { to: '/accounts',      icon: Wallet,           label: 'Accounts',     color: '#10b981' },
  { to: '/transactions',  icon: TrendingUp,       label: 'Transactions', color: '#8b5cf6' },
  { to: '/transfers',     icon: Send,             label: 'Transfers',    color: '#f59e0b' },
  { to: '/payments',      icon: Receipt,          label: 'Payments',     color: '#ef4444' },
  { to: '/cards',         icon: CreditCard,       label: 'Cards',        color: '#06b6d4' },
  { to: '/loans',         icon: FileText,         label: 'Loans',        color: '#84cc16' },
  { to: '/notifications', icon: Bell,             label: 'Notifications',color: '#f97316' },
  { to: '/reports',       icon: FileText,         label: 'Reports',      color: '#a855f7' },
  { to: '/profile',       icon: User,             label: 'Profile',      color: '#64748b' },
]

const Sidebar: React.FC = () => {
  const { roles, email } = useSelector((state: RootState) => state.auth)
  const isAdmin = roles.includes('ROLE_ADMIN')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{ background: '#0a0f1e', width: collapsed ? 72 : 240 }}
      className="flex flex-col h-screen transition-all duration-300 relative flex-shrink-0">

      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm">BankingApp</div>
            <div className="text-blue-400 text-xs">Secure Banking</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, color }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
            title={collapsed ? label : ''}
          >
            {({ isActive }) => (
              <>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: isActive ? color + '30' : 'transparent' }}>
                  <Icon size={17} style={{ color: isActive ? color : 'currentColor' }} />
                </div>
                {!collapsed && <span className="font-medium">{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Shield size={17} />
            </div>
            {!collapsed && <span className="font-medium">Admin</span>}
          </NavLink>
        )}
      </nav>

      {/* User info at bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-medium truncate">{email}</div>
              <div className="text-slate-400 text-xs">Customer</div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
      >
        {collapsed ? <ChevronRight size={12} className="text-gray-600" /> : <ChevronLeft size={12} className="text-gray-600" />}
      </button>
    </aside>
  )
}

export default Sidebar
