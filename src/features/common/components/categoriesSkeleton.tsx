import { Skeleton } from '@/components/ui/skeleton'

const CATEGORY_WIDTHS = ['w-20', 'w-24', 'w-16', 'w-28', 'w-20', 'w-24', 'w-16', 'w-20']

const CategoriesSkeleton = () => {
  return (
    <div
      className="space-y-3 mb-6 animate-slide-up"
      style={{ animationDelay: '200ms' }}
    >
      <div className="flex flex-wrap gap-2">
        {CATEGORY_WIDTHS.map((width, index) => (
          <Skeleton key={index} className={`h-9 ${width} rounded-full`} />
        ))}
      </div>
    </div>
  )
}

export default CategoriesSkeleton
