import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suporte',
}

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
