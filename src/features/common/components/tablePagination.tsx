import HoverCardUpgradePlan from '@/components/hoverCardUpgradePlan'

const TablePagination = ({
  currentPage,
  isFreeUser,
  onPageChange,
  totalPages,
}: {
  currentPage: number
  isFreeUser: boolean
  onPageChange: (page: number) => void
  totalPages: number | undefined
}) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // For a smooth scrolling experience
    })
  }
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <HoverCardUpgradePlan
          key="pagina-anterior"
          isToShowTheHoverCard={isFreeUser}
        >
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
          >
            Anterior
          </button>
        </HoverCardUpgradePlan>
        {Array.from(
          { length: totalPages ? Math.min(5, totalPages) : 0 },
          (_, i) => {
            const page = i + 1
            return (
              <HoverCardUpgradePlan
                key={`pagina-${page}`}
                isToShowTheHoverCard={isFreeUser}
              >
                <button
                  key={page}
                  onClick={() => {
                    onPageChange(page)
                    scrollToTop()
                  }}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {page}
                </button>
              </HoverCardUpgradePlan>
            )
          }
        )}
        <HoverCardUpgradePlan
          key="pagina-proxima"
          isToShowTheHoverCard={isFreeUser}
        >
          <button
            className="cursor-pointer px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
            disabled={currentPage === totalPages}
            onClick={() => {
              onPageChange(currentPage + 1)
              scrollToTop()
            }}
          >
            Próxima
          </button>
        </HoverCardUpgradePlan>
      </div>
    </div>
  )
}

export default TablePagination
