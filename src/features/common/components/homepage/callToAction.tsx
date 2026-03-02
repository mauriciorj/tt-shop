import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CallToAction = () => {
  return (
    <section className="py-24 flex items-center justify-center flex-col">
      <div className="container">
        <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="hidden md:block relative">
            <h2 className="text-4xl font-bold mb-4">
              Se você quer{' '}
              <span className="gradient-text">ganhar dinheiro</span> no TikTok
              Shop,
            </h2>
            <h2 className="text-4xl font-bold mb-10">
              precisa saber o que <span className="gradient-text">vende</span>.
            </h2>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-effect"
            >
              🔎 Explorar produtos lucrativos agora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="block md:hidden relative">
            <h2 className="text-4xl font-bold mb-4">
              Se você quer{' '}
              <span className="gradient-text">ganhar dinheiro</span> no TikTok
              Shop, precisa saber o que{' '}
              <span className="gradient-text">vende</span>.
            </h2>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-effect"
            >
              🔎 Explorar produtos lucrativos agora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
