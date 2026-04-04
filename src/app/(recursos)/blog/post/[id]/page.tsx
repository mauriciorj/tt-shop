import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Clock, Tag } from 'lucide-react'
import { blogPosts } from '../../posts/control'
import { Badge } from '@/components/ui/badge'
import CallToAction from '@/components/homepage/callToAction'
import { ArrowLeft } from 'lucide-react'

export const revalidate = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = blogPosts.find((p) => p.slug === id)

  if (!post) return { title: 'Post não encontrado' }

  return {
    title: post.title,
    description: post.short_description,
    openGraph: {
      title: post.title,
      description: post.short_description,
      images: [post.image],
      locale: 'pt_BR',
      type: 'article',
      siteName: 'UseShopRadar',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.slug }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = blogPosts.find((p) => p.slug === id)

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para blog
        </Link>
        {/* Cover image */}
        {post.image && (
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
          <span className="text-sm text-muted-foreground">{post.date}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Short description */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {post.short_description}
        </p>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-10">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <CallToAction />
      </main>
    </div>
  )
}
