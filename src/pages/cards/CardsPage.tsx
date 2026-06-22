import React, { useState } from 'react'
import { useGetMyCardsQuery, useBlockCardMutation } from '@/store/api/cardsApi'
import { CreditCard, ShieldOff, Wifi, Globe, ShoppingCart } from 'lucide-react'
import { format } from 'date-fns'

const CardsPage: React.FC = () => {
  const { data: cards, isLoading } = useGetMyCardsQuery()
  const [blockCard, { isLoading: blocking }] = useBlockCardMutation()
  const [confirmBlock, setConfirmBlock] = useState<string | null>(null)

  const handleBlock = async (cardId: string) => {
    try {
      await blockCard(cardId).unwrap()
      setConfirmBlock(null)
    } catch {}
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  const cardGradients: Record<string, string> = {
    DEBIT:   'from-blue-600 to-blue-800',
    CREDIT:  'from-gray-800 to-gray-900',
    PREPAID: 'from-emerald-600 to-teal-700',
    VIRTUAL: 'from-purple-600 to-indigo-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cards</h1>
        <p className="text-gray-500 mt-1">Manage your debit and credit cards</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards?.map((card) => (
            <div key={card.id} className="space-y-4">
              {/* Card visual */}
              <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${cardGradients[card.cardType] ?? 'from-gray-700 to-gray-900'} text-white shadow-lg aspect-[1.586/1]`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs opacity-70 uppercase tracking-wider">BankingApp</p>
                    <p className="text-sm font-medium mt-1">{card.cardType} CARD</p>
                  </div>
                  <Wifi size={24} className="opacity-70 rotate-90" />
                </div>
                <p className="text-xl font-mono tracking-widest mb-4">{card.cardNumberMasked}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-60 uppercase">Cardholder</p>
                    <p className="text-sm font-medium">{card.cardholderName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-60 uppercase">Expires</p>
                    <p className="text-sm font-medium">{format(new Date(card.expiryDate), 'MM/yy')}</p>
                  </div>
                </div>
                {card.status === 'BLOCKED' && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                    <p className="text-white font-bold text-lg tracking-wider">BLOCKED</p>
                  </div>
                )}
              </div>

              {/* Card controls */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Feature icon={<Globe size={14} />} label="International" enabled={card.internationalEnabled} />
                  <Feature icon={<Wifi size={14} />} label="Contactless" enabled={card.contactlessEnabled} />
                  <Feature icon={<ShoppingCart size={14} />} label="Online" enabled={card.onlineEnabled} />
                </div>
                <div className="flex gap-2 text-sm text-gray-600 mb-3">
                  <span>Daily limit: <strong>{formatCurrency(card.dailyLimit)}</strong></span>
                  <span className="text-gray-300">|</span>
                  <span>Monthly: <strong>{formatCurrency(card.monthlyLimit)}</strong></span>
                </div>
                {card.status === 'ACTIVE' && (
                  confirmBlock === card.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBlock(card.id)}
                        disabled={blocking}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirm Block
                      </button>
                      <button
                        onClick={() => setConfirmBlock(null)}
                        className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmBlock(card.id)}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                    >
                      <ShieldOff size={14} /> Block Card
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
          {(!cards || cards.length === 0) && (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
              <p>No cards found. Contact your bank to issue a card.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const Feature: React.FC<{ icon: React.ReactNode; label: string; enabled: boolean }> = ({ icon, label, enabled }) => (
  <div className={`flex flex-col items-center gap-1 p-2 rounded-lg ${enabled ? 'bg-green-50' : 'bg-gray-50'}`}>
    <span className={enabled ? 'text-green-600' : 'text-gray-400'}>{icon}</span>
    <span className="text-xs text-gray-600">{label}</span>
    <span className={`text-xs font-medium ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
      {enabled ? 'On' : 'Off'}
    </span>
  </div>
)

export default CardsPage
