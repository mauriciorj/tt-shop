import { Skeleton } from '@/components/ui/skeleton'

const SavedProductCardSkeleton = ({ cards = 6 }: { cards?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SavedProductCardSkeleton
