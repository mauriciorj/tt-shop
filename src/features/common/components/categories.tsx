import { cn } from '@/utils/utils'
import HoverCardUpgradePlan from '@/components/hoverCardUpgradePlan'

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
      style={{ animationDelay: '200ms' }}
    >
      <div className="mb-5">
        <span className="text-md font-bold text-primary">Categorias:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories?.map(
          (category) =>
            category.id &&
            category.label && (
              <HoverCardUpgradePlan
                key={category.id}
                isToShowTheHoverCard={isFreeUser}
              >
                <button
                  onClick={() => {
                    if (!isFreeUser) {
                      setCurrentPage(1)
                      setSelectedCategory(category.id!)
                    }
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isFreeUser && 'cursor-not-allowed',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
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
