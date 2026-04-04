import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Loading from './loading'

export const metadata: Metadata = {
  title: 'Produto',
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}
