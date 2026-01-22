import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Store,
  BarChart3,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

const Page = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Rankings",
      description:
        "Track store performance with live data updates and trend analysis.",
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      description:
        "Comprehensive insights into revenue, followers, and growth metrics.",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Monitor stores across all TikTok Shop regions worldwide.",
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Get notified when your tracked stores hit new milestones.",
    },
    {
      icon: Shield,
      title: "Verified Data",
      description:
        "All metrics are verified and cross-referenced for accuracy.",
    },
    {
      icon: Store,
      title: "Store Profiles",
      description:
        "Detailed profiles with product catalogs and seller information.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50" />

          <div className="container relative">
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
                Track, analyze, and benchmark the top performing TikTok Shop
                stores. Make data-driven decisions to grow your e-commerce
                business.
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

        {/* Stats Section */}
        <section className="py-16 border-y border-border/40">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50K+", label: "Stores Tracked" },
                { value: "2M+", label: "Products Listed" },
                { value: "150+", label: "Countries" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 flex items-center justify-center flex-col">
          <div className="container">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4">
                Everything You Need to
                <span className="gradient-text"> Win</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools and insights to help you understand the
                TikTok Shop ecosystem.
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
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 flex items-center justify-center flex-col">
          <div className="container">
            <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
              <div className="relative">
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Dominate TikTok Shop?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of sellers using TikTokRank to stay ahead of
                  the competition.
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
      </main>
    </div>
  );
};

export default Page;
