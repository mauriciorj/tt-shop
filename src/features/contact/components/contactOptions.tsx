'use client'

import { Mail, FileQuestionMark } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@useshopradar.com',
    link: 'mailto:contact@useshopradar.com',
  },
]

const ContactOptions = () => {
  return (
    <section className="py-16">
      <div>
        {/* <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto"> */}
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
          {/* Contact Info */}
          <div
            className="space-y-8 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Perguntas frequentes</h2>
              <p className="text-muted-foreground mb-8">
                Antes de enviar uma mensagem, sugerimos que você procure a sua
                dúvida na seção de perguntas frequentes.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="/suporte"
                className="glass-card rounded-xl p-6 flex items-start gap-4 hover:border-primary/50 transition-all duration-300 group block"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex justify-center items-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <FileQuestionMark className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    Suporte
                  </h3>
                  <p className="text-muted-foreground">Perguntas frequentes</p>
                </div>
              </a>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">
                Informações de contato
              </h2>
              <p className="text-muted-foreground mb-8">
                Entre em contato conosco por qualquer um dos canais abaixo.
                Nossa equipe geralmente responde em até 24 horas.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <a
                    key={info.title}
                    href={info.link}
                    className="glass-card rounded-xl p-6 flex items-start gap-4 hover:border-primary/50 transition-all duration-300 group block"
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex justify-center items-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactOptions
