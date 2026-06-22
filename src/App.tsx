import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy loaded pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const AccountsPage = lazy(() => import('./pages/accounts/AccountsPage'))
const TransactionsPage = lazy(() => import('./pages/transactions/TransactionsPage'))
const TransfersPage = lazy(() => import('./pages/transfers/TransfersPage'))
const PaymentsPage = lazy(() => import('./pages/payments/PaymentsPage'))
const CardsPage = lazy(() => import('./pages/cards/CardsPage'))
const LoansPage = lazy(() => import('./pages/loans/LoansPage'))
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'))
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
