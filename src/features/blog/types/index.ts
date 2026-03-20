import { ReactNode } from 'react'

export interface BlogPost {
  id: string
  title: string
  short_description: string
  content: ReactNode
  category: string
  date: string
  readTime: string
  image: string
  slug: string
  tags: string[]
}
