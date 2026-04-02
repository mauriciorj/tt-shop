import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface VideoCardSkeletonProps {
  cards?: number
}

const VideoCardSkeleton = ({ cards = 12 }: VideoCardSkeletonProps) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up"
      style={{ animationDelay: '300ms' }}
    >
      {Array.from({ length: cards }).map((_, index) => (
        <Card
          key={index}
          className="p-0 m-0 glass-card border-border/50 overflow-hidden"
        >
          {/* Thumbnail */}
          <Skeleton className="w-full aspect-[9/16]" />

          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-6 w-6 rounded-md shrink-0" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-7">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default VideoCardSkeleton
