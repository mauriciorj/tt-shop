import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
