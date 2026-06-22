import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  email: string | null
  roles: string[]
  accessToken: string | null
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userId: localStorage.getItem('userId'),
  email: localStorage.getItem('email'),
  roles: JSON.parse(localStorage.getItem('roles') || '[]'),
  accessToken: localStorage.getItem('accessToken'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      userId: string, email: string, roles: string[], accessToken: string, refreshToken: string
    }>) => {
      const { userId, email, roles, accessToken, refreshToken } = action.payload
      state.isAuthenticated = true
      state.userId = userId
      state.email = email
      state.roles = roles
      state.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', userId)
      localStorage.setItem('email', email)
      localStorage.setItem('roles', JSON.stringify(roles))
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.userId = null
      state.email = null
      state.roles = []
      state.accessToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      localStorage.removeItem('roles')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
