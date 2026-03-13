import { cn } from '@/utils/utils'
import HoverCardUpgradePlan from '@/components/hoverCardUpgradePlan'

const Categories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
  userSubscriptionPlan,
}: {
  categories:
    | {
        id: string | null
        label: string | null | undefined
      }[]
    | null
    | undefined
  selectedCategory: string | null
  setSelectedCategory: (category: string) => void
  setCurrentPage: (page: number) => void
  userSubscriptionPlan: string
}) => {
  return (
    <div
      className="space-y-3 mb-6 animate-slide-up"
      style={{ animationDelay: '200ms' }}
    >
      <div className="flex flex-wrap gap-2">
        {categories?.map(
          (category) =>
            category.id &&
            category.label && (
              <HoverCardUpgradePlan
                key={category.id}
                isToShowTheHoverCard={userSubscriptionPlan === 'free'}
              >
                <button
                  onClick={() => {
                    if (userSubscriptionPlan !== 'free') {
                      setCurrentPage(1)
                      setSelectedCategory(category.id!)
                    }
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    userSubscriptionPlan === 'free' && 'cursor-not-allowed',
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
