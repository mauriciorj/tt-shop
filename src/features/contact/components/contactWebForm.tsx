'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { WebContactFormAction } from '@/actions/webContactForm'
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
import { contactSchema, ContactFormData } from '@/contact/types'

const ContactWebForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    try {
      const response = await WebContactFormAction(data)

      if (!response) {
        toast.error('Erro ao enviar mensagem!')
      } else {
        toast.success('Mensagem enviada com sucesso!')
      }
    } catch {
      toast.error('Erro ao enviar mensagem!')
    } finally {
      form.reset()
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <Input type="email" placeholder="seu@email.com" {...field} />
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
  )
}

export default ContactWebForm
