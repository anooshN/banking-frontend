import { store } from '../store/store'
import { setCredentials, logout } from '../store/slices/authSlice'

describe('authSlice', () => {
  afterEach(() => {
    localStorage.clear()
    store.dispatch(logout())
  })

  it('should set credentials and persist to localStorage', () => {
    store.dispatch(setCredentials({
      userId: 'user-1',
      email: 'test@banking.com',
      roles: ['ROLE_CUSTOMER'],
      accessToken: 'access.token.here',
      refreshToken: 'refresh.token.here',
      expiresIn: 900,
      mfaRequired: false
    }))

    const state = store.getState().auth
    expect(state.isAuthenticated).toBe(true)
    expect(state.userId).toBe('user-1')
    expect(state.email).toBe('test@banking.com')
    expect(state.roles).toContain('ROLE_CUSTOMER')
    expect(localStorage.getItem('accessToken')).toBe('access.token.here')
  })

  it('should clear everything on logout', () => {
    store.dispatch(setCredentials({
      userId: 'user-1',
      email: 'test@banking.com',
      roles: ['ROLE_CUSTOMER'],
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 900,
      mfaRequired: false
    }))

    store.dispatch(logout())

    const state = store.getState().auth
    expect(state.isAuthenticated).toBe(false)
    expect(state.userId).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('userId')).toBeNull()
  })
})
