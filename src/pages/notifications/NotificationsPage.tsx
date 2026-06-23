import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { markAsRead, markAllAsRead } from '@/store/slices/notificationSlice'
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const typeConfig = {
  info:    { icon: <Info size={16} />,          color: 'text-blue-500',  bg: 'bg-blue-50'  },
  success: { icon: <CheckCircle size={16} />,   color: 'text-green-500', bg: 'bg-green-50' },
  warning: { icon: <AlertTriangle size={16} />, color: 'text-yellow-500',bg: 'bg-yellow-50'},
  error:   { icon: <XCircle size={16} />,       color: 'text-red-500',   bg: 'bg-red-50'   },
}

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => {
            const config = typeConfig[n.type] ?? typeConfig.info
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition cursor-pointer ${
                  !n.read ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => dispatch(markAsRead(n.id))}
              >
                <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
