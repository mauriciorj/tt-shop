'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  HelpCircle,
  MessageCircle,
  //   FileText,
  //   Video,
  //   Mail,
  //   Phone,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const supportAreas = [
  {
    icon: HelpCircle,
    title: 'Ajuda',
    description: 'Acesse nossa base de conhecimento para encontrar respostas',
    link: '#',
  },
  //   {
  //     icon: FileText,
  //     title: 'Documentation',
  //     description: 'Detailed guides and API references',
  //     link: '#',
  //   },
  //   {
  //     icon: Video,
  //     title: 'Video Tutorials',
  //     description: 'Step-by-step video walkthroughs',
  //     link: '#',
  //   },
  //   {
  //     icon: MessageCircle,
  //     title: 'Community',
  //     description: 'Connect with other users and experts',
  //     link: '#',
  //   },
  //   {
  //     icon: Mail,
  //     title: 'Email Support',
  //     description: 'Get help from our support team',
  //     link: '#',
  //   },
  //   {
  //     icon: Phone,
  //     title: 'Contact Sales',
  //     description: 'Talk to our sales team for enterprise',
  //     link: '#',
  //   },
]

const faqs = [
  {
    question: 'Como faço para adicionar uma nova loja?',
    answer:
      "Para adicionar uma nova loja, navegue para a página de Lojas e clique em 'Adicionar Loja'. Insira o URL ou nome de usuário da loja, e nosso sistema irá automaticamente iniciar o rastreamento de suas métricas de desempenho.",
  },
]

const Suporte = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Como podemos <span className="gradient-text">ajudar você?</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Procure na nossa base de conhecimento ou navegue pelas categorias
              abaixo
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Procure por respostas..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Areas Cards */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Navegue pelas categorias abaixo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supportAreas.map((area, index) => {
              const Icon = area.icon
              return (
                <Link
                  key={area.title}
                  href={area.link}
                  className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {area.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-border/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Perguntas <span className="gradient-text">Frequentes</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Encontre respostas rápidas para perguntas comuns sobre Use Shop
              Radar
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="glass-card rounded-xl px-6 border-none"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 glass-card rounded-xl">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum resultado encontrado para {searchQuery}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Tente palavras-chave diferentes ou navegue pelas categorias
                  acima
                </p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Ainda tem perguntas?</p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect"
            >
              <MessageCircle className="h-5 w-5" />
              Contate o suporte
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Suporte
