import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vídeos',
}

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
