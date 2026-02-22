import { cn } from '@/utils/utils'

const Categories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}: {
  categories:
    | {
        id: string
        label: string | null | undefined
        subcategories?: { id: string; label: string }[]
      }[]
    | null
  selectedCategory: string | null
  setSelectedCategory: (category: string) => void
  setCurrentPage: (page: number) => void
}) => {
  return (
    <div
      className="space-y-3 mb-6 animate-slide-up"
      style={{ animationDelay: '200ms' }}
    >
      <div className="flex flex-wrap gap-2">
        {categories?.map(
          (category) =>
            category.label && (
              <button
                key={category.id}
                onClick={() => {
                  setCurrentPage(1)
                  setSelectedCategory(category.id)
                }}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {category.label}
              </button>
            )
        )}
      </div>
    </div>
  )
}

export default Categories
