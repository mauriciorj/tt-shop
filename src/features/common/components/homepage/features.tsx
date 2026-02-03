import { TrendingUp, Store, BarChart3, Zap, Shield, Globe } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Rankings',
      description:
        'Track store performance with live data updates and trend analysis.',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description:
        'Comprehensive insights into revenue, followers, and growth metrics.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Monitor stores across all TikTok Shop regions worldwide.',
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Get notified when your tracked stores hit new milestones.',
    },
    {
      icon: Shield,
      title: 'Verified Data',
      description:
        'All metrics are verified and cross-referenced for accuracy.',
    },
    {
      icon: Store,
      title: 'Store Profiles',
      description:
        'Detailed profiles with product catalogs and seller information.',
    },
  ]
  return (
    <section className="py-24 flex items-center justify-center flex-col">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to
            <span className="gradient-text"> Win</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and insights to help you understand the TikTok
            Shop ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 group hover:border-primary/50 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
