import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produto em Beta',
}

export default function ProductBetaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
