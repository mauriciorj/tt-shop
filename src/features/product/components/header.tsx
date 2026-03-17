'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, MoveUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IProductsWithCategory } from '@/products/types'

const Header = ({
  product,
  isBlog,
}: {
  product: IProductsWithCategory
  isBlog?: boolean
}) => {
  return (
    <div className="glass-card rounded-2xl p-2 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        {product?.image && (
          <div className="relative">
            <Image
              src={product.image}
              alt={product.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-primary/20"
              width={128}
              height={128}
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap justify-between gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {product.category_name}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        {isBlog ? (
          <div className="flex gap-3">
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect"
            >
              Começar agora
              <MoveUpRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            {/* <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button> */}
            <Button className="bg-primary hover:bg-primary/90">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Product
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
