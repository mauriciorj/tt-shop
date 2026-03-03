import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    Produto: [{ label: 'Preço', href: '/#price' }],
    Recursos: [
      { label: 'Documentação', href: '#' },
      { label: 'Suporte', href: '#' },
    ],
    Empresa: [
      { label: 'Sobre', href: '/about' },
      { label: 'Contato', href: '/contato' },
    ],
    Legal: [
      { label: 'Privacidade', href: '#' },
      { label: 'Termos', href: '#' },
    ],
  }

  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container items-center py-12 px-10 mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                TikTok<span className="gradient-text">Rank</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Descubra e rastreie as melhores lojas no TikTok Shop.
            </p>
            {/* <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div> */}
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Use Shop Radar. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
