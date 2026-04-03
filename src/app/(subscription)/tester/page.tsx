'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { CheckCircle2, FlaskConical, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const testerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  tiktok_account: z
    .string()
    .min(1, 'Informe sua conta do TikTok')
    .transform((v) => (v.startsWith('@') ? v : `@${v}`)),
})

type TesterFormData = z.infer<typeof testerSchema>

export default function TesterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const joinTesterInvite = useMutation(api.waitlist.joinTesterInvite)

  const form = useForm<TesterFormData>({
    resolver: zodResolver(testerSchema),
    defaultValues: {
      name: '',
      email: '',
      tiktok_account: '',
    },
  })

  const onSubmit = async (data: TesterFormData) => {
    setIsSubmitting(true)
    try {
      const result = await joinTesterInvite({
        name: data.name,
        email: data.email,
        tiktok_account: data.tiktok_account,
      })
      setAlreadyRegistered(result.alreadyRegistered)
      setSubmitted(true)
    } catch {
      form.setError('root', {
        message: 'Erro ao enviar convite. Tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[700px]">
        {submitted ? (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {alreadyRegistered ? 'Você já está cadastrado!' : 'Tudo certo! 🎉'}
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {alreadyRegistered
                ? 'Já temos seu email na lista. Entraremos em contato em breve.'
                : 'Obrigado por se candidatar como tester. Nossa equipe entrará em contato com os próximos passos.'}
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 animate-slide-up">
            <div className="text-center mb-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                <FlaskConical className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Seja um <span className="gradient-text">Tester</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Acesso antecipado e exclusivo. Ajude a moldar o produto.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="glass-card p-8 rounded-2xl space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
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
                  name="tiktok_account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conta do TikTok</FormLabel>
                      <FormControl>
                        <Input placeholder="@suaconta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <p className="text-sm text-destructive text-center">
                    {form.formState.errors.root.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full glow-effect"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Quero ser tester'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </main>
    </div>
  )
}
