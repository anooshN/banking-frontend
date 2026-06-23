import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetMyAccountsQuery } from '@/store/api/accountsApi'
import { apiSlice } from '@/store/api/apiSlice'
import { FileText, Download, FileSpreadsheet, File } from 'lucide-react'

const ReportsPage: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: accounts } = useGetMyAccountsQuery(userId ?? '', { skip: !userId })

  const [form, setForm] = useState({
    accountId: '',
    fromDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    format: 'PDF',
  })
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setDownloadUrl(null)
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1500))
      setDownloadUrl('/mock-statement.pdf')
    } finally {
      setLoading(false)
    }
  }

  const formatIcons: Record<string, React.ReactNode> = {
    PDF:   <File size={16} className="text-red-500" />,
    CSV:   <FileText size={16} className="text-green-500" />,
    EXCEL: <FileSpreadsheet size={16} className="text-blue-500" />,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Statements</h1>
        <p className="text-gray-500 mt-1">Generate and download your account statements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statement generator */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Generate Statement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select
                value={form.accountId}
                onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All accounts</option>
                {accounts?.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.accountType} — ••••{a.accountNumber.slice(-4)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  value={form.fromDate}
                  onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  value={form.toDate}
                  onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex gap-2">
                {['PDF', 'CSV', 'EXCEL'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setForm(f => ({ ...f, format: fmt }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition ${
                      form.format === fmt
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {formatIcons[fmt]} {fmt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 bg-banking-primary text-white rounded-lg font-medium hover:bg-banking-secondary transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Generating…</>
              ) : (
                <><FileText size={16} /> Generate Statement</>
              )}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
              >
                <Download size={16} /> Download Statement
              </a>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Report Types</h2>
          <div className="space-y-3">
            {[
              { icon: <FileText size={20} className="text-red-500" />, title: 'Account Statement', desc: 'Full transaction history for a date range' },
              { icon: <FileSpreadsheet size={20} className="text-green-500" />, title: 'Transaction Export', desc: 'CSV export for accounting software' },
              { icon: <File size={20} className="text-blue-500" />, title: 'Tax Report', desc: 'Annual interest and transaction summary' },
              { icon: <Download size={20} className="text-purple-500" />, title: 'Portfolio Report', desc: 'Investment account performance (coming soon)' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
