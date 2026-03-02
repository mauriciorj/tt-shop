'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

const Pricing = () => {
  return (
    <section
      id="price"
      className="py-24 border-t border-border/40 flex justify-center"
    >
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you
            grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div
            className="glass-card rounded-2xl p-8 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground">
                Perfect for getting started
              </p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Track up to 10 stores',
                'Basic analytics dashboard',
                'Daily ranking updates',
                'Email support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/stores"
              className="block w-full text-center px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div
            className="glass-card rounded-2xl p-8 relative border-primary/50 animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground">
                For serious sellers & analysts
              </p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Unlimited store tracking',
                'Advanced analytics & insights',
                'Real-time ranking updates',
                'Custom alerts & notifications',
                'API access',
                'Priority support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/stores"
              className="block w-full text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
