'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Search, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { blogPosts } from './posts/control'
import Card from '@/blog/components/card'

export const blogCategories = ['Todos']

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.short_description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      const matchesCategory =
        activeCategory === 'Todos' || post.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  const [featuredPost, ...restPosts] = filteredPosts

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((p) => p.tags))),
    []
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        {/* Hero */}
        <section className="border-b border-border/40 bg-card/30">
          <div className="container py-16 md:py-20">
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Blog <span className="gradient-text">UseShopRadar</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Insights, estratégias e análises para dominar o TikTok Shop com
                dados reais.
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border/60"
                  aria-label="Buscar artigos no blog"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-border/40 sticky top-16 z-40 bg-background/80 backdrop-blur-xl">
          <div className="container">
            <nav
              className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide"
              aria-label="Categorias do blog"
            >
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Posts */}
        <section className="container py-12">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Nenhum artigo encontrado para sua busca.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured */}
              {featuredPost && (
                <Link href={`/blog/post/${featuredPost.slug}`}>
                  <div className="animate-slide-up">
                    <Card post={featuredPost} featured />
                  </div>
                </Link>
              )}

              {/* Grid */}
              {restPosts.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {restPosts.map((post, i) => (
                    <Link key={post.id} href={`/blog/post/${post.slug}`}>
                      <div
                        className="animate-slide-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <Card post={post} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Tags / SEO sidebar */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="container py-12">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Tags Populares
            </h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Blog
