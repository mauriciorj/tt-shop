import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancelado',
}

export default function CanceledLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
