import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { useAniStore, addCoins } from '@/store/aniStore'

const EARN_WAYS = [
  { icon: 'Play', label: 'Просмотр серии', reward: 10, desc: 'За каждую просмотренную серию' },
  { icon: 'MessageSquare', label: 'Сообщение в чате', reward: 2, desc: 'За каждые 10 сообщений в чате' },
  { icon: 'Star', label: 'Оценка аниме', reward: 5, desc: 'За выставление оценки' },
  { icon: 'Share2', label: 'Поделиться', reward: 15, desc: 'За приглашение друга по ссылке' },
  { icon: 'Flame', label: 'Серия подряд ×7', reward: 50, desc: 'Бонус за 7 дней подряд' },
]

const PACKS = [
  { id: 1, coins: 100, price: 49, label: 'Стартер', bonus: 0, color: 'from-gray-600 to-gray-700', popular: false },
  { id: 2, coins: 300, price: 99, label: 'Любитель', bonus: 30, color: 'from-purple-600 to-indigo-700', popular: false },
  { id: 3, coins: 700, price: 199, label: 'Фанат', bonus: 100, color: 'from-[#C084FC] to-[#7c3aed]', popular: true },
  { id: 4, coins: 2000, price: 499, label: 'Легенда', bonus: 400, color: 'from-yellow-500 to-orange-500', popular: false },
]

const SPEND_WAYS = [
  { icon: 'Package', label: 'Открыть пак карт', cost: 50, desc: 'Случайная карта из коллекции' },
  { icon: 'Crown', label: 'Премиум на месяц', cost: 500, desc: 'HD качество и без рекламы' },
  { icon: 'Palette', label: 'Уникальный аватар', cost: 200, desc: 'Эксклюзивный аниме-аватар' },
  { icon: 'Mic2', label: 'Озвучка Ultra', cost: 100, desc: 'Доступ к редким озвучкам' },
]

