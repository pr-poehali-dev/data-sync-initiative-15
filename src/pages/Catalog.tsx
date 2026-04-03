import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

const ANIME_LIST = [
  {
    id: 1,
    title: 'Тёмный Клинок',
    genre: 'Фэнтези',
    episodes: 24,
    rating: 9.2,
    status: 'В эфире',
    image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/de962cc5-c144-4444-9311-11ead62f7421.jpg',
    description: 'Легендарный воин отправляется в путешествие через тёмные миры...'
  },
  {
    id: 2,
    title: 'Весенний Ветер',
    genre: 'Романтика',
    episodes: 12,
    rating: 8.7,
    status: 'Завершено',
    image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/198d652b-c403-476a-a65a-7b914b7f1492.jpg',
    description: 'История о первой любви в японской школе под цветущей сакурой...'
  },
  {
    id: 3,
    title: 'Неон Токио',
    genre: 'Киберпанк',
    episodes: 36,
    rating: 9.5,
    status: 'В эфире',
    image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/19b9dd45-e008-4e9f-ac3c-72d1f68b787c.jpg',
    description: 'В 2089 году одинокий хакер раскрывает заговор мегакорпораций...'
  },
  {
    id: 4,
    title: 'Тёмный Клинок II',
    genre: 'Фэнтези',
    episodes: 18,
    rating: 9.0,
    status: 'Скоро',
    image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/de962cc5-c144-4444-9311-11ead62f7421.jpg',
    description: 'Продолжение эпической саги о легендарном воине...'
  },
  {
    id: 5,
    title: 'Код Сакуры',
    genre: 'Романтика',
    episodes: 26,
    rating: 8.4,
    status: 'Завершено',
    image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/198d652b-c403-476a-a65a-7b914b7f1492.jpg',
    description: 'Старшеклассница обнаруживает секретный код в школьной библиотеке...'
  },
  {
    id: 6,
    title: 'Призрак Сети',
    genre: 'Киберпанк',
    episodes: 48,
    rating: 9.8,
    status: 'В эфире',
    image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/19b9dd45-e008-4e9f-ac3c-72d1f68b787c.jpg',
    description: 'Искусственный разум пробуждается в глубинах цифрового мира...'
  },
]

const GENRES = ['Все', 'Фэнтези', 'Романтика', 'Киберпанк']
const STATUSES = ['Все', 'В эфире', 'Завершено', 'Скоро']

export default function Catalog() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('Все')
  const [status, setStatus] = useState('Все')
  const navigate = useNavigate()

  const filtered = ANIME_LIST.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchGenre = genre === 'Все' || a.genre === genre
    const matchStatus = status === 'Все' || a.status === status
    return matchSearch && matchGenre && matchStatus
  })

  return (
    <div className="min-h-screen bg-[#0a0612] text-white">
      <div className="sticky top-0 z-20 bg-[#0a0612]/90 backdrop-blur-md border-b border-[#2d1f4a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-xl tracking-tight">
            AniStream
          </button>
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Найти аниме..."
                className="pl-9 bg-[#1a0e33] border-[#3d2060] text-white placeholder:text-gray-500 focus:border-[#C084FC]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/login')} variant="ghost" className="text-gray-300 hover:text-white">Войти</Button>
            <Button onClick={() => navigate('/register')} className="bg-[#C084FC] hover:bg-[#a855f7] text-black font-semibold">Регистрация</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">Каталог аниме</h1>
        <p className="text-gray-400 mb-8">Смотри новые серии в момент выхода</p>

        <div className="flex flex-wrap gap-3 mb-6">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                genre === g
                  ? 'bg-[#C084FC] border-[#C084FC] text-black'
                  : 'border-[#3d2060] text-gray-400 hover:border-[#C084FC] hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
          <div className="w-px bg-[#2d1f4a] mx-1" />
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                status === s
                  ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                  : 'border-[#3d2060] text-gray-400 hover:border-[#7c3aed] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map(anime => (
            <div
              key={anime.id}
              onClick={() => navigate(`/watch/${anime.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-3">
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
                  {anime.status === 'В эфире' && (
                    <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5">🔴 Live</Badge>
                  )}
                  {anime.status === 'Скоро' && (
                    <Badge className="bg-yellow-600 text-white text-xs px-1.5 py-0.5">Скоро</Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
                  <Icon name="Star" size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white font-medium">{anime.rating}</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-white group-hover:text-[#C084FC] transition-colors leading-tight">{anime.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{anime.genre} · {anime.episodes} серий</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-30" />
            <p>Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  )
}
