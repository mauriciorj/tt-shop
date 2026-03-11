'use server'

import { Resend } from 'resend'
import { ContactFormData } from '@/contact/types'

export async function WebContactFormAction(values: ContactFormData) {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND)

    const { data, error } = await resend.emails.send({
      from: 'Use Shop Radar <noreply@useshopradar.com>',
      to: 'contato@useshopradar.com',
      subject: `Suporte - ${values.subject}`,
      html: `
      <p><strong>Nome:</strong> ${values.name}</p>
      <p><strong>Email:</strong> ${values.email}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${values.message}</p>
      `,
    })

    if (error) {
      return false
    }
    if (data) {
      return true
    }
  } catch (err) {
    return true
  }
}