export default function Shop() {
  const navigate = useNavigate()
  const { coins, bookmarks } = useAniStore()
  const [bought, setBought] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const buyPack = (pack: typeof PACKS[0]) => {
    addCoins(pack.coins + pack.bonus)
    setBought(pack.id)
    showToast(`+${pack.coins + pack.bonus} АниКоин зачислено!`)
    setTimeout(() => setBought(null), 2000)
  }

  const spendCoins = (item: typeof SPEND_WAYS[0]) => {
    if (coins < item.cost) {
      showToast('Недостаточно АниКоин 😢')
      return
    }
    addCoins(-item.cost)
    showToast(`✅ «${item.label}» активировано!`)
  }

  const bookmarkList = Object.values(bookmarks).sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div className="min-h-screen bg-[#0a0612] text-white">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1a0e33] border border-[#C084FC]/40 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-top-3">
          {toast}
        </div>
      )}

      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-[#0a0612]/95 backdrop-blur-md border-b border-[#2d1f4a] px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-xl">AniStream</button>
            <button onClick={() => navigate('/catalog')} className="text-gray-400 hover:text-white text-sm transition-colors">Каталог</button>
          </div>
          <div className="flex items-center gap-2 bg-[#1a0e33] border border-[#3d2060] rounded-xl px-4 py-2">
            <span className="text-lg">🪙</span>
            <span className="font-bold text-[#C084FC] text-lg tabular-nums">{coins.toLocaleString()}</span>
            <span className="text-gray-400 text-xs">АниКоин</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-14">

        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-[#C084FC]/10 border border-[#C084FC]/30 rounded-full px-5 py-2 mb-5">
            <span className="text-2xl">🪙</span>
            <span className="text-[#C084FC] font-semibold">АниКоин — валюта AniStream</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Зарабатывай и трать</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Смотри аниме — получай монеты. Трать на карты, аватары и премиум-функции.</p>
        </div>

        {/* Earn ways */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Как заработать</h2>
          <p className="text-gray-400 text-sm mb-5">Бесплатно, просто смотри!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EARN_WAYS.map(w => (
              <div key={w.label} className="bg-[#0f0820] border border-[#2d1f4a] hover:border-[#C084FC]/30 rounded-2xl p-4 flex items-center gap-4 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#C084FC]/15 flex items-center justify-center shrink-0">
                  <Icon name={w.icon as 'Play'} size={20} className="text-[#C084FC]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white">{w.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{w.desc}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 bg-[#C084FC]/10 rounded-lg px-2.5 py-1">
                  <span className="text-sm">🪙</span>
                  <span className="text-sm font-bold text-[#C084FC]">+{w.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy packs */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Купить АниКоин</h2>
          <p className="text-gray-400 text-sm mb-5">Быстрое пополнение онлайн</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PACKS.map(pack => (
              <div key={pack.id} className={`relative rounded-2xl border-2 overflow-hidden transition-all ${bought === pack.id ? 'scale-95' : 'hover:scale-[1.02]'} ${pack.popular ? 'border-[#C084FC]' : 'border-[#2d1f4a] hover:border-[#3d2060]'}`}>
                {pack.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#C084FC] text-black text-xs font-bold text-center py-1">
                    🔥 ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div className={`bg-gradient-to-br ${pack.color} p-5 text-center ${pack.popular ? 'pt-8' : ''}`}>
                  <p className="text-3xl mb-1">🪙</p>
                  <p className="text-2xl font-bold text-white">{pack.coins.toLocaleString()}</p>
                  {pack.bonus > 0 && (
                    <p className="text-xs text-white/80 mt-0.5">+{pack.bonus} бонус</p>
                  )}
                  <p className="text-xs font-medium text-white/70 mt-1">{pack.label}</p>
                </div>
                <div className="bg-[#0f0820] p-4 text-center">
                  <p className="text-xl font-bold text-white mb-3">{pack.price} ₽</p>
                  <Button
                    onClick={() => buyPack(pack)}
                    className={`w-full font-bold text-sm ${pack.popular ? 'bg-[#C084FC] hover:bg-[#a855f7] text-black' : 'bg-[#1a0e33] hover:bg-[#2d1f4a] text-white border border-[#3d2060]'}`}
                  >
                    {bought === pack.id ? '✅ Куплено!' : 'Купить'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">* В демо-режиме монеты начисляются мгновенно без оплаты</p>
        </div>

        {/* Spend */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Трать АниКоин</h2>
          <p className="text-gray-400 text-sm mb-5">На что потратить накопленное</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPEND_WAYS.map(item => (
              <div key={item.label} className="bg-[#0f0820] border border-[#2d1f4a] hover:border-[#C084FC]/30 rounded-2xl p-4 flex items-center gap-4 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center shrink-0">
                  <Icon name={item.icon as 'Package'} size={20} className="text-[#a855f7]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => spendCoins(item)}
                  className={`shrink-0 font-bold text-xs gap-1.5 ${coins >= item.cost ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white' : 'bg-[#1a0e33] text-gray-500 cursor-not-allowed'}`}
                >
                  🪙 {item.cost}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarks */}
        <div>
          <h2 className="text-2xl font-bold mb-1">📌 Продолжить просмотр</h2>
          <p className="text-gray-400 text-sm mb-5">Где ты остановился</p>
          {bookmarkList.length === 0 ? (
            <div className="bg-[#0f0820] border border-[#2d1f4a] rounded-2xl p-10 text-center text-gray-500">
              <Icon name="Bookmark" size={40} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">Закладок пока нет</p>
              <p className="text-sm mt-1 text-gray-600">Начни смотреть аниме — прогресс сохранится автоматически</p>
              <Button onClick={() => navigate('/catalog')} className="mt-5 bg-[#C084FC] hover:bg-[#a855f7] text-black font-bold">
                Перейти в каталог
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkList.map(bm => (
                <button
                  key={bm.animeId}
                  onClick={() => navigate(`/watch/${bm.animeId}`)}
                  className="group bg-[#0f0820] border border-[#2d1f4a] hover:border-[#C084FC]/40 rounded-2xl overflow-hidden text-left transition-all hover:scale-[1.02]"
                >
                  <div className="relative">
                    <img src={bm.image} alt={bm.title} className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                      <div>
                        <p className="font-bold text-sm text-white leading-tight">{bm.title}</p>
                        <p className="text-xs text-[#C084FC]">Серия {bm.episode}</p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#C084FC]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="Play" size={16} className="text-black" />
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <div className="w-full h-1 bg-[#2d1f4a] rounded-full">
                      <div className="h-full bg-[#C084FC] rounded-full" style={{ width: `${Math.round((bm.episode / 24) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">{new Date(bm.updatedAt).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
