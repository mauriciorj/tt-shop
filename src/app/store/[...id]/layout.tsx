import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Loading from './loading'

export const metadata: Metadata = {
  title: 'Loja',
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}
