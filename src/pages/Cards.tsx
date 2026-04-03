import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { useAniStore, addCoins } from '@/store/aniStore'

const CARD_IMAGE = 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/716812cc-c598-4703-a53e-301979265711.jpg'

const RARITY_COLORS: Record<string, string> = {
  'Легендарная': 'from-yellow-500 to-orange-500',
  'Редкая': 'from-purple-500 to-pink-500',
  'Необычная': 'from-blue-500 to-cyan-500',
  'Обычная': 'from-gray-500 to-gray-600',
}

const RARITY_PRICE: Record<string, number> = {
  'Легендарная': 300,
  'Редкая': 150,
  'Необычная': 75,
  'Обычная': 30,
}

const PACKS = [
  {
    id: 'basic',
    name: 'Базовый пак',
    desc: '1 случайная карта',
    price: 50,
    count: 1,
    gradient: 'from-gray-600 to-gray-700',
    icon: '📦',
    rarityChance: 'Обычная / Необычная',
  },
  {
    id: 'rare',
    name: 'Редкий пак',
    desc: '3 карты, гарантия Редкой',
    price: 150,
    count: 3,
    gradient: 'from-purple-600 to-indigo-700',
    icon: '💎',
    rarityChance: 'Редкая гарантирована',
  },
  {
    id: 'legend',
    name: 'Легендарный пак',
    desc: '5 карт, гарантия Легендарной',
    price: 350,
    count: 5,
    gradient: 'from-yellow-500 to-orange-500',
    icon: '👑',
    rarityChance: 'Легендарная гарантирована',
    popular: true,
  },
]

const INITIAL_CARDS = [
  { id: 1, name: 'Клинок Тьмы', anime: 'Тёмный Клинок', rarity: 'Легендарная', power: 99, owned: true },
  { id: 2, name: 'Цветок Сакуры', anime: 'Весенний Ветер', rarity: 'Редкая', power: 78, owned: true },
  { id: 3, name: 'Неоновый Призрак', anime: 'Неон Токио', rarity: 'Редкая', power: 82, owned: true },
  { id: 4, name: 'Хранитель Весны', anime: 'Весенний Ветер', rarity: 'Необычная', power: 61, owned: false },
  { id: 5, name: 'Цифровой Кодекс', anime: 'Призрак Сети', rarity: 'Легендарная', power: 97, owned: false },
  { id: 6, name: 'Теневой Воин', anime: 'Тёмный Клинок', rarity: 'Обычная', power: 45, owned: true },
  { id: 7, name: 'Нано-Разум', anime: 'Неон Токио', rarity: 'Необычная', power: 67, owned: false },
  { id: 8, name: 'Дракон Ночи', anime: 'Тёмный Клинок II', rarity: 'Легендарная', power: 100, owned: false },
  { id: 9, name: 'Душа Сакуры', anime: 'Код Сакуры', rarity: 'Редкая', power: 74, owned: false },
  { id: 10, name: 'Огненный Дух', anime: 'Тёмный Клинок', rarity: 'Необычная', power: 58, owned: false },
  { id: 11, name: 'Призрак Нуля', anime: 'Призрак Сети', rarity: 'Обычная', power: 40, owned: false },
  { id: 12, name: 'Звезда Токио', anime: 'Неон Токио', rarity: 'Легендарная', power: 95, owned: false },
]

