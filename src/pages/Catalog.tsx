import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

const IMG = {
  fantasy: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/de962cc5-c144-4444-9311-11ead62f7421.jpg',
  romance: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/198d652b-c403-476a-a65a-7b914b7f1492.jpg',
  cyber: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/19b9dd45-e008-4e9f-ac3c-72d1f68b787c.jpg',
  action: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/91d4e071-fb67-46d5-8d68-6ef18d90c54a.jpg',
  horror: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/a16cde68-d517-4d4d-82fa-9dbaaa565670.jpg',
  thriller: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/eeb5f743-3a61-4119-b82d-bd508c02d2b3.jpg',
}

const GENRE_CARDS = [
  { name: 'Экшн', icon: 'Swords', color: 'from-orange-600 to-red-700', image: IMG.action },
  { name: 'Фэнтези', icon: 'Wand2', color: 'from-purple-600 to-indigo-700', image: IMG.fantasy },
  { name: 'Романтика', icon: 'Heart', color: 'from-pink-500 to-rose-600', image: IMG.romance },
  { name: 'Киберпанк', icon: 'Cpu', color: 'from-cyan-500 to-blue-700', image: IMG.cyber },
  { name: 'Ужасы', icon: 'Ghost', color: 'from-green-700 to-emerald-900', image: IMG.horror },
  { name: 'Триллер', icon: 'Eye', color: 'from-slate-600 to-violet-900', image: IMG.thriller },
]

const ANIME_LIST = [
  { id: 1, title: 'Тёмный Клинок', genre: 'Фэнтези', episodes: 24, rating: 9.2, status: 'В эфире', year: 2024, image: IMG.fantasy, description: 'Легендарный воин отправляется в путешествие через тёмные миры...' },
  { id: 2, title: 'Весенний Ветер', genre: 'Романтика', episodes: 12, rating: 8.7, status: 'Завершено', year: 2023, image: IMG.romance, description: 'История о первой любви в японской школе под цветущей сакурой...' },
  { id: 3, title: 'Неон Токио', genre: 'Киберпанк', episodes: 36, rating: 9.5, status: 'В эфире', year: 2024, image: IMG.cyber, description: 'В 2089 году одинокий хакер раскрывает заговор мегакорпораций...' },
  { id: 4, title: 'Тёмный Клинок II', genre: 'Фэнтези', episodes: 18, rating: 9.0, status: 'Скоро', year: 2025, image: IMG.fantasy, description: 'Продолжение эпической саги о легендарном воине...' },
  { id: 5, title: 'Код Сакуры', genre: 'Романтика', episodes: 26, rating: 8.4, status: 'Завершено', year: 2023, image: IMG.romance, description: 'Старшеклассница обнаруживает секретный код в школьной библиотеке...' },
  { id: 6, title: 'Призрак Сети', genre: 'Киберпанк', episodes: 48, rating: 9.8, status: 'В эфире', year: 2024, image: IMG.cyber, description: 'Искусственный разум пробуждается в глубинах цифрового мира...' },
  { id: 7, title: 'Огненный Кулак', genre: 'Экшн', episodes: 52, rating: 9.1, status: 'В эфире', year: 2024, image: IMG.action, description: 'Юный боец с силой огня идёт к вершине турнира...' },
  { id: 8, title: 'Школа теней', genre: 'Ужасы', episodes: 13, rating: 8.9, status: 'Завершено', year: 2023, image: IMG.horror, description: 'В старой школе просыпается нечто древнее и страшное...' },
  { id: 9, title: 'Последний сигнал', genre: 'Триллер', episodes: 24, rating: 9.3, status: 'В эфире', year: 2024, image: IMG.thriller, description: 'Детектив расследует серию необъяснимых исчезновений...' },
  { id: 10, title: 'Буря Клинков', genre: 'Экшн', episodes: 40, rating: 8.6, status: 'Завершено', year: 2022, image: IMG.action, description: 'Отряд лучших мечников защищает империю от тёмных сил...' },
  { id: 11, title: 'Проклятый замок', genre: 'Ужасы', episodes: 12, rating: 8.2, status: 'Скоро', year: 2025, image: IMG.horror, description: 'Группа исследователей попадает в ловушку в заброшенном замке...' },
  { id: 12, title: 'Нулевой протокол', genre: 'Триллер', episodes: 22, rating: 9.0, status: 'В эфире', year: 2024, image: IMG.thriller, description: 'Государственный агент раскрывает самый большой заговор века...' },
]

const SORT_OPTIONS = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'year', label: 'По году' },
  { value: 'episodes', label: 'По сериям' },
  { value: 'title', label: 'По названию' },
]

const STATUSES = ['Все', 'В эфире', 'Завершено', 'Скоро']

