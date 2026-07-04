import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/store/api/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { Shield, Eye, EyeOff, Lock, Mail } from 'lucide-react'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [form, setForm] = useState({ email: '', password: '', mfaCode: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const result = await login(form).unwrap()
      dispatch(setCredentials(result))
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #1a2744 100%)' }}>

      {/* Left side — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="font-bold text-lg">B</span>
          </div>
          <span className="font-bold text-xl">BankingApp</span>
        </div>

        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Banking made<br />
            <span className="text-blue-400">simple & secure</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Manage your accounts, send money, and track your finances — all in one place.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Accounts', value: '4+' },
              { label: 'Transactions', value: '∞' },
              { label: 'Security', value: '256-bit' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-slate-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-500 text-sm">© 2026 BankingApp. All rights reserved.</p>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                <Lock size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-gray-500 text-sm">Sign in to your account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="john@banking.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <Shield size={15} />
                  {error}
                </div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
              <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">Protected by 256-bit AES encryption and JWT authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
