import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CallToAction = () => {
  return (
    <section className="py-24 flex items-center justify-center flex-col">
      <div className="container">
        <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="relative">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Dominate TikTok Shop?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of sellers using TikTokRank to stay ahead of the
              competition.
            </p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-effect"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
