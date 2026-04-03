import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

const ANIME_DATA: Record<string, { title: string; genre: string; episode: number; image: string }> = {
  '1': { title: 'Тёмный Клинок', genre: 'Фэнтези', episode: 12, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/de962cc5-c144-4444-9311-11ead62f7421.jpg' },
  '2': { title: 'Весенний Ветер', genre: 'Романтика', episode: 7, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/198d652b-c403-476a-a65a-7b914b7f1492.jpg' },
  '3': { title: 'Неон Токио', genre: 'Киберпанк', episode: 18, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/19b9dd45-e008-4e9f-ac3c-72d1f68b787c.jpg' },
  '4': { title: 'Тёмный Клинок II', genre: 'Фэнтези', episode: 3, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/de962cc5-c144-4444-9311-11ead62f7421.jpg' },
  '5': { title: 'Код Сакуры', genre: 'Романтика', episode: 14, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/198d652b-c403-476a-a65a-7b914b7f1492.jpg' },
  '6': { title: 'Призрак Сети', genre: 'Киберпанк', episode: 22, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/19b9dd45-e008-4e9f-ac3c-72d1f68b787c.jpg' },
}

const INITIAL_MESSAGES = [
  { id: 1, user: 'SakuraFan', avatar: '🌸', text: 'ВАУ эта серия 🔥🔥🔥', time: '21:04' },
  { id: 2, user: 'OtakuKing', avatar: '👑', text: 'Не могу поверить что только что произошло!!', time: '21:05' },
  { id: 3, user: 'NeonWatcher', avatar: '⚡', text: 'Лучшая серия сезона без сомнений', time: '21:05' },
  { id: 4, user: 'AnimeGuru', avatar: '🎌', text: 'Ставлю 10/10, шедевр!', time: '21:06' },
  { id: 5, user: 'DarkBlade99', avatar: '⚔️', text: 'Финальная битва просто невероятная', time: '21:07' },
]

const REACTIONS = ['🔥', '😱', '❤️', '😂', '👏', '💜']

export default function Watch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const anime = ANIME_DATA[id || '1'] || ANIME_DATA['1']

  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [viewers] = useState(Math.floor(Math.random() * 5000) + 1200)
  const [reaction, setReaction] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const chatRef = useRef<HTMLDivElement>(null)
  const msgId = useRef(100)

  useEffect(() => {
    const botMessages = [
      { user: 'SakuraFan', avatar: '🌸', texts: ['Эта сцена меня убила 💀', 'Не могу остановить слёзы 😭'] },
      { user: 'OtakuKing', avatar: '👑', texts: ['КТО ЕЩЁ ЖДАЛ ЭТОТ МОМЕНТ?!', 'Автор — гений'] },
      { user: 'NeonWatcher', avatar: '⚡', texts: ['Эта музыка мурашки дает', 'Давай давай давай!!'] },
    ]
    const interval = setInterval(() => {
      const bot = botMessages[Math.floor(Math.random() * botMessages.length)]
      const text = bot.texts[Math.floor(Math.random() * bot.texts.length)]
      setMessages(prev => [...prev.slice(-50), {
        id: ++msgId.current,
        user: bot.user,
        avatar: bot.avatar,
        text,
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
      }])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: ++msgId.current,
      user: 'Ты',
      avatar: '😊',
      text: input,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
    }])
    setInput('')
  }

  const sendReaction = (r: string) => {
    setReaction(r)
    setTimeout(() => setReaction(null), 1000)
    setMessages(prev => [...prev, {
      id: ++msgId.current,
      user: 'Ты',
      avatar: '😊',
      text: r,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  return (
    <div className="min-h-screen bg-[#0a0612] text-white flex flex-col">
      <div className="sticky top-0 z-20 bg-[#0a0612]/90 backdrop-blur-md border-b border-[#2d1f4a] px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-xl">AniStream</button>
          <div className="flex items-center gap-4">
            <Badge className="bg-red-600/20 text-red-400 border border-red-600/40">
              🔴 {viewers.toLocaleString()} зрителей
            </Badge>
            <Button onClick={() => navigate('/catalog')} variant="ghost" className="text-gray-400 hover:text-white">
              <Icon name="Grid3x3" size={16} className="mr-2" /> Каталог
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-screen-xl mx-auto w-full p-4 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video mb-3 group">
            <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-[#C084FC]/80 hover:bg-[#C084FC] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <Icon name={isPlaying ? 'Pause' : 'Play'} size={28} className="text-black" />
              </button>
            </div>
            {reaction && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-8xl animate-bounce">{reaction}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">{anime.title}</p>
                  <p className="text-sm text-gray-300">Серия {anime.episode} · {anime.genre}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Icon name="Download" size={14} className="mr-1" /> Скачать
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {REACTIONS.map(r => (
              <button
                key={r}
                onClick={() => sendReaction(r)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {r}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(ep => (
              <div key={ep} className="bg-[#1a0e33] rounded-xl p-3 flex gap-3 cursor-pointer hover:border-[#C084FC] border border-transparent transition-colors">
                <img src={anime.image} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Серия {anime.episode + ep}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{anime.genre}</p>
                  <p className="text-xs text-[#C084FC] mt-1">24 мин</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 flex flex-col bg-[#0f0820] rounded-2xl border border-[#2d1f4a] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2d1f4a] flex items-center justify-between">
            <span className="font-semibold text-sm">Живой чат</span>
            <Badge className="bg-red-600/20 text-red-400 border-0 text-xs">🔴 Live</Badge>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[500px]">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-2 items-start">
                <span className="text-lg flex-shrink-0">{msg.avatar}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[#C084FC] font-medium">{msg.user} </span>
                  <span className="text-xs text-gray-300 break-words">{msg.text}</span>
                </div>
                <span className="text-[10px] text-gray-600 flex-shrink-0">{msg.time}</span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#2d1f4a] flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Написать..."
              className="bg-[#1a0e33] border-[#3d2060] text-white placeholder:text-gray-600 text-sm"
            />
            <Button onClick={sendMessage} size="sm" className="bg-[#C084FC] hover:bg-[#a855f7] text-black px-3">
              <Icon name="Send" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
