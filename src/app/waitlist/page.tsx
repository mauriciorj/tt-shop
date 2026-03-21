'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { CheckCircle, Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const waitlistSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  sells_on_tiktok: z.enum(['yes', 'no']),
  monthly_revenue: z.enum(['$0-$1000', '$1001-$5000', '+$5000']),
})

type WaitlistFormData = z.infer<typeof waitlistSchema>

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const joinWaitlist = useMutation(api.waitlist.joinWaitlist)

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      email: '',
      sells_on_tiktok: undefined,
      monthly_revenue: undefined,
    },
  })

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true)
    try {
      await joinWaitlist({
        name: data.name,
        email: data.email,
        sells_on_tiktok: data.sells_on_tiktok === 'yes',
        monthly_revenue: data.monthly_revenue,
      })
      setSubmitted(true)
    } catch {
      form.setError('root', {
        message: 'Erro ao entrar na lista. Tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {submitted ? (
          <div className="glass-card rounded-2xl p-10 flex flex-col items-center text-center gap-4 animate-fade-in">
            <CheckCircle className="h-14 w-14 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Você está na lista!
            </h2>
            <p className="text-muted-foreground">
              Obrigado por se inscrever. Vamos te avisar assim que sua vaga
              estiver disponível.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 animate-slide-up">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Lista de espera
              </h1>
              <p className="text-muted-foreground">
                Garanta seu acesso antecipado ao UseShopRadar.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
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
                  name="sells_on_tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Já vende no TikTok?</FormLabel>
                      <div className="flex gap-3">
                        {[
                          { value: 'yes', label: 'Sim' },
                          { value: 'no', label: 'Não' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                              field.value === option.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthly_revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faturamento mensal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="$0-$1000">$0 – $1.000</SelectItem>
                          <SelectItem value="$1001-$5000">
                            $1.001 – $5.000
                          </SelectItem>
                          <SelectItem value="+$5000">+ $5.000</SelectItem>
                        </SelectContent>
                      </Select>
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
                    'Entrar na lista'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  )
}
