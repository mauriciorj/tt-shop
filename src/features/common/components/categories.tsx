import HoverCardUpgradePlan from '@/components/hoverCardUpgradePlan'
import { cn } from '@/utils/utils'

const Categories = ({
  categories,
  isFreeUser,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}: {
  categories:
    | {
        id: string | null | undefined
        label: string | null | undefined
      }[]
    | null
    | undefined
  isFreeUser: boolean
  selectedCategory: string | null
  setSelectedCategory: (category: string) => void
  setCurrentPage: (page: number) => void
}) => {
  return (
    <div
      className="space-y-3 animate-slide-up mb-10"
      data-testid="categories"
      style={{ animationDelay: '200ms' }}
    >
      <div className="mb-5" data-testid="categories-title">
        <span
          className="text-md font-bold text-primary"
          data-testid="categories-title-label"
        >
          Categorias:
        </span>
      </div>
      <div className="flex flex-wrap gap-2" data-testid="categories-list">
        {categories?.map(
          (category) =>
            category.id &&
            category.label && (
              <HoverCardUpgradePlan
                isToShowTheHoverCard={isFreeUser}
                key={category.id}
              >
                <button
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isFreeUser && 'cursor-not-allowed',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                  data-testid={`category-button-${category.id}`}
                  onClick={() => {
                    if (!isFreeUser) {
                      setCurrentPage(1)
                      setSelectedCategory(category.id!)
                    }
                  }}
                >
                  {category.label}
                </button>
              </HoverCardUpgradePlan>
            )
        )}
      </div>
    </div>
  )
}

export default Categories
