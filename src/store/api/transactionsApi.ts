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

export interface TransferRequest {
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
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
    transfer: builder.mutation<{ debitTxn: string; creditTxn: string; status: string }, TransferRequest>({
      query: (data) => ({
        url: '/transactions/transfer',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Transaction', 'Account'],
    }),
  }),
})

export const { useGetTransactionsQuery, useTransferMutation } = transactionsApi
