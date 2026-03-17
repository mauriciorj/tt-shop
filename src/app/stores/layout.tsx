import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lojas',
}

export default function StoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
