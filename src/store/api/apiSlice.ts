import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axiosBaseQuery'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['Account', 'Transaction', 'Payment', 'Card', 'Loan', 'User', 'Notification'],
  endpoints: () => ({}),
})
