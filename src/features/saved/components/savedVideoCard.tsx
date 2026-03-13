import { Heart, Eye, DollarSign, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/utils/number'
import { ITopVideosWithCategory } from '@/videos/types'

const SavedVideoCard = ({ video }: { video: ITopVideosWithCategory }) => {
  return (
    <div
      key={video.video_id}
      className="glass-card rounded-2xl overflow-hidden group"
    >
      <div className="relative">
        {video.image && (
          <img
            src={video.image}
            alt={video.description}
            className="w-full aspect-video object-cover"
          />
        )}
        <div className="absolute top-2 right-2">
          <Heart className="h-5 w-5 text-primary fill-primary" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {video.description}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          {video.category_name && (
            <Badge variant="secondary" className="text-xs">
              {video.category_name}
            </Badge>
          )}
          {video.tt_account && (
            <span className="text-xs text-muted-foreground ml-auto">
              {video.tt_account}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            {formatNumber(video.views)}
          </div>
          <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
            <ShoppingCart className="h-3 w-3" />
            {formatNumber(video.sales)}
          </div>
          <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            {formatNumber(video.revenue)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedVideoCard
