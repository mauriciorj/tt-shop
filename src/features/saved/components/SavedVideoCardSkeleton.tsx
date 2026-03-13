import { Skeleton } from '@/components/ui/skeleton'

const SavedVideoCardSkeleton = ({ cards = 6 }: { cards?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="glass-card rounded-2xl overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-24 ml-auto" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SavedVideoCardSkeleton
