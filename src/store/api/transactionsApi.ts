import { apiSlice } from './apiSlice'

export interface Transaction {
  id: string
  referenceNumber: string
  accountId: string
  userId: string
  transactionType: 'DEBIT' | 'CREDIT' | 'TRANSFER_OUT' | 'TRANSFER_IN'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED'
  amount: number
  currencyCode: string
  balanceBefore: number
  balanceAfter: number
  description: string
  counterpartyAccount?: string
  counterpartyName?: string
  paymentRail?: string
  createdAt: string
}

export interface PageResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
}

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<PageResponse<Transaction>, { accountId: string; page?: number; size?: number }>({
      query: ({ accountId, page = 0, size = 20 }) => ({
        url: `/transactions/account/${accountId}?page=${page}&size=${size}`,
        method: 'GET',
      }),
      providesTags: ['Transaction'],
    }),
  }),
})

export const { useGetTransactionsQuery } = transactionsApi
