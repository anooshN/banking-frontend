import { apiSlice } from './apiSlice'
import type { AuthResponse } from '../slices/authSlice'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string; mfaCode?: string }>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', data: credentials }),
    }),
    register: builder.mutation<AuthResponse, { email: string; password: string; firstName: string; lastName: string }>({
      query: (data) => ({ url: '/auth/register', method: 'POST', data }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi
