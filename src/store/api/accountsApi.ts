import { apiSlice } from './apiSlice'

export interface Account {
  id: string
  accountNumber: string
  userId: string
  accountType: 'CHECKING' | 'SAVINGS' | 'INVESTMENT'
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'CLOSED'
  balance: number
  availableBalance: number
  currencyCode: string
  routingNumber: string
  createdAt: string
}

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAccounts: builder.query<Account[], string>({
      query: (userId) => ({ url: `/accounts/user/${userId}`, method: 'GET' }),
      providesTags: ['Account'],
    }),
    getAccount: builder.query<Account, string>({
      query: (id) => ({ url: `/accounts/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    createAccount: builder.mutation<Account, { userId: string; type: string; currency?: string }>({
      query: ({ userId, type, currency = 'USD' }) => ({
        url: `/accounts/user/${userId}?type=${type}&currency=${currency}`,
        method: 'POST',
      }),
      invalidatesTags: ['Account'],
    }),
  }),
})

export const { useGetMyAccountsQuery, useGetAccountQuery, useCreateAccountMutation } = accountsApi