export default function Catalog() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('Все')
  const [status, setStatus] = useState('Все')
  const [sort, setSort] = useState('rating')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const navigate = useNavigate()

  const filtered = ANIME_LIST
    .filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
      const matchGenre = genre === 'Все' || a.genre === genre
      const matchStatus = status === 'Все' || a.status === status
      return matchSearch && matchGenre && matchStatus
    })
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'year') return b.year - a.year
      if (sort === 'episodes') return b.episodes - a.episodes
      if (sort === 'title') return a.title.localeCompare(b.title, 'ru')
      return 0
    })

  const handleGenreClick = (g: string) => {
    setGenre(prev => prev === g ? 'Все' : g)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-[#0a0612]/90 backdrop-blur-md border-b border-[#2d1f4a] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-xl tracking-tight shrink-0">
            AniStream
          </button>
          <div className="relative flex-1 max-w-lg">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск аниме..."
              className="pl-9 bg-[#1a0e33] border-[#3d2060] text-white placeholder:text-gray-500 focus:border-[#C084FC] h-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button onClick={() => navigate('/cards')} variant="ghost" className="text-gray-300 hover:text-white hidden sm:flex">
              🎴 Карты
            </Button>
            <Button onClick={() => navigate('/login')} variant="ghost" className="text-gray-300 hover:text-white">Войти</Button>
            <Button onClick={() => navigate('/register')} className="bg-[#C084FC] hover:bg-[#a855f7] text-black font-semibold">
              Регистрация
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Genre cards */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Выбери жанр</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {GENRE_CARDS.map(g => (
              <button
                key={g.name}
                onClick={() => handleGenreClick(g.name)}
                className={`relative overflow-hidden rounded-2xl aspect-[4/3] group transition-all duration-300 ${
                  genre === g.name ? 'ring-2 ring-[#C084FC] scale-95' : 'hover:scale-95'
                }`}
              >
                <img src={g.image} alt={g.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${g.color} opacity-70 group-hover:opacity-60 transition-opacity`} />
                {genre === g.name && (
                  <div className="absolute inset-0 bg-[#C084FC]/20" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <Icon name={g.icon as 'Swords'} size={22} className="text-white drop-shadow" />
                  <span className="text-white text-xs font-bold drop-shadow">{g.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setGenre('Все')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                genre === 'Все'
                  ? 'bg-[#C084FC] border-[#C084FC] text-black'
                  : 'border-[#3d2060] text-gray-400 hover:border-[#C084FC] hover:text-white'
              }`}
            >
              Все жанры
            </button>
            {STATUSES.filter(s => s !== 'Все').map(s => (
              <button
                key={s}
                onClick={() => setStatus(prev => prev === s ? 'Все' : s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  status === s
                    ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                    : 'border-[#3d2060] text-gray-400 hover:border-[#7c3aed] hover:text-white'
                }`}
              >
                {s === 'В эфире' ? '🔴 ' : s === 'Скоро' ? '⏳ ' : '✅ '}{s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-[#1a0e33] border border-[#3d2060] text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C084FC]"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="flex border border-[#3d2060] rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1.5 transition-colors ${view === 'grid' ? 'bg-[#3d2060] text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <Icon name="LayoutGrid" size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 transition-colors ${view === 'list' ? 'bg-[#3d2060] text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">
            {genre !== 'Все' && <span className="text-[#C084FC] font-medium">{genre} · </span>}
            Найдено: <span className="text-white font-medium">{filtered.length}</span> аниме
          </span>
          {(genre !== 'Все' || status !== 'Все' || search) && (
            <button
              onClick={() => { setGenre('Все'); setStatus('Все'); setSearch('') }}
              className="text-xs text-gray-500 hover:text-[#C084FC] underline transition-colors"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        {/* Grid view */}
        {view === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filtered.map(anime => (
              <div key={anime.id} onClick={() => navigate(`/watch/${anime.id}`)} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-2.5">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <Button size="sm" className="w-full bg-[#C084FC] hover:bg-[#a855f7] text-black font-semibold text-xs">
                      <Icon name="Play" size={12} className="mr-1" /> Смотреть
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    {anime.status === 'В эфире' && <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5">🔴 Live</Badge>}
                    {anime.status === 'Скоро' && <Badge className="bg-yellow-600 text-white text-xs px-1.5 py-0.5">Скоро</Badge>}
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
                    <Icon name="Star" size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white font-medium">{anime.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-[#C084FC] transition-colors leading-tight">{anime.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{anime.genre} · {anime.episodes} сер.</p>
              </div>
            ))}
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="flex flex-col gap-3">
            {filtered.map(anime => (
              <div
                key={anime.id}
                onClick={() => navigate(`/watch/${anime.id}`)}
                className="group cursor-pointer bg-[#0f0820] hover:bg-[#1a0e33] border border-[#2d1f4a] hover:border-[#C084FC]/40 rounded-2xl p-4 flex gap-4 transition-all"
              >
                <div className="relative overflow-hidden rounded-xl w-20 h-28 shrink-0">
                  <img src={anime.image} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {anime.status === 'В эфире' && (
                    <div className="absolute bottom-1 left-1">
                      <Badge className="bg-red-600 text-white text-[10px] px-1 py-0">🔴</Badge>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-white group-hover:text-[#C084FC] transition-colors">{anime.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Icon name="Star" size={13} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">{anime.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[#C084FC] font-medium">{anime.genre}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-400">{anime.episodes} серий</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-400">{anime.year}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 ${anime.status === 'В эфире' ? 'bg-red-600/20 text-red-400 border-red-600/30' : anime.status === 'Скоро' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' : 'bg-green-600/20 text-green-400 border-green-600/30'}`}>
                      {anime.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-1">{anime.description}</p>
                </div>
                <Button size="sm" className="bg-[#C084FC] hover:bg-[#a855f7] text-black font-semibold self-center shrink-0 hidden sm:flex">
                  <Icon name="Play" size={14} className="mr-1" /> Смотреть
                </Button>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            <Icon name="SearchX" size={52} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Ничего не найдено</p>
            <p className="text-sm mt-1 text-gray-600">Попробуй изменить фильтры или поисковый запрос</p>
            <button onClick={() => { setGenre('Все'); setStatus('Все'); setSearch('') }} className="mt-4 text-[#C084FC] hover:underline text-sm">
              Сбросить все фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
