import { apiSlice } from './apiSlice'

export interface Card {
  id: string
  accountId: string
  userId: string
  cardType: 'DEBIT' | 'CREDIT' | 'PREPAID' | 'VIRTUAL'
  cardNumberMasked: string
  cardholderName: string
  expiryDate: string
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'CANCELLED'
  dailyLimit: number
  monthlyLimit: number
  internationalEnabled: boolean
  contactlessEnabled: boolean
  onlineEnabled: boolean
  createdAt: string
}

export const cardsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyCards: builder.query<Card[], void>({
      query: () => ({ url: '/cards', method: 'GET' }),
      providesTags: ['Card'],
    }),
    blockCard: builder.mutation<Card, string>({
      query: (cardId) => ({ url: `/cards/${cardId}/block`, method: 'PATCH' }),
      invalidatesTags: ['Card'],
    }),
    updateLimits: builder.mutation<Card, { cardId: string; dailyLimit: number; monthlyLimit: number }>({
      query: ({ cardId, dailyLimit, monthlyLimit }) => ({
        url: `/cards/${cardId}/limits?dailyLimit=${dailyLimit}&monthlyLimit=${monthlyLimit}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Card'],
    }),
  }),
})

export const { useGetMyCardsQuery, useBlockCardMutation, useUpdateLimitsMutation } = cardsApi
