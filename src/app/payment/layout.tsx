import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagamento',
}

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
