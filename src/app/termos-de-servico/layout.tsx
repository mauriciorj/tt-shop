import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Serviço',
}

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
