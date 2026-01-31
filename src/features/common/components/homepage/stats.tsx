const Stats = () => {
  return (
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
  );
};

export default Stats;
