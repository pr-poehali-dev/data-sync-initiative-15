import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Icon from '@/components/ui/icon'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/catalog')
  }

  return (
    <div className="min-h-screen bg-[#0a0612] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => navigate('/')} className="text-[#C084FC] font-bold text-2xl mb-10 block text-center w-full">
          AniStream
        </button>
        <div className="bg-[#0f0820] border border-[#2d1f4a] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">С возвращением!</h1>
          <p className="text-gray-400 text-sm mb-8">Войди, чтобы продолжить просмотр</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-gray-300 mb-1.5 block">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#1a0e33] border-[#3d2060] text-white placeholder:text-gray-600 focus:border-[#C084FC]"
              />
            </div>
            <div>
              <Label className="text-gray-300 mb-1.5 block">Пароль</Label>
              <div className="relative">
                <Input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#1a0e33] border-[#3d2060] text-white placeholder:text-gray-600 focus:border-[#C084FC] pr-10"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <Icon name={show ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#C084FC] hover:bg-[#a855f7] text-black font-bold py-5">
              Войти
            </Button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Нет аккаунта?{' '}
            <button onClick={() => navigate('/register')} className="text-[#C084FC] hover:underline font-medium">
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
