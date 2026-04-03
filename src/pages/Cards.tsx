import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

const CARD_IMAGE = 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/716812cc-c598-4703-a53e-301979265711.jpg'

const RARITY_COLORS: Record<string, string> = {
  'Легендарная': 'from-yellow-500 to-orange-500',
  'Редкая': 'from-purple-500 to-pink-500',
  'Необычная': 'from-blue-500 to-cyan-500',
  'Обычная': 'from-gray-500 to-gray-600',
}

const RARITY_GLOW: Record<string, string> = {
  'Легендарная': 'shadow-yellow-500/40',
  'Редкая': 'shadow-purple-500/40',
  'Необычная': 'shadow-blue-500/40',
  'Обычная': 'shadow-gray-500/20',
}

const ALL_CARDS = [
  { id: 1, name: 'Клинок Тьмы', anime: 'Тёмный Клинок', rarity: 'Легендарная', power: 99, owned: true },
  { id: 2, name: 'Цветок Сакуры', anime: 'Весенний Ветер', rarity: 'Редкая', power: 78, owned: true },
  { id: 3, name: 'Неоновый Призрак', anime: 'Неон Токио', rarity: 'Редкая', power: 82, owned: true },
  { id: 4, name: 'Хранитель Весны', anime: 'Весенний Ветер', rarity: 'Необычная', power: 61, owned: false },
  { id: 5, name: 'Цифровой Кодекс', anime: 'Призрак Сети', rarity: 'Легендарная', power: 97, owned: false },
  { id: 6, name: 'Теневой Воин', anime: 'Тёмный Клинок', rarity: 'Обычная', power: 45, owned: true },
  { id: 7, name: 'Нано-Разум', anime: 'Неон Токио', rarity: 'Необычная', power: 67, owned: false },
  { id: 8, name: 'Дракон Ночи', anime: 'Тёмный Клинок II', rarity: 'Легендарная', power: 100, owned: false },
]

export default function Cards() {
  const navigate = useNavigate()
  const [cards, setCards] = useState(ALL_CARDS)
  const [flipped, setFlipped] = useState<number | null>(null)
  const [opening, setOpening] = useState(false)
  const [newCard, setNewCard] = useState<typeof ALL_CARDS[0] | null>(null)
  const [filter, setFilter] = useState<'all' | 'owned'>('all')

  const owned = cards.filter(c => c.owned)
  const displayed = filter === 'owned' ? owned : cards

  const openPack = () => {
    const notOwned = cards.filter(c => !c.owned)
    if (notOwned.length === 0) return
    setOpening(true)
    setTimeout(() => {
      const card = notOwned[Math.floor(Math.random() * notOwned.length)]
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, owned: true } : c))
      setNewCard(card)
      setOpening(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      <div className="sticky top-0 z-20 bg-[#0a0612]/90 backdrop-blur-md border-b border-[#2d1f4a] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-xl">AniStream</button>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/catalog')} variant="ghost" className="text-gray-400 hover:text-white">
              <Icon name="Grid3x3" size={16} className="mr-2" /> Каталог
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Коллекция карт</h1>
            <p className="text-gray-400">Собирай уникальные карты за просмотр аниме</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1a0e33] rounded-xl px-4 py-2 text-center border border-[#3d2060]">
              <p className="text-2xl font-bold text-[#C084FC]">{owned.length}</p>
              <p className="text-xs text-gray-400">из {cards.length}</p>
            </div>
            <Button
              onClick={openPack}
              disabled={opening || cards.filter(c => !c.owned).length === 0}
              className="bg-gradient-to-r from-[#C084FC] to-[#7c3aed] hover:opacity-90 text-black font-bold px-6 py-5 text-base disabled:opacity-50"
            >
              {opening ? (
                <><Icon name="Loader2" size={18} className="mr-2 animate-spin" /> Открываем...</>
              ) : (
                <><Icon name="Package" size={18} className="mr-2" /> Открыть пак</>
              )}
            </Button>
          </div>
        </div>

        {newCard && (
          <div className="mb-8 bg-gradient-to-r from-[#C084FC]/20 to-[#7c3aed]/20 border border-[#C084FC]/40 rounded-2xl p-5 flex items-center gap-4">
            <span className="text-4xl">🎴</span>
            <div>
              <p className="font-bold text-lg text-white">Новая карта получена!</p>
              <p className="text-gray-300">{newCard.name} · <span className={`font-semibold bg-gradient-to-r ${RARITY_COLORS[newCard.rarity]} bg-clip-text text-transparent`}>{newCard.rarity}</span></p>
            </div>
            <button onClick={() => setNewCard(null)} className="ml-auto text-gray-500 hover:text-white">
              <Icon name="X" size={18} />
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === 'all' ? 'bg-[#C084FC] border-[#C084FC] text-black' : 'border-[#3d2060] text-gray-400 hover:border-[#C084FC] hover:text-white'}`}
          >
            Все карты ({cards.length})
          </button>
          <button
            onClick={() => setFilter('owned')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === 'owned' ? 'bg-[#C084FC] border-[#C084FC] text-black' : 'border-[#3d2060] text-gray-400 hover:border-[#C084FC] hover:text-white'}`}
          >
            Мои карты ({owned.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {displayed.map(card => (
            <div
              key={card.id}
              onClick={() => setFlipped(flipped === card.id ? null : card.id)}
              className={`cursor-pointer transition-all duration-300 ${!card.owned ? 'opacity-40 grayscale' : ''}`}
            >
              <div className={`relative rounded-2xl overflow-hidden border-2 shadow-xl ${RARITY_GLOW[card.rarity]} ${flipped === card.id ? 'scale-105' : 'hover:scale-102'} transition-transform`}
                style={{ borderImage: `linear-gradient(135deg, ${card.rarity === 'Легендарная' ? '#eab308,#f97316' : card.rarity === 'Редкая' ? '#a855f7,#ec4899' : card.rarity === 'Необычная' ? '#3b82f6,#06b6d4' : '#6b7280,#9ca3af'}) 1` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${RARITY_COLORS[card.rarity]} opacity-20`} />
                <img src={CARD_IMAGE} alt={card.name} className="w-full aspect-[3/4] object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className={`text-xs bg-gradient-to-r ${RARITY_COLORS[card.rarity]} text-white border-0`}>
                    {card.rarity}
                  </Badge>
                </div>
                {!card.owned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Icon name="Lock" size={32} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  <p className="font-bold text-sm text-white leading-tight">{card.name}</p>
                  <p className="text-xs text-gray-400">{card.anime}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="Zap" size={10} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">{card.power}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#0f0820] border border-[#2d1f4a] rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Как получить карты?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: 'Play', title: 'Смотри аниме', desc: '1 карта за каждые 3 просмотренных серии' },
              { icon: 'MessageSquare', title: 'Участвуй в чате', desc: 'Карта за 50 сообщений в живом чате' },
              { icon: 'Star', title: 'Ставь оценки', desc: 'Карта за каждые 10 оценок аниме' },
            ].map(item => (
              <div key={item.title} className="bg-[#1a0e33] rounded-xl p-4 flex gap-3 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#C084FC]/20 flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon as 'Play'} size={20} className="text-[#C084FC]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
