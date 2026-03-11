import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const features = [
  { name: 'Simples de usar', shopradar: true, others: false },
  { name: 'Focado em afiliados', shopradar: true, others: false },
  { name: 'Preço acessível', shopradar: true, others: false },
  { name: 'Dados úteis', shopradar: true, others: true },
]

const ComparisonSection = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 bg-secondary/30 px-4">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container max-w-3xl">
        <div className="text-center mb-14 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold">
            Feito para afiliados{' '}
            <span className="gradient-text">brasileiros</span>
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block glass-card rounded-2xl overflow-hidden animate-slide-up">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-5 text-muted-foreground font-medium">
                  Funcionalidade
                </th>
                <th className="p-5 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
                      Recomendado
                    </Badge>
                    <span className="font-bold text-lg">ShopRadar</span>
                  </div>
                </th>
                <th className="p-5 text-center">
                  <span className="font-medium text-muted-foreground text-lg">
                    Outras ferramentas
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f.name}
                  className={`border-b border-border/30 last:border-0 ${
                    i % 2 === 0 ? 'bg-muted/20' : ''
                  }`}
                >
                  <td className="p-5 font-medium">{f.name}</td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      {f.others ? (
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                          <X className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {features.map((f, i) => (
            <div
              key={f.name}
              className="glass-card rounded-xl p-5 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="font-semibold mb-3">{f.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">ShopRadar</span>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    f.others ? 'bg-primary/10' : 'bg-destructive/10'
                  }`}
                >
                  {f.others ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-sm text-muted-foreground">Outras</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom wave divider */}
      <div className="absolute -bottom-px left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-10"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  )
}

export default ComparisonSection