function pickRandom(cards: typeof INITIAL_CARDS, guaranteedRarity?: string) {
  const pool = cards.filter(c => !c.owned)
  if (pool.length === 0) return null
  if (guaranteedRarity) {
    const rare = pool.filter(c => c.rarity === guaranteedRarity)
    if (rare.length > 0) return rare[Math.floor(Math.random() * rare.length)]
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function Cards() {
  const navigate = useNavigate()
  const { coins } = useAniStore()
  const [cards, setCards] = useState(INITIAL_CARDS)
  const [filter, setFilter] = useState<'all' | 'owned' | 'shop'>('all')
  const [opening, setOpening] = useState(false)
  const [newCards, setNewCards] = useState<typeof INITIAL_CARDS>([])
  const [toast, setToast] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const owned = cards.filter(c => c.owned)
  const displayed = filter === 'owned' ? owned : filter === 'shop' ? cards.filter(c => !c.owned) : cards

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const buyCard = (card: typeof INITIAL_CARDS[0]) => {
    const price = RARITY_PRICE[card.rarity]
    if (coins < price) { showToast('Недостаточно АниКоин 🪙'); return }
    addCoins(-price)
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, owned: true } : c))
    showToast(`✅ Карта «${card.name}» куплена за ${price} 🪙`)
  }

  const openPack = (pack: typeof PACKS[0]) => {
    if (coins < pack.price) { showToast('Недостаточно АниКоин 🪙'); return }
    const notOwned = cards.filter(c => !c.owned)
    if (notOwned.length === 0) { showToast('Все карты уже собраны!'); return }

    setOpening(true)
    addCoins(-pack.price)

    setTimeout(() => {
      const received: typeof INITIAL_CARDS = []
      let updatedCards = [...cards]

      for (let i = 0; i < pack.count; i++) {
        const guarantee = i === 0 ? (pack.id === 'legend' ? 'Легендарная' : pack.id === 'rare' ? 'Редкая' : undefined) : undefined
        const available = updatedCards.filter(c => !c.owned && !received.find(r => r.id === c.id))
        if (available.length === 0) break
        const pick = guarantee
          ? (available.find(c => c.rarity === guarantee) || available[Math.floor(Math.random() * available.length)])
          : available[Math.floor(Math.random() * available.length)]
        received.push(pick)
        updatedCards = updatedCards.map(c => c.id === pick.id ? { ...c, owned: true } : c)
      }

      setCards(updatedCards)
      setNewCards(received)
      setOpening(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#0a0612] text-white">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1a0e33] border border-[#C084FC]/40 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in fade-in slide-in-from-top-3">
          {toast}
        </div>
      )}

      {/* Navbar */}
      <div className="sticky top-0 z-20 bg-[#0a0612]/90 backdrop-blur-md border-b border-[#2d1f4a] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-xl">AniStream</button>
            <button onClick={() => navigate('/catalog')} className="text-gray-400 hover:text-white text-sm transition-colors">Каталог</button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-1.5 bg-[#1a0e33] hover:bg-[#2d1f4a] border border-[#3d2060] rounded-xl px-3 py-1.5 transition-colors"
            >
              <span className="text-base">🪙</span>
              <span className="font-bold text-[#C084FC] tabular-nums">{coins.toLocaleString()}</span>
              <span className="text-gray-500 text-xs">АниКоин</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-1">Коллекция карт</h1>
            <p className="text-gray-400">Покупай карты за АниКоин или открывай паки</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1a0e33] rounded-xl px-4 py-2 text-center border border-[#3d2060]">
              <p className="text-2xl font-bold text-[#C084FC]">{owned.length}</p>
              <p className="text-xs text-gray-400">из {cards.length}</p>
            </div>
          </div>
        </div>

        {/* Packs */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">🎁 Открыть пак</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PACKS.map(pack => (
              <div key={pack.id} className={`relative rounded-2xl overflow-hidden border-2 ${pack.popular ? 'border-yellow-500/60' : 'border-[#2d1f4a]'}`}>
                {pack.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-xs font-bold text-center py-1 z-10">
                    🔥 ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div className={`bg-gradient-to-br ${pack.gradient} p-5 text-center ${pack.popular ? 'pt-8' : ''}`}>
                  <p className="text-4xl mb-2">{pack.icon}</p>
                  <p className="font-bold text-lg text-white">{pack.name}</p>
                  <p className="text-sm text-white/70 mt-1">{pack.desc}</p>
                  <p className="text-xs text-white/50 mt-1">{pack.rarityChance}</p>
                </div>
                <div className="bg-[#0f0820] p-4">
                  <Button
                    onClick={() => openPack(pack)}
                    disabled={opening || coins < pack.price}
                    className={`w-full font-bold gap-2 ${coins >= pack.price ? 'bg-[#C084FC] hover:bg-[#a855f7] text-black' : 'bg-[#1a0e33] text-gray-500 border border-[#3d2060] cursor-not-allowed'}`}
                  >
                    {opening ? (
                      <><Icon name="Loader2" size={16} className="animate-spin" /> Открываем...</>
                    ) : (
                      <><span className="text-base">🪙</span> {pack.price} АниКоин</>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New cards received */}
        {newCards.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-[#C084FC]/15 to-[#7c3aed]/15 border border-[#C084FC]/40 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-lg text-white">🎉 Получено {newCards.length} {newCards.length === 1 ? 'карта' : 'карты'}!</p>
              <button onClick={() => setNewCards([])} className="text-gray-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="flex gap-4 flex-wrap">
              {newCards.map(card => (
                <div key={card.id} className="flex items-center gap-3 bg-[#1a0e33] rounded-xl px-4 py-3 border border-[#3d2060]">
                  <span className="text-2xl">🎴</span>
                  <div>
                    <p className="font-semibold text-sm text-white">{card.name}</p>
                    <p className={`text-xs font-bold bg-gradient-to-r ${RARITY_COLORS[card.rarity]} bg-clip-text text-transparent`}>{card.rarity}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Icon name="Zap" size={11} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">{card.power}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'all', label: `Все (${cards.length})` },
            { key: 'owned', label: `Мои (${owned.length})` },
            { key: 'shop', label: `🛒 Купить (${cards.filter(c => !c.owned).length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'all' | 'owned' | 'shop')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                filter === tab.key
                  ? 'bg-[#C084FC] border-[#C084FC] text-black'
                  : 'border-[#3d2060] text-gray-400 hover:border-[#C084FC] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {displayed.map(card => (
            <div
              key={card.id}
              onClick={() => setSelected(selected === card.id ? null : card.id)}
              className={`cursor-pointer transition-all duration-200 ${!card.owned && filter !== 'shop' ? 'opacity-40 grayscale' : ''} ${selected === card.id ? 'scale-105' : 'hover:scale-[1.03]'}`}
            >
              <div className={`relative rounded-2xl overflow-hidden border-2 shadow-xl ${
                card.rarity === 'Легендарная' ? 'border-yellow-500/50 shadow-yellow-500/20' :
                card.rarity === 'Редкая' ? 'border-purple-500/50 shadow-purple-500/20' :
                card.rarity === 'Необычная' ? 'border-blue-500/50 shadow-blue-500/20' :
                'border-gray-600/50 shadow-gray-500/10'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-b ${RARITY_COLORS[card.rarity]} opacity-20`} />
                <img src={CARD_IMAGE} alt={card.name} className="w-full aspect-[3/4] object-cover" />

                <div className="absolute top-2 right-2">
                  <Badge className={`text-xs bg-gradient-to-r ${RARITY_COLORS[card.rarity]} text-white border-0 shadow`}>
                    {card.rarity}
                  </Badge>
                </div>

                {/* Not owned + shop tab = buy button overlay */}
                {!card.owned && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity ${filter === 'shop' || selected === card.id ? 'bg-black/70' : 'bg-black/60'}`}>
                    {filter === 'shop' || selected === card.id ? (
                      <div className="text-center px-2">
                        <p className="text-sm font-bold text-white mb-1">{card.name}</p>
                        <p className="text-xs text-gray-300 mb-3">{RARITY_PRICE[card.rarity]} 🪙</p>
                        <Button
                          size="sm"
                          onClick={e => { e.stopPropagation(); buyCard(card) }}
                          className={`text-xs font-bold gap-1 ${coins >= RARITY_PRICE[card.rarity] ? 'bg-[#C084FC] hover:bg-[#a855f7] text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                        >
                          🪙 Купить
                        </Button>
                      </div>
                    ) : (
                      <Icon name="Lock" size={28} className="text-gray-400" />
                    )}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  <p className="font-bold text-sm text-white leading-tight">{card.name}</p>
                  <p className="text-xs text-gray-400">{card.anime}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <Icon name="Zap" size={10} className="text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-400">{card.power}</span>
                    </div>
                    {!card.owned && (
                      <span className="text-[10px] text-gray-400">{RARITY_PRICE[card.rarity]} 🪙</span>
                    )}
                    {card.owned && (
                      <span className="text-[10px] text-green-400 font-semibold">✓ Есть</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rarity price guide */}
        <div className="mt-12 bg-[#0f0820] border border-[#2d1f4a] rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">💰 Цены на карты</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(RARITY_PRICE).map(([rarity, price]) => (
              <div key={rarity} className="bg-[#1a0e33] rounded-xl p-4 text-center border border-[#3d2060]">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${RARITY_COLORS[rarity]} mx-auto mb-2 flex items-center justify-center`}>
                  <Icon name="Layers" size={18} className="text-white" />
                </div>
                <p className={`text-sm font-bold bg-gradient-to-r ${RARITY_COLORS[rarity]} bg-clip-text text-transparent`}>{rarity}</p>
                <p className="text-lg font-bold text-white mt-1">{price} <span className="text-sm">🪙</span></p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Не хватает АниКоин? <button onClick={() => navigate('/shop')} className="text-[#C084FC] hover:underline">Пополнить баланс →</button>
          </p>
        </div>

      </div>
    </div>
  )
}
