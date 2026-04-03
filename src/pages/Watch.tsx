import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

const ANIME_DATA: Record<string, { title: string; genre: string; episode: number; total: number; image: string }> = {
  '1': { title: 'Тёмный Клинок', genre: 'Фэнтези', episode: 12, total: 24, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/de962cc5-c144-4444-9311-11ead62f7421.jpg' },
  '2': { title: 'Весенний Ветер', genre: 'Романтика', episode: 7, total: 12, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/198d652b-c403-476a-a65a-7b914b7f1492.jpg' },
  '3': { title: 'Неон Токио', genre: 'Киберпанк', episode: 18, total: 36, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/19b9dd45-e008-4e9f-ac3c-72d1f68b787c.jpg' },
  '4': { title: 'Тёмный Клинок II', genre: 'Фэнтези', episode: 3, total: 18, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/de962cc5-c144-4444-9311-11ead62f7421.jpg' },
  '5': { title: 'Код Сакуры', genre: 'Романтика', episode: 14, total: 26, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/198d652b-c403-476a-a65a-7b914b7f1492.jpg' },
  '6': { title: 'Призрак Сети', genre: 'Киберпанк', episode: 22, total: 48, image: 'https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/19b9dd45-e008-4e9f-ac3c-72d1f68b787c.jpg' },
}

const BOT_MESSAGES = [
  { user: 'SakuraFan', avatar: '🌸', texts: ['Эта сцена меня убила 💀', 'Не могу остановить слёзы 😭', 'АААААА 🔥🔥🔥'] },
  { user: 'OtakuKing', avatar: '👑', texts: ['КТО ЕЩЁ ЖДАЛ ЭТОТ МОМЕНТ?!', 'Автор — настоящий гений', 'Лучший аниме этого сезона'] },
  { user: 'NeonWatcher', avatar: '⚡', texts: ['Эта музыка мурашки даёт', 'Давай давай давай!!', 'Не могу дождаться следующей серии'] },
  { user: 'AnimeGuru', avatar: '🎌', texts: ['10/10 без вопросов', 'Шедевр абсолютный', 'Такого ещё не было!'] },
  { user: 'DarkBlade99', avatar: '⚔️', texts: ['Битва просто невероятная', 'Анимация топ уровня', 'ГГ красавчик ❤️'] },
]

const REACTIONS = ['🔥', '😱', '❤️', '😂', '👏', '💜', '😤', '🤯']
const QUICK_PHRASES = ['ВАУ!', 'Огонь 🔥', 'Не ожидал!', 'Топ серия!', '+1', '❤️']
const VOICES = ['Русская (AniLibria)', 'Русская (Crunchyroll)', 'Русская (субтитры)', 'Оригинал (японский)', 'Английская']
const QUALITIES = ['1080p Ultra HD', '720p HD', '480p SD', '360p']

export default function Watch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const anime = ANIME_DATA[id || '1'] || ANIME_DATA['1']

  const [messages, setMessages] = useState([
    { id: 1, user: 'SakuraFan', avatar: '🌸', text: 'ВАУ эта серия 🔥🔥🔥', time: '21:04', isMe: false },
    { id: 2, user: 'OtakuKing', avatar: '👑', text: 'Не могу поверить что только что произошло!!', time: '21:05', isMe: false },
    { id: 3, user: 'NeonWatcher', avatar: '⚡', text: 'Лучшая серия сезона без сомнений', time: '21:05', isMe: false },
    { id: 4, user: 'AnimeGuru', avatar: '🎌', text: 'Ставлю 10/10, шедевр!', time: '21:06', isMe: false },
    { id: 5, user: 'DarkBlade99', avatar: '⚔️', text: 'Финальная битва просто невероятная', time: '21:07', isMe: false },
  ])
  const [input, setInput] = useState('')
  const [viewers] = useState(Math.floor(Math.random() * 5000) + 1200)
  const [reaction, setReaction] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showEmoji, setShowEmoji] = useState(false)
  const [currentEp, setCurrentEp] = useState(anime.episode)
  const [chatTab, setChatTab] = useState<'chat' | 'episodes'>('chat')
  const [voice, setVoice] = useState(VOICES[0])
  const [quality, setQuality] = useState(QUALITIES[0])
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const msgId = useRef(100)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const bot = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)]
      const text = bot.texts[Math.floor(Math.random() * bot.texts.length)]
      setMessages(prev => [...prev.slice(-80), {
        id: ++msgId.current,
        user: bot.user,
        avatar: bot.avatar,
        text,
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      }])
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setMessages(prev => [...prev, {
      id: ++msgId.current,
      user: 'Ты',
      avatar: '😊',
      text: msg,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }])
    setInput('')
    setShowEmoji(false)
  }

  const sendReaction = (r: string) => {
    setReaction(r)
    setTimeout(() => setReaction(null), 1200)
    sendMessage(r)
  }

  return (
    <div className="h-screen bg-[#0a0612] text-white flex flex-col overflow-hidden">

      {/* Navbar */}
      <div className="shrink-0 bg-[#0a0612]/95 backdrop-blur-md border-b border-[#2d1f4a] px-5 py-2.5 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-lg">AniStream</button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <button onClick={() => navigate('/catalog')} className="hover:text-white transition-colors">Каталог</button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-white font-medium">{anime.title}</span>
              <span className="text-gray-600">·</span>
              <span>Серия {currentEp}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-red-600/20 text-red-400 border border-red-600/30 text-xs">
              🔴 {viewers.toLocaleString()} зрителей
            </Badge>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs h-8">
              <Icon name="Download" size={13} className="mr-1" /> Скачать
            </Button>
          </div>
        </div>
      </div>

      {/* Main layout: video left + chat right */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: video + episodes */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Video player */}
          <div ref={playerRef} className="relative bg-black group" style={{ aspectRatio: '16/9', maxHeight: 'calc(100vh - 160px)' }}>
            <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />

            {/* Reaction overlay */}
            {reaction && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="text-9xl drop-shadow-2xl" style={{ animation: 'bounceUp 1.2s ease-out forwards' }}>
                  {reaction}
                </span>
              </div>
            )}

            {/* Settings panel */}
            {showSettings && (
              <div className="absolute bottom-20 right-4 z-30 bg-[#0c0818]/97 backdrop-blur-md border border-[#3d2060] rounded-2xl p-4 w-72 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-white">Настройки</p>
                  <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white">
                    <Icon name="X" size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">🎙 Озвучка</p>
                <div className="space-y-0.5 mb-4">
                  {VOICES.map(v => (
                    <button key={v} onClick={() => setVoice(v)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${voice === v ? 'bg-[#C084FC]/20 text-[#C084FC]' : 'text-gray-300 hover:bg-[#1a0e33] hover:text-white'}`}
                    >
                      {v} {voice === v && <Icon name="Check" size={13} />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">📺 Качество</p>
                <div className="space-y-0.5">
                  {QUALITIES.map(q => (
                    <button key={q} onClick={() => setQuality(q)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${quality === q ? 'bg-[#C084FC]/20 text-[#C084FC]' : 'text-gray-300 hover:bg-[#1a0e33] hover:text-white'}`}
                    >
                      {q} {quality === q && <Icon name="Check" size={13} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Center play/pause */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-[#C084FC]/80 transition-all"
              >
                <Icon name={isPlaying ? 'Pause' : 'Play'} size={26} className="text-white" />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group/bar hover:h-2.5 transition-all">
                <div className="h-full bg-[#C084FC] rounded-full relative" style={{ width: '42%' }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-[#C084FC] transition-colors">
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} />
                  </button>
                  <button onClick={() => setCurrentEp(e => Math.min(e + 1, anime.total))} className="text-white hover:text-[#C084FC] transition-colors">
                    <Icon name="SkipForward" size={18} />
                  </button>
                  <button className="text-white hover:text-[#C084FC] transition-colors">
                    <Icon name="Volume2" size={18} />
                  </button>
                  <span className="text-xs text-gray-300 tabular-nums">18:24 / 24:00</span>
                  <span className="text-xs text-gray-500 hidden md:block">· Серия {currentEp}/{anime.total}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowSettings(s => !s)}
                    className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-xs text-gray-200"
                  >
                    <Icon name="Mic2" size={11} />
                    <span className="max-w-[80px] truncate">{voice.split('(')[0].trim()}</span>
                  </button>
                  <button onClick={() => setShowSettings(s => !s)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-xs text-gray-200"
                  >
                    <Icon name="Tv2" size={11} />
                    {quality.split(' ')[0]}
                  </button>
                  <button onClick={() => setShowSettings(s => !s)}
                    className={`p-1.5 rounded-md transition-colors ${showSettings ? 'bg-[#C084FC]/30 text-[#C084FC]' : 'text-white hover:bg-white/10'}`}
                  >
                    <Icon name="Settings" size={15} />
                  </button>
                  <button onClick={toggleFullscreen}
                    className="p-1.5 rounded-md text-white hover:bg-white/10 hover:text-[#C084FC] transition-colors"
                  >
                    <Icon name={isFullscreen ? 'Minimize' : 'Maximize'} size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reactions bar */}
          <div className="shrink-0 px-5 py-3 flex items-center justify-between border-b border-[#2d1f4a]">
            <div className="flex items-center gap-1">
              {REACTIONS.map(r => (
                <button
                  key={r}
                  onClick={() => sendReaction(r)}
                  className="text-xl hover:scale-130 active:scale-90 transition-transform w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a0e33]"
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white text-xs h-8 gap-1">
                <Icon name="ThumbsUp" size={13} /> 4.2к
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white text-xs h-8 gap-1">
                <Icon name="Share2" size={13} /> Поделиться
              </Button>
            </div>
          </div>

          {/* Episodes list */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Все серии · {anime.total}</p>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
              {Array.from({ length: Math.min(anime.total, 12) }, (_, i) => i + 1).map(ep => (
                <button
                  key={ep}
                  onClick={() => setCurrentEp(ep)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border ${
                    currentEp === ep
                      ? 'bg-[#C084FC]/20 border-[#C084FC]/50 text-white'
                      : 'bg-[#0f0820] border-[#2d1f4a] hover:border-[#C084FC]/30 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={anime.image} alt="" className="w-16 h-10 object-cover rounded-lg" />
                    {currentEp === ep && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                        <Icon name="Play" size={14} className="text-[#C084FC]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Серия {ep}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">24 мин</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: chat panel */}
        <div className="w-[320px] shrink-0 flex flex-col border-l border-[#2d1f4a] bg-[#0c0818]">

          {/* Chat header with tabs */}
          <div className="shrink-0 border-b border-[#2d1f4a]">
            <div className="flex">
              <button
                onClick={() => setChatTab('chat')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${chatTab === 'chat' ? 'text-white border-b-2 border-[#C084FC]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                💬 Чат
              </button>
              <button
                onClick={() => setChatTab('episodes')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${chatTab === 'episodes' ? 'text-white border-b-2 border-[#C084FC]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                📋 Серии
              </button>
            </div>
            {chatTab === 'chat' && (
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">{messages.length} сообщений</span>
                <Badge className="bg-red-600/20 text-red-400 border-0 text-xs">🔴 Live</Badge>
              </div>
            )}
          </div>

          {/* Chat messages */}
          {chatTab === 'chat' && (
            <>
              <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 items-start py-1 rounded-lg px-1.5 ${msg.isMe ? 'bg-[#C084FC]/10' : 'hover:bg-[#1a0e33]/50'} transition-colors`}>
                    <span className="text-base shrink-0 mt-0.5">{msg.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-xs font-semibold ${msg.isMe ? 'text-[#C084FC]' : 'text-purple-300'}`}>{msg.user}</span>
                        <span className="text-[10px] text-gray-600">{msg.time}</span>
                      </div>
                      <p className="text-xs text-gray-200 break-words leading-relaxed mt-0.5">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick phrases */}
              <div className="shrink-0 px-3 py-2 flex gap-1.5 flex-wrap border-t border-[#2d1f4a]/50">
                {QUICK_PHRASES.map(p => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#1a0e33] hover:bg-[#2d1f4a] text-gray-300 hover:text-white border border-[#3d2060]/50 hover:border-[#C084FC]/40 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="shrink-0 px-3 pb-3 pt-2 border-t border-[#2d1f4a]">
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Написать в чат..."
                      className="bg-[#1a0e33] border-[#3d2060] text-white placeholder:text-gray-600 text-sm pr-10 focus:border-[#C084FC] h-9"
                    />
                    <button
                      onClick={() => setShowEmoji(!showEmoji)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors text-base"
                    >
                      😊
                    </button>
                  </div>
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    size="sm"
                    className="bg-[#C084FC] hover:bg-[#a855f7] text-black shrink-0 h-9 w-9 p-0 disabled:opacity-30"
                  >
                    <Icon name="Send" size={15} />
                  </Button>
                </div>
                {showEmoji && (
                  <div className="mt-2 grid grid-cols-8 gap-1 bg-[#1a0e33] rounded-xl p-2 border border-[#3d2060]">
                    {['😊','😂','🥹','😍','😎','🤩','😭','😤','🔥','❤️','💜','⚡','👏','🎉','💀','🤯','👑','⚔️','🌸','🎌'].map(e => (
                      <button key={e} onClick={() => { setInput(i => i + e); setShowEmoji(false) }} className="text-lg hover:scale-125 transition-transform">
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Episodes tab in chat panel */}
          {chatTab === 'episodes' && (
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {Array.from({ length: anime.total }, (_, i) => i + 1).map(ep => (
                <button
                  key={ep}
                  onClick={() => { setCurrentEp(ep); setChatTab('chat') }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border ${
                    currentEp === ep
                      ? 'bg-[#C084FC]/20 border-[#C084FC]/50'
                      : 'bg-[#0f0820] border-[#2d1f4a] hover:border-[#C084FC]/30'
                  }`}
                >
                  <img src={anime.image} alt="" className="w-14 h-9 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">Серия {ep}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">24 мин · {ep < currentEp ? '✅ Просмотрено' : ep === currentEp ? '▶ Сейчас' : '○ Не просмотрено'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounceUp {
          0% { transform: scale(0.5) translateY(40px); opacity: 1; }
          50% { transform: scale(1.2) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(-60px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}