import { cn } from '@/utils/utils'
import HoverCardUpgradePlan from '@/components/hoverCardUpgradePlan'

export type TPeriod = '7' | '14' | '30'

const PERIODS: { id: TPeriod; label: string }[] = [
  { id: '7', label: '7 dias' },
  { id: '14', label: '14 dias' },
  { id: '30', label: '30 dias' },
]

const PeriodFilter = ({
  isFreeUser,
  selectedPeriod,
  setSelectedPeriod,
  setCurrentPage,
}: {
  isFreeUser: boolean
  selectedPeriod: TPeriod
  setSelectedPeriod: (period: TPeriod) => void
  setCurrentPage: (page: number) => void
}) => {
  return (
    <div
      className="space-y-3 animate-slide-up mb-10"
      style={{ animationDelay: '250ms' }}
    >
      <div className="mb-5">
        <span className="text-md font-bold text-primary">Período:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((period) => (
          <HoverCardUpgradePlan
            key={period.id}
            isToShowTheHoverCard={isFreeUser}
          >
            <button
              key={period.id}
              onClick={() => {
                setCurrentPage(1)
                setSelectedPeriod(period.id)
              }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                selectedPeriod === period.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {period.label}
            </button>
          </HoverCardUpgradePlan>
        ))}
      </div>
    </div>
  )
}

export default PeriodFilter
