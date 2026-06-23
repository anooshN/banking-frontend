import { store } from '../store/store'
import { addNotification, markAsRead, markAllAsRead } from '../store/slices/notificationSlice'

const makeNotification = (id: string, read = false) => ({
  id,
  title: `Alert ${id}`,
  message: `Message ${id}`,
  type: 'info' as const,
  read,
  timestamp: new Date().toISOString()
})

describe('notificationSlice', () => {
  it('should add notification and increment unread count', () => {
    store.dispatch(addNotification(makeNotification('n1')))
    const state = store.getState().notifications
    expect(state.notifications).toHaveLength(1)
    expect(state.unreadCount).toBe(1)
  })

  it('should mark single notification as read', () => {
    store.dispatch(addNotification(makeNotification('n2')))
    store.dispatch(markAsRead('n2'))
    const state = store.getState().notifications
    const n = state.notifications.find(x => x.id === 'n2')
    expect(n?.read).toBe(true)
  })

  it('should mark all as read and reset count', () => {
    store.dispatch(addNotification(makeNotification('n3')))
    store.dispatch(addNotification(makeNotification('n4')))
    store.dispatch(markAllAsRead())
    const state = store.getState().notifications
    expect(state.unreadCount).toBe(0)
    expect(state.notifications.every(n => n.read)).toBe(true)
  })
})
