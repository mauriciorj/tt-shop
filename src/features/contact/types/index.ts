import { z } from 'zod'

export const contactSchema = z.object({
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

export type ContactFormData = z.infer<typeof contactSchema>
