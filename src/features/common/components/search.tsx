'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { IStoreWithCategory } from '@/stores/types'
import { IProductWithCategory } from '@/products/types'
import Image from 'next/image'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

interface SearchBarProps {
  data: IStoreWithCategory[] | IProductWithCategory[]
  isStore?: boolean
  placeholder?: string
  clerkId?: string
  isFreeUser?: boolean
}

const SearchBar = ({
  data,
  isStore = true,
  placeholder = 'Search data...',
  clerkId,
  isFreeUser = false,
}: SearchBarProps) => {
  const router = useRouter()
  const recordSearch = useMutation(api.users.recordSearchAndCheckLimit)

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions =
    query.length > 0
      ? data
          .filter((item: IStoreWithCategory | IProductWithCategory) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
      : []

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = async (
    item: IStoreWithCategory | IProductWithCategory
  ) => {
    if (isFreeUser && clerkId) {
      const result = await recordSearch({ clerk_id: clerkId })
      if (!result.allowed) {
        toast.error(
          'Você atingiu o limite de 3 pesquisas por dia. Faça upgrade para pesquisar sem limites.',
          {
            action: {
              label: 'Ver planos',
              onClick: () => router.push('/subscription'),
            },
            duration: 6000,
          }
        )
        setIsOpen(false)
        return
      }
    }
    router.push(
      `${isStore ? '/store' : '/product'}/${item.name.toLowerCase().replace(/\s/g, '-')}`
    )
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      handleSearchSubmit(suggestions[highlightedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div
      className="relative z-20 flex justify-center mb-8 animate-slide-up"
      style={{ animationDelay: '250ms' }}
    >
      <div className="flex gap-3 w-full max-w-2xl" ref={containerRef}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <input
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            onChange={(e) => {
              setHighlightedIndex(-1)
              setIsOpen(true)
              setQuery(e.target.value)
            }}
            onFocus={() => query.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            type="text"
            value={query}
          />

          {/* Autocomplete Dropdown */}
          {isOpen && suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-[100]">
              {suggestions?.map((item, index) => (
                <button
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                    highlightedIndex === index
                      ? 'bg-primary/10'
                      : 'hover:bg-secondary/50'
                  }`}
                  key={item.name}
                  onClick={() =>
                    handleSearchSubmit(
                      item as IStoreWithCategory | IProductWithCategory
                    )
                  }
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {item?.image && (
                    <Image
                      alt={item.name}
                      className="w-8 h-8 rounded-lg object-cover"
                      height={32}
                      src={item.image}
                      width={32}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {isOpen && query.length > 0 && suggestions.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl p-4 z-[100]">
              <p className="text-sm text-muted-foreground text-center">
                Nenhum resultado
              </p>
            </div>
          )}
        </div>
        {/* <button className="flex items-center gap-2 h-12 px-5 rounded-xl bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors">
        <SlidersHorizontal className="h-5 w-5" />
        <span className="hidden sm:inline font-medium">Filters</span>
      </button> */}
      </div>
    </div>
  )
}

export default SearchBar
