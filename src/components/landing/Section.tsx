import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import type { SectionProps } from "@/types"

const HERO_IMAGE = "https://cdn.poehali.dev/projects/4c6632cc-81fc-4454-b152-35adcbcad815/files/7262d15a-4834-4834-ab8f-7ab2f2cbc57a.jpg"

export default function Section({ id, title, subtitle, content, isActive, showButton, buttonText }: SectionProps) {
  const navigate = useNavigate()
  return (
    <section
      id={id}
      className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24"
      style={id === 'hero' ? {
        backgroundImage: `linear-gradient(to right, rgba(10,6,18,0.95) 40%, rgba(10,6,18,0.6) 100%), url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {subtitle && (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.div>
      )}
      <motion.h2
        className="text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-bold leading-[1.1] tracking-tight max-w-4xl text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {content && (
        <motion.p
          className="text-lg md:text-xl lg:text-2xl max-w-2xl mt-6 text-neutral-400"
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {content}
        </motion.p>
      )}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 md:mt-16"
        >
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/catalog')}
              className="text-[#C084FC] bg-transparent border-[#C084FC] hover:bg-[#C084FC] hover:text-black transition-colors"
            >
              {buttonText}
            </Button>
            {id === 'hero' && (
              <Button
                size="lg"
                onClick={() => navigate('/cards')}
                className="bg-transparent text-gray-300 border border-gray-600 hover:border-white hover:text-white transition-colors"
              >
                🎴 Карты
              </Button>
            )}
            {id === 'join' && (
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-transparent text-gray-300 border border-gray-600 hover:border-white hover:text-white transition-colors"
              >
                Регистрация
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </section>
  )
}