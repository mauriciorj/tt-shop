'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Send, FileQuestionMark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/useToast'

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter menos de 100 caracteres'),
  email: z
    .string()
    .trim()
    .email('Endereço de email inválido')
    .max(255, 'Email deve ter menos de 255 caracteres'),
  subject: z
    .string()
    .trim()
    .min(1, 'Assunto é obrigatório')
    .max(200, 'Assunto deve ter menos de 200 caracteres'),
  message: z
    .string()
    .trim()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem deve ter menos de 1000 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@tiktokrank.com',
    link: 'mailto:support@tiktokrank.com',
  },
]

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: 'Message sent!',
      description: "We'll get back to you as soon as possible.",
    })

    form.reset()
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Entre em <span className="gradient-text">contato</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tem uma pergunta ou feedback? Nós adoramos ouvir de você.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="glass-card rounded-xl p-8 animate-slide-up">
              <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input placeholder="O que é isso sobre?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte-nos mais sobre sua consulta..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full glow-effect"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Info */}
            <div
              className="space-y-8 animate-slide-up"
              style={{ animationDelay: '100ms' }}
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Perguntas frequentes
                </h2>
                <p className="text-muted-foreground mb-8">
                  Antes de enviar uma mensagem, sugerimos que você procure a sua
                  dúvida na seção de perguntas frequentes.
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href="/support"
                  className="glass-card rounded-xl p-6 flex items-start gap-4 hover:border-primary/50 transition-all duration-300 group block"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex justify-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <FileQuestionMark className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      Suporte
                    </h3>
                    <p className="text-muted-foreground">
                      Perguntas frequentes
                    </p>
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
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex justify-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
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
    </div>
  )
}

export default Contact
