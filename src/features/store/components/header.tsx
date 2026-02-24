'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IStoresWithCategory } from '@/stores/types'

const Header = ({ store }: { store: IStoresWithCategory }) => {
  return (
    <div className="glass-card rounded-2xl p-2 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        {store?.image && (
          <div className="relative">
            <Image
              src={store.image}
              alt={store.name}
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
              {store.name}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {store.category_name}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {/* <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button> */}
          <Button className="bg-primary hover:bg-primary/90">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Store
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header
