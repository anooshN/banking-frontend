import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, LogOut, Search, Settings } from 'lucide-react'
import { RootState } from '@/store/store'
import { logout } from '@/store/slices/authSlice'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':     { title: 'Dashboard',     subtitle: 'Your financial overview' },
  '/accounts':      { title: 'Accounts',      subtitle: 'Manage your bank accounts' },
  '/transactions':  { title: 'Transactions',  subtitle: 'Transaction history' },
  '/transfers':     { title: 'Transfers',     subtitle: 'Move money between accounts' },
  '/payments':      { title: 'Payments',      subtitle: 'Send payments worldwide' },
  '/cards':         { title: 'Cards',         subtitle: 'Manage your cards' },
  '/loans':         { title: 'Loans',         subtitle: 'Loan products and applications' },
  '/notifications': { title: 'Notifications', subtitle: 'Updates and alerts' },
  '/reports':       { title: 'Reports',       subtitle: 'Financial insights' },
  '/profile':       { title: 'Profile',       subtitle: 'Account settings' },
}

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { email } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.notifications)

  const page = pageTitles[location.pathname] || { title: 'Banking', subtitle: '' }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{page.title}</h1>
        <p className="text-sm text-gray-500">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <Bell size={18} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <Settings size={18} className="text-gray-600" />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
