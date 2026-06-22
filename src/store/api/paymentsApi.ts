import { apiSlice } from './apiSlice'

export interface Payment {
  id: string
  paymentReference: string
  senderAccountId: string
  receiverAccountNumber: string
  receiverBankCode?: string
  receiverName: string
  amount: number
  currencyCode: string
  paymentRail: 'SWIFT' | 'FEDWIRE' | 'CHIPS' | 'INTERNAL' | 'ACH'
  status: 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED'
  description?: string
  createdAt: string
}

export interface InitiatePaymentRequest {
  senderAccountId: string
  receiverAccountNumber: string
  receiverBankCode?: string
  receiverName: string
  amount: number
  currency: string
  paymentRail: string
  description?: string
}

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation<Payment, InitiatePaymentRequest>({
      query: (data) => ({
        url: `/payments/initiate`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Payment', 'Transaction'],
    }),
    getPayments: builder.query<Payment[], string>({
      query: (accountId) => ({ url: `/payments/account/${accountId}`, method: 'GET' }),
      providesTags: ['Payment'],
    }),
  }),
})

export const { useInitiatePaymentMutation, useGetPaymentsQuery } = paymentsApi
