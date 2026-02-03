import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative py-24 overflow-hidden flex justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50" />

      <div className="container w-full">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" />
            Powered by real-time analytics
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Discover the Best
            <br />
            <span className="gradient-text">TikTok Stores</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track, analyze, and benchmark the top performing TikTok Shop stores.
            Make data-driven decisions to grow your e-commerce business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/stores"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-effect"
            >
              Explore Rankings
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-secondary/80 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
