import { apiSlice } from './apiSlice'

export interface Loan {
  id: string
  loanNumber: string
  userId: string
  accountId: string
  loanType: 'PERSONAL' | 'HOME' | 'AUTO' | 'BUSINESS' | 'EDUCATION' | 'CREDIT_LINE'
  status: 'APPLIED' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'DEFAULTED' | 'REJECTED'
  principalAmount: number
  outstandingBalance: number
  interestRate: number
  tenureMonths: number
  emiAmount: number
  disbursementDate?: string
  maturityDate?: string
  nextEmiDate?: string
  purpose?: string
  createdAt: string
}

export interface LoanApplicationRequest {
  accountId: string
  loanType: string
  amount: number
  tenureMonths: number
  interestRate: number
  purpose: string
}

export const loansApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyLoans: builder.query<Loan[], void>({
      query: () => ({ url: '/loans', method: 'GET' }),
      providesTags: ['Loan'],
    }),
    applyForLoan: builder.mutation<Loan, LoanApplicationRequest>({
      query: ({ accountId, loanType, amount, tenureMonths, interestRate, purpose }) => ({
        url: `/loans/apply?accountId=${accountId}&loanType=${loanType}&amount=${amount}&tenureMonths=${tenureMonths}&interestRate=${interestRate}&purpose=${encodeURIComponent(purpose)}`,
        method: 'POST',
      }),
      invalidatesTags: ['Loan'],
    }),
  }),
})

export const { useGetMyLoansQuery, useApplyForLoanMutation } = loansApi
